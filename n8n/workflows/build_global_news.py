"""Generate the n8n workflow that tracks news about any agreement in the database.

    python n8n/workflows/build_global_news.py      # writes n8n/workflows/global-news.json

Google News (English and Chinese) searches for agreement milestones: signed, entered
into force, negotiations concluded or launched. For each new item the flow finds
candidate agreements by the countries and blocs it mentions, and the AI picks one
(or flags an agreement the database does not have yet). Events only: the agreement
records themselves are changed by the WTO sync or by hand-checked curation.

Started by hand, from the web app, or by the scheduler when auto-update is on.
"""
from __future__ import annotations

from pathlib import Path

from n8n_build import (FETCH, FLOW_PATHS, GEMINI_CRED, JS_PARSE_RSS, PAD, SB, STEP, UA, Workflow,
                       js_news_finish, js_news_plan, js_news_validate, xs)

OUT = Path(__file__).with_name("global-news.json")
SOURCE_IDS = ["gnews-fta-en", "gnews-fta-zh"]

wf = Workflow("TtGlobalNews0001", "全球協定新聞追蹤")
node, http, code, section = wf.node, wf.http, wf.code, wf.section

# ─── JavaScript snippets ──────────────────────────────────────────────────

JS_CONFIG = r"""
// 流程設定。每次最多送幾則給 AI 讀資料庫 update_settings(news),在網頁「資料狀態」頁看得到。
const settings = $('讀取更新設定').first().json;
const sources = Object.fromEntries($('讀取來源設定').all().map((i) => [i.json.id, i.json]));
return [{ json: {
  model: 'gemini-2.5-flash',
  lookbackDays: 45,          // 第一次看到的新聞,只有近 45 天內的才送 AI;更早的只記為已看過
  maxLlmItems: settings.max_llm_items ?? 30,
  maxCandidates: 12,         // 每則新聞最多提供幾個候選協定給 AI
  storyLookbackDays: 60,     // 判斷「是不是同一件事」時,參考近 60 天的已知事件
  sources,
} }];
"""


def parse_gnews(sid: str, fetch_node: str) -> str:
    return JS_PARSE_RSS + r"""
const sid = '__SID__';
const src = $('設定').first().json.sources[sid];
const res = $('__FETCH__').first().json;
if (!src || !src.enabled) return [{ json: { source_id: sid, status: 'skipped', items: [] } }];
if (res.error || typeof res.data !== 'string') {
  return [{ json: { source_id: sid, status: 'error', error: String(res.error?.message ?? res.error ?? 'no data'), items: [] } }];
}
const items = parseRss(res.data).map((e) => {
  const publisher = e.source;
  const title = publisher && e.title.endsWith(` - ${publisher}`) ? e.title.slice(0, -(publisher.length + 3)) : e.title;
  return {
    source_id: sid, item_key: e.guid || e.link, title, url: e.link,
    published_at: isoDate(e.pubDate), publisher_domain: host(e.sourceUrl),
    raw: { publisher, description: e.description.slice(0, 800) },
  };
}).filter((i) => i.item_key);
return [{ json: { source_id: sid, status: items.length ? 'ok' : 'empty', items } }];
""".replace("__SID__", sid).replace("__FETCH__", fetch_node)


JS_COLLECT = r"""
// 合併兩個來源;同一則新聞(相同標題)在兩個查詢都出現時只留一筆
const parts = ['整理英文新聞', '整理中文新聞'].map((n) => $(n).first().json);
const rows = [], stats = {}, seenKey = new Set(), seenTitle = new Set();
for (const p of parts) {
  stats[p.source_id] = { status: p.status, fetched: (p.items || []).length, relevant: 0, error: p.error ?? null };
  for (const i of p.items || []) {
    const k = `${i.source_id}|${i.item_key}`, t = (i.title || '').toLowerCase();
    if (seenKey.has(k) || seenTitle.has(t)) continue;
    seenKey.add(k); seenTitle.add(t);
    stats[p.source_id].relevant++;
    rows.push({ source_id: i.source_id, item_key: i.item_key, title: (i.title || '').slice(0, 500), url: i.url,
                published_at: i.published_at, raw: { ...i.raw, publisher_domain: i.publisher_domain } });
  }
}
return [{ json: { rows, stats } }];
"""


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
S2 = xs(S1[-1] + STEP + 160, 4)
S3 = xs(S2[-1] + STEP + 160, 9)
S4 = xs(S3[-1] + STEP + 80, 3)
S5 = xs(S4[-1] + STEP + 160, 5)

# ─── Nodes ────────────────────────────────────────────────────────────────

trigger = node("手動執行", "n8n-nodes-base.manualTrigger", 1, [S1[0], MAIN_Y], {}, note="在 n8n 畫面按執行")
hook = wf.webhook("網頁或排程觸發", [S1[0], MAIN_Y + 200], FLOW_PATHS["global_news"], note="網頁按鈕或排程呼叫")
settings = http("讀取更新設定", [S1[1], MAIN_Y], "GET", f"{SB}/update_settings",
                query=[{"name": "pipeline", "value": "eq.news"}, {"name": "select", "value": "max_llm_items,auto_enabled"}],
                executeOnce=True, note="讀「每次最多送幾則給 AI」")
srcs = http("讀取來源設定", [S1[2], MAIN_Y], "GET", f"{SB}/sources",
            query=[{"name": "id", "value": f"in.({','.join(SOURCE_IDS)})"},
                   {"name": "select", "value": "id,enabled,tier,url,config"}], executeOnce=True,
            note="兩個來源是否停用")
config = code("設定", [S1[3], MAIN_Y], JS_CONFIG, note="流程參數集中在這裡")
run = http("建立執行紀錄", [S1[4], MAIN_Y], "POST", f"{SB}/pipeline_runs",
           headers=[{"name": "Prefer", "value": "return=representation"}],
           body='={{ JSON.stringify({ pipeline: "news", trigger: ' + TRIGGER + ', runner: "n8n", status: "running" }) }}',
           executeOnce=True, note="資料庫記一筆「執行中」")


def gnews(name, pos, sid, note):
    return http(name, pos, "GET", "https://news.google.com/rss/search", cred=None, text=True, headers=[UA],
                query=[{"name": n, "value": f"={{{{ $('設定').first().json.sources['{sid}'].config.{n} }}}}"}
                       for n in ("q", "hl", "gl", "ceid")], note=note, **FETCH)


f_en = gnews("抓英文新聞", [S2[0], MAIN_Y], "gnews-fta-en", "簽署、生效、完成談判…")
p_en = code("整理英文新聞", [S2[1], MAIN_Y], parse_gnews("gnews-fta-en", "抓英文新聞"), note="記下原始媒體網域")
f_zh = gnews("抓中文新聞", [S2[2], MAIN_Y], "gnews-fta-zh", "臺灣與華文媒體")
p_zh = code("整理中文新聞", [S2[3], MAIN_Y], parse_gnews("gnews-fta-zh", "抓中文新聞"), note="記下原始媒體網域")

collect = code("合併兩個來源", [S3[0], MAIN_Y], JS_COLLECT, note="同標題只留一則")
store = http("存入新項目", [S3[1], MAIN_Y], "POST", f"{SB}/source_items",
             query=[{"name": "on_conflict", "value": "source_id,item_key"}],
             headers=[{"name": "Prefer", "value": "resolution=ignore-duplicates,return=representation"}],
             body="={{ JSON.stringify($json.rows) }}", alwaysOutputData=True, note="看過的自動略過")
pending = http("讀取待處理項目", [S3[2], MAIN_Y], "GET", f"{SB}/source_items",
               query=[{"name": "select", "value": "id,source_id,item_key,title,url,published_at,raw"},
                      {"name": "processed_at", "value": "is.null"},
                      {"name": "source_id", "value": f"in.({','.join(SOURCE_IDS)})"},
                      {"name": "order", "value": "published_at.desc.nullslast"},
                      {"name": "limit", "value": "1000"}],
               executeOnce=True, alwaysOutputData=True, note="所有還沒處理的項目")
agreements = http("讀取協定清單", [S3[3], MAIN_Y], "GET", f"{SB}/agreements_full",
                  query=[{"name": "select", "value": "id,name,name_zh,short_name,status,origin,key_dates,parties"},
                         {"name": "tags", "value": "not.cs.{wto-delisted}"},
                         {"name": "order", "value": "id"}, {"name": "limit", "value": "1000"}],
                  pagination=PAGINATE, executeOnce=True, alwaysOutputData=True, note="比對候選協定用")
countries = http("讀取國家名稱", [S3[4], MAIN_Y], "GET", f"{SB}/countries",
                 query=[{"name": "select", "value": "code,name_zh,name_en,aliases"}, {"name": "limit", "value": "1000"}],
                 executeOnce=True, alwaysOutputData=True, note="中英文國名與別名")
orgs = http("讀取組織名稱", [S3[5], MAIN_Y], "GET", f"{SB}/organizations",
            query=[{"name": "select", "value": "code,name_zh,abbr_zh,name_en,abbr"}],
            executeOnce=True, alwaysOutputData=True, note="東協、歐盟、南共市…")
recent = http("讀取近期事件", [S3[6], MAIN_Y], "GET", f"{SB}/events",
              query=[{"name": "select", "value": "id,agreement_id,event_date,summary_zh,story_key,status,source_id,new_value"},
                     {"name": "detected_at", "value": "=gte.{{ new Date(Date.now() - $('設定').first().json.storyLookbackDays * 86400000).toISOString() }}"},
                     {"name": "summary_zh", "value": "not.is.null"},
                     {"name": "order", "value": "detected_at.desc"}, {"name": "limit", "value": "150"}],
              executeOnce=True, alwaysOutputData=True, note="判斷是否同一件事用")
plan = code("規劃 AI 批次", [S3[7], MAIN_Y], js_news_plan(), note="找候選協定、最多 30 則")
gate = wf.if_true("有要給 AI 的項目?", [S3[8], MAIN_Y], "={{ $json.hasBatch }}",
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

finish = code("收尾整理", [S5[0], MAIN_Y], js_news_finish("合併兩個來源"), note="統計這次的結果")
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
- **讀取更新設定**:讀「每次最多送幾則給 AI」(新聞動態的設定,目前 30 則)。
- **讀取來源設定**:讀兩個來源是否停用。
- **設定**:模型、回溯天數(45 天)、每則新聞最多幾個候選協定(12 個)。
- **建立執行紀錄**:在資料庫新增一筆「執行中」。""", below=200)

section("② 抓取新聞", S2, MAIN_Y, 6, """## ② 抓取新聞
- **抓英文新聞**:用 Google 新聞搜尋協定進展:簽署、生效、完成或啟動談判、批准。最多 100 則。
- **整理英文新聞**:整理成標題、日期、連結,並記下原始媒體網域(之後判斷可信度)。
- **抓中文新聞**:搜尋臺灣與華文媒體的協定進展(自由貿易協定、經濟合作協議…)。
- **整理中文新聞**:同上。

任何一個來源抓取失敗都不會中斷流程,資料狀態頁的燈號會變黃或紅。""")

section("③ 找出新項目與候選協定", S3, MAIN_Y, 5, """## ③ 找出新項目與候選協定
- **合併兩個來源**:同一則新聞(相同標題)只留一則。
- **存入新項目**:存進「已看過項目」清單,已經存過的自動略過。
- **讀取待處理項目**:所有還沒處理的新聞。
- **讀取協定清單**、**讀取國家名稱**、**讀取組織名稱**:用來比對新聞提到哪些國家、組織或協定。
- **讀取近期事件**:近 60 天的事件,讓 AI 判斷是不是同一件事。
- **規劃 AI 批次**:找出每則新聞提到的國家與組織,挑出最多 12 個「候選協定」。沒提到任何已知國家或協定的新聞不送 AI;45 天前的只記為已看過。每次最多送 30 則。
- **有要給 AI 的項目?**:有 → 往上到 ④;沒有 → 直接到 ⑤。""")

section("④ AI 判斷與品質檢查", S4, AI_Y, 3, """## ④ AI 判斷與品質檢查
- **AI 判斷與摘要**:Gemini 從候選協定中選出新聞報導的那一個(或標記為資料庫還沒有的新協定),判斷事件類型與日期,寫繁體中文摘要。
- **驗證並產生事件**:
  - 協定代碼必須來自候選清單,否則丟棄
  - 中國大陸的來源(.cn 網域、官方媒體)不採用,直接丟棄
  - 官方、學術、一線媒體 → 直接顯示;一般媒體 → 待確認
  - 非官方來源宣稱簽署、生效等狀態改變 → 待確認
  - 同一件事有兩家以上可信媒體報導,或已有官方事件 → 交叉確認後顯示
  - 新協定 → 一律待確認,人工確認後才加入資料庫
- **寫入事件**:只新增事件,不改協定本身。""")

section("⑤ 收尾與紀錄", S5, MAIN_Y, 7, """## ⑤ 收尾與紀錄
- **收尾整理**:統計結果,列出「資料庫還沒有的協定」。
- **標記已處理**:處理完的新聞做記號;AI 失敗的下次重試。
- **寫入來源結果**:資料狀態頁健康燈號的依據。
- **完成執行紀錄**:標記成功或部分失敗。
- **執行摘要**:點開看這次的中文報告。""")

top = min(s[2] for s in wf.sections)
wf.sticky("說明", [S1[0] - PAD, top - 480], 1240, 440, 1, """## 全球協定新聞追蹤
**怎麼執行**:按畫面下方「Execute workflow」,或在網頁「資料狀態」頁按新聞動態的「立即更新」。自動更新預設關閉。

**流程**:① 讀取設定 → ② 抓英文與中文新聞 → ③ 找出新項目與候選協定 → ④ AI 判斷與品質檢查 → ⑤ 收尾與紀錄

**和「WTO 電子商務 JSI 追蹤」的差別**:那條只追蹤電子商務協定;這條追蹤資料庫裡所有協定,也會發現資料庫還沒有的新協定(列為待確認)。

**原則**:新聞只產生「事件」,不會改協定的狀態或日期;那些由 WTO 同步或人工查證處理。

**注意**:這個流程由程式檔 n8n/workflows/build_global_news.py 產生。如果在畫面上修改,請告訴我,我會同步回程式檔。""")

wf.link(hook, settings)
wf.chain(trigger, settings, srcs, config, run, f_en, p_en, f_zh, p_zh,
         collect, store, pending, agreements, countries, orgs, recent, plan, gate)
wf.chain(llm, validate, write, finish, mark, sruns, done, report)
wf.link(gate, llm, 0)
wf.link(gate, finish, 1)

wf.save(OUT)
