"""Generate the n8n workflow that follows official government and secretariat news feeds.

    python n8n/workflows/build_official_sources.py      # writes n8n/workflows/official-sources.json

Like Digital Policy Alert's method, but only for trade agreements: the leads come straight
from official sources (trade ministries, the WTO, regional secretariats) instead of news
search. Which feeds to read lives in the `sources` table (ids starting with "off-"), so a
new feed is a new row, not a change to this flow. Items that do not look like agreement
news (keyword check) are only marked as seen; the rest go through the same AI matching and
checks as the global news flow, with the source's own tier (S = official).

Started by hand, from the web app, or by the scheduler when auto-update is on.
"""
from __future__ import annotations

from pathlib import Path

from n8n_build import (FLOW_PATHS, GEMINI_CRED, JS_PARSE_RSS, PAD, SB, STEP, UA, Workflow,
                       js_news_finish, js_news_plan, js_news_validate, xs)

OUT = Path(__file__).with_name("official-sources.json")

wf = Workflow("TtOfficialSrc001", "官方來源追蹤")
node, http, code, section = wf.node, wf.http, wf.code, wf.section

# ─── JavaScript snippets ──────────────────────────────────────────────────

JS_CONFIG = r"""
// 流程設定。每次最多送幾則給 AI 讀資料庫 update_settings(news),在網頁「資料狀態」頁看得到。
const settings = $('讀取更新設定').first().json;
const sources = $('讀取來源設定').all().map((i) => i.json).filter((s) => s && s.id);
return [{ json: {
  model: 'gemini-2.5-flash',
  lookbackDays: 45,          // 第一次看到的項目,只有近 45 天內的才送 AI;更早的只記為已看過
  maxLlmItems: settings.max_llm_items ?? 30,
  maxCandidates: 12,         // 每則最多提供幾個候選協定給 AI
  storyLookbackDays: 60,     // 判斷「是不是同一件事」時,參考近 60 天的已知事件
  sources: Object.fromEntries(sources.map((s) => [s.id, s])),
  sourceIds: sources.map((s) => s.id),
} }];
"""

JS_LIST = r"""
// 每個啟用的官方來源輸出一筆,下一步逐一抓取
const cfg = $('設定').first().json;
return Object.values(cfg.sources).filter((s) => s.enabled && s.url).map((s) => ({ json: { id: s.id, url: s.url } }));
"""

JS_COLLECT = JS_PARSE_RSS + r"""
// 把每個來源的回應整理成項目;抓不到的來源記下錯誤(資料狀態頁的燈號會變色)
const cfg = $('設定').first().json;
const listed = $('列出要抓的來源').all().map((i) => i.json);
const strip = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const rows = [], stats = {};
for (const s of Object.values(cfg.sources)) if (!s.enabled) stats[s.id] = { status: 'skipped', fetched: 0, relevant: 0, error: null };
$input.all().forEach((res, idx) => {
  const src = cfg.sources[listed[res.pairedItem?.item ?? idx]?.id];
  if (!src) return;
  const body = res.json?.data;
  if (res.json?.error || typeof body !== 'string') {
    stats[src.id] = { status: 'error', fetched: 0, relevant: 0, error: String(res.json?.error?.message ?? res.json?.error ?? 'no data') };
    return;
  }
  const items = parseFeed(body).filter((e) => e.title && (e.link || e.guid));
  stats[src.id] = { status: items.length ? 'ok' : 'empty', fetched: items.length, relevant: items.length, error: null };
  for (const e of items) {
    rows.push({ source_id: src.id, item_key: (e.guid || e.link).slice(0, 500), title: strip(e.title).slice(0, 500),
                url: e.link, published_at: isoDate(e.pubDate),
                raw: { description: strip(e.description).slice(0, 800), publisher_domain: host(e.link),
                       tier: src.tier, lang: src.config?.lang ?? null, jurisdiction: src.config?.jurisdiction ?? null } });
  }
});
return [{ json: { rows, stats } }];
"""

# Items that may concern a trade agreement (English, Spanish/Portuguese, Chinese). Everything
# else from a ministry's feed (visits, appointments, aid) is only marked as seen.
ON_TOPIC = r"""((t) => /(agreement|\bFTA\b|free[- ]trade|trade (deal|pact|negotiat|talks)|partnership agreement|\bCEPA\b|\bEPA\b|accession|treaty|protocol|joint statement|reciprocal trade|digital (economy|trade)|entry into force|enters? into force|ratif|acuerdo|tratado|libre comercio|acordo|livre com[eé]rcio|協定|協議|自由貿易|經濟合作|夥伴|簽署|生效|談判|洽簽|CPTPP|ECFA|RCEP)/i.test(t))"""

# ─── Layout ───────────────────────────────────────────────────────────────

MAIN_Y = 700
AI_Y = 420
TRIGGER = ('($("網頁或排程觸發").isExecuted && $("網頁或排程觸發").first().json.body?.trigger === "scheduled"'
           ' ? "scheduled" : "manual")')
PAGINATE = {"paginationMode": "updateAParameterInEachRequest",
            "parameters": {"parameters": [{"type": "qs", "name": "offset", "value": "={{ $pageCount * 1000 }}"}]},
            "paginationCompleteWhen": "other", "completeExpression": "={{ $response.body.length < 1000 }}",
            "limitPagesFetched": True, "maxRequests": 10}

S1 = xs(0, 5)
S2 = xs(S1[-1] + STEP + 160, 3)
S3 = xs(S2[-1] + STEP + 160, 8)
S4 = xs(S3[-1] + STEP + 80, 3)
S5 = xs(S4[-1] + STEP + 160, 5)

# ─── Nodes ────────────────────────────────────────────────────────────────

trigger = node("手動執行", "n8n-nodes-base.manualTrigger", 1, [S1[0], MAIN_Y], {}, note="在 n8n 畫面按執行")
hook = wf.webhook("網頁或排程觸發", [S1[0], MAIN_Y + 200], FLOW_PATHS["official"], note="網頁按鈕或排程呼叫")
settings = http("讀取更新設定", [S1[1], MAIN_Y], "GET", f"{SB}/update_settings",
                query=[{"name": "pipeline", "value": "eq.news"}, {"name": "select", "value": "max_llm_items,auto_enabled"}],
                executeOnce=True, note="讀「每次最多送幾則給 AI」")
srcs = http("讀取來源設定", [S1[2], MAIN_Y], "GET", f"{SB}/sources",
            query=[{"name": "id", "value": "like.off-*"},
                   {"name": "select", "value": "id,name_zh,enabled,tier,url,config"}, {"name": "order", "value": "id"}],
            executeOnce=True, note="官方來源清單(off- 開頭)")
config = code("設定", [S1[3], MAIN_Y], JS_CONFIG, note="流程參數集中在這裡")
run = http("建立執行紀錄", [S1[4], MAIN_Y], "POST", f"{SB}/pipeline_runs",
           headers=[{"name": "Prefer", "value": "return=representation"}],
           body='={{ JSON.stringify({ pipeline: "news", trigger: ' + TRIGGER + ', runner: "n8n", status: "running" }) }}',
           executeOnce=True, note="資料庫記一筆「執行中」")

listing = code("列出要抓的來源", [S2[0], MAIN_Y], JS_LIST, note="每個啟用的來源一筆")
fetch = http("抓取官方來源", [S2[1], MAIN_Y], "GET", "={{ $json.url }}", cred=None, text=True, headers=[UA],
             timeout=30000, retryOnFail=True, maxTries=3, waitBetweenTries=3000, onError="continueRegularOutput",
             note="逐一讀 RSS/Atom,失敗不中斷")
collect = code("整理所有來源", [S2[2], MAIN_Y], JS_COLLECT, note="整理成項目、記下各來源狀態")

store = http("存入新項目", [S3[0], MAIN_Y], "POST", f"{SB}/source_items",
             query=[{"name": "on_conflict", "value": "source_id,item_key"}],
             headers=[{"name": "Prefer", "value": "resolution=ignore-duplicates,return=representation"}],
             body="={{ JSON.stringify($json.rows) }}", alwaysOutputData=True, note="看過的自動略過")
pending = http("讀取待處理項目", [S3[1], MAIN_Y], "GET", f"{SB}/source_items",
               query=[{"name": "select", "value": "id,source_id,item_key,title,url,published_at,raw"},
                      {"name": "processed_at", "value": "is.null"},
                      {"name": "source_id", "value": "like.off-*"},
                      {"name": "order", "value": "published_at.desc.nullslast"},
                      {"name": "limit", "value": "1000"}],
               executeOnce=True, alwaysOutputData=True, note="所有還沒處理的項目")
agreements = http("讀取協定清單", [S3[2], MAIN_Y], "GET", f"{SB}/agreements_full",
                  query=[{"name": "select", "value": "id,name,name_zh,short_name,status,origin,key_dates,parties"},
                         {"name": "tags", "value": "not.cs.{wto-delisted}"},
                         {"name": "order", "value": "id"}, {"name": "limit", "value": "1000"}],
                  pagination=PAGINATE, executeOnce=True, alwaysOutputData=True, note="比對候選協定用")
countries = http("讀取國家名稱", [S3[3], MAIN_Y], "GET", f"{SB}/countries",
                 query=[{"name": "select", "value": "code,name_zh,name_en,aliases"}, {"name": "limit", "value": "1000"}],
                 executeOnce=True, alwaysOutputData=True, note="中英文國名與別名")
orgs = http("讀取組織名稱", [S3[4], MAIN_Y], "GET", f"{SB}/organizations",
            query=[{"name": "select", "value": "code,name_zh,abbr_zh,name_en,abbr"}],
            executeOnce=True, alwaysOutputData=True, note="東協、歐盟、南共市…")
recent = http("讀取近期事件", [S3[5], MAIN_Y], "GET", f"{SB}/events",
              query=[{"name": "select", "value": "id,agreement_id,event_date,summary_zh,story_key,status,source_id,new_value"},
                     {"name": "detected_at", "value": "=gte.{{ new Date(Date.now() - $('設定').first().json.storyLookbackDays * 86400000).toISOString() }}"},
                     {"name": "summary_zh", "value": "not.is.null"},
                     {"name": "order", "value": "detected_at.desc"}, {"name": "limit", "value": "150"}],
              executeOnce=True, alwaysOutputData=True, note="判斷是否同一件事用")
plan = code("規劃 AI 批次", [S3[6], MAIN_Y], js_news_plan("官方新聞稿或公告", ON_TOPIC),
            note="關鍵字篩選、找候選協定")
gate = wf.if_true("有要給 AI 的項目?", [S3[7], MAIN_Y], "={{ $json.hasBatch }}",
                  note="上:有 → AI;下:沒有 → 收尾")

llm = http("AI 判斷與摘要", [S4[0], AI_Y], "POST",
           "=https://generativelanguage.googleapis.com/v1beta/models/{{ $('設定').first().json.model }}:generateContent",
           cred=GEMINI_CRED, body="={{ JSON.stringify($json.request) }}", timeout=180000,
           retryOnFail=True, maxTries=3, waitBetweenTries=5000, onError="continueRegularOutput",
           note="Gemini,失敗重試 3 次")
validate = code("驗證並產生事件", [S4[1], AI_Y], js_news_validate(), note="品質檢查,決定顯示或待確認")
write = http("寫入事件", [S4[2], AI_Y], "POST", f"{SB}/events",
             headers=[{"name": "Prefer", "value": "return=minimal"}],
             body="={{ JSON.stringify($json.events) }}", onError="continueRegularOutput", alwaysOutputData=True,
             note="只新增事件,不改協定")

finish = code("收尾整理", [S5[0], MAIN_Y], js_news_finish("整理所有來源"), note="統計這次的結果")
mark = http("標記已處理", [S5[1], MAIN_Y], "PATCH", f"{SB}/source_items",
            query=[{"name": "id", "value": "={{ $('收尾整理').first().json.processedFilter }}"}],
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body="={{ JSON.stringify({ processed_at: new Date().toISOString() }) }}",
            executeOnce=True, alwaysOutputData=True, note="下次不再送 AI")
sruns = http("寫入來源結果", [S5[2], MAIN_Y], "POST", f"{SB}/source_runs",
             headers=[{"name": "Prefer", "value": "return=minimal"}],
             body="={{ JSON.stringify($('收尾整理').first().json.sourceRuns) }}", executeOnce=True,
             alwaysOutputData=True, note="健康燈號的依據")
done = http("完成執行紀錄", [S5[3], MAIN_Y], "PATCH", f"{SB}/pipeline_runs",
            query=[{"name": "id", "value": "=eq.{{ $('建立執行紀錄').first().json.id }}"}],
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body="={{ JSON.stringify($('收尾整理').first().json.runPatch) }}", executeOnce=True,
            alwaysOutputData=True, note="標記成功或部分失敗")
report = code("執行摘要", [S5[4], MAIN_Y], "return [{ json: $('收尾整理').first().json.report }];",
              note="點我看中文報告")

# ─── Sticky notes ─────────────────────────────────────────────────────────

section("① 讀取設定", S1, MAIN_Y, 4, """## ① 讀取設定(準備工作)
- **手動執行**:在 n8n 畫面按下方「Execute workflow」就從這裡開始。
- **網頁或排程觸發**:網頁「資料狀態」頁的「立即更新」(新聞動態),或自動更新排程(預設關閉)從這裡啟動。要帶金鑰,只接受這台電腦上的網頁。
- **讀取更新設定**:讀「每次最多送幾則給 AI」(新聞動態的設定)。
- **讀取來源設定**:讀資料庫裡所有 off- 開頭的官方來源(網址、是否停用、信任等級)。新增來源只要在資料庫加一筆,不用改這個流程。
- **設定**:模型、回溯天數(45 天)、每則最多幾個候選協定(12 個)。
- **建立執行紀錄**:在資料庫新增一筆「執行中」。""", below=200)

section("② 抓取官方來源", S2, MAIN_Y, 6, """## ② 抓取官方來源
- **列出要抓的來源**:每個啟用的官方來源輸出一筆。
- **抓取官方來源**:逐一讀各機關的 RSS 或 Atom(貿易主管機關、WTO、區域組織秘書處)。單一來源失敗會重試 3 次,仍失敗也不會中斷流程。
- **整理所有來源**:整理成標題、日期、連結、摘要,並記下每個來源的狀態(資料狀態頁燈號的依據)。

只用官方來源,是參考 Digital Policy Alert 的做法:直接追政府原始資料,而不是跟著新聞熱度走。""")

section("③ 找出新項目與候選協定", S3, MAIN_Y, 5, """## ③ 找出新項目與候選協定
- **存入新項目**:存進「已看過項目」清單,已經存過的自動略過。
- **讀取待處理項目**:所有還沒處理的官方項目。
- **讀取協定清單**、**讀取國家名稱**、**讀取組織名稱**:用來比對項目提到哪些國家、組織或協定。
- **讀取近期事件**:近 60 天的事件,讓 AI 判斷是不是同一件事(例如新聞已報過)。
- **規劃 AI 批次**:先用關鍵字(協定、自由貿易、簽署、生效、談判…,含英、西、葡、中文)排除部長出訪、人事等與協定無關的項目;再找出提到的國家與組織,挑出最多 12 個候選協定。每次最多送 30 則。
- **有要給 AI 的項目?**:有 → 往上到 ④;沒有 → 直接到 ⑤。""")

section("④ AI 判斷與品質檢查", S4, AI_Y, 3, """## ④ AI 判斷與品質檢查
- **AI 判斷與摘要**:Gemini 從候選協定中選出報導的那一個(或標記為資料庫還沒有的新協定),判斷事件類型與日期,寫繁體中文摘要。
- **驗證並產生事件**:
  - 協定代碼必須來自候選清單,否則丟棄
  - 中國大陸的來源(.cn 網域、官方媒體)不採用,直接丟棄
  - 官方來源(信任等級 S)且 AI 有把握 → 直接顯示;新協定 → 一律待確認,人工確認後才加入資料庫
  - 同一件事已有可信來源報導 → 串成同一個「故事」
- **寫入事件**:只新增事件,不改協定本身。""")

section("⑤ 收尾與紀錄", S5, MAIN_Y, 7, """## ⑤ 收尾與紀錄
- **收尾整理**:統計結果,列出「資料庫還沒有的協定」。
- **標記已處理**:處理完的項目做記號;AI 失敗的下次重試。
- **寫入來源結果**:每個官方來源各一筆,資料狀態頁健康燈號的依據。
- **完成執行紀錄**:標記成功或部分失敗。
- **執行摘要**:點開看這次的中文報告。""")

top = min(s[2] for s in wf.sections)
wf.sticky("說明", [S1[0] - PAD, top - 480], 1240, 440, 1, """## 官方來源追蹤
**怎麼執行**:按畫面下方「Execute workflow」,或在網頁「資料狀態」頁按新聞動態的「立即更新」。自動更新預設關閉。

**流程**:① 讀取設定 → ② 抓取官方來源 → ③ 找出新項目與候選協定 → ④ AI 判斷與品質檢查 → ⑤ 收尾與紀錄

**和「全球協定新聞追蹤」的差別**:那條用 Google 新聞搜尋;這條只讀各國政府與國際組織自己發布的新聞稿,來源可信度最高,也較適合日後商業使用(政府資料多半可重複使用)。

**新增或停用來源**:在資料庫 sources 表新增一筆 id 為 off- 開頭的資料(kind = rss,tier = S),或把 enabled 改為 false。

**注意**:這個流程由程式檔 n8n/workflows/build_official_sources.py 產生。如果在畫面上修改,請告訴我,我會同步回程式檔。""")

wf.link(hook, settings)
wf.chain(trigger, settings, srcs, config, run, listing, fetch, collect,
         store, pending, agreements, countries, orgs, recent, plan, gate)
wf.chain(llm, validate, write, finish, mark, sruns, done, report)
wf.link(gate, llm, 0)
wf.link(gate, finish, 1)

wf.save(OUT)
