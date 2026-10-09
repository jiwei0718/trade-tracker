"""Generate the n8n workflow JSON for the first end-to-end flow:
WTO e-commerce JSI / WT/GC/283 tracking.

    python n8n/workflows/build_jsi_ecom.py      # writes n8n/workflows/jsi-ecom.json

The workflow has NO schedule trigger: it only runs when started manually
(auto-update stays off until the user approves it).
"""
from __future__ import annotations

from pathlib import Path

from n8n_build import (FETCH, GEMINI_CRED, JS_DECODE as DECODE, JS_PARSE_RSS as PARSE_RSS, JS_TIERS, PAD,
                       FLOW_PATHS, SB, STEP, UA, Workflow, xs)

OUT = Path(__file__).with_name("jsi-ecom.json")
SOURCE_IDS = ["wto-docs-ecom", "wto-news-rss", "gnews-wto-ecom"]

wf = Workflow("TtJsiEcomFlow001", "WTO 電子商務 JSI 追蹤")
node, http, code, sticky, section = wf.node, wf.http, wf.code, wf.sticky, wf.section

# ─── JavaScript snippets ──────────────────────────────────────────────────

JS_CONFIG = r"""
// 流程設定。最多送幾則給 AI 讀資料庫的 update_settings(news),在控制台調整。
const settings = $('讀取更新設定').first().json;
const sources = Object.fromEntries($('讀取來源設定').all().map((i) => [i.json.id, i.json]));
return [{ json: {
  model: 'gemini-2.5-flash',
  lookbackDays: 120,          // 第一次看到的項目,只有發布在近 120 天內的才送 AI;更早的只記為已看過
  maxLlmItems: settings.max_llm_items ?? 30,
  batchSize: 30,              // 每次呼叫 AI 處理幾則(一次送完,同一件事的報導才能放在一起比對)
  storyLookbackDays: 60,      // 判斷「是不是同一件事」時,參考近 60 天的已知事件
  sources,
  agreementIds: ['wto-jsi-ecommerce', 'wt-gc-283-moratorium'],
  keywords: ['e-commerce', 'electronic commerce', 'electronic transmission', 'moratorium',
             'joint statement initiative', 'digital trade', 'wt/gc/283'],
} }];
"""

JS_PARSE_DOCS = DECODE + r"""
const sid = 'wto-docs-ecom';
const src = $('設定').first().json.sources[sid];
const res = $('抓 WTO 官方文件').first().json;
if (!src || !src.enabled) return [{ json: { source_id: sid, status: 'skipped', items: [] } }];
if (res.error || typeof res.data !== 'string') {
  return [{ json: { source_id: sid, status: 'error', error: String(res.error?.message ?? res.error ?? 'no data'), items: [] } }];
}
const tag = (h, t) => { const m = h.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };
const items = (res.data.match(/<autn:hit>[\s\S]*?<\/autn:hit>/g) || []).map((h) => {
  const symbol = tag(h, 'SYMBOL');
  const [d, m, y] = tag(h, 'ISSUINGDATE').slice(0, 10).split('/');   // dd/mm/yyyy
  const file = tag(h, 'FILENAMESA').replace(/^[qQ]:\//, '');
  return {
    source_id: sid, item_key: symbol, title: tag(h, 'CATTITLE') || symbol,
    url: file ? `https://docs.wto.org/dol2fe/Pages/SS/directdoc.aspx?filename=q:/${file}&Open=True` : null,
    published_at: y && m && d ? `${y}-${m}-${d}` : null,
    publisher_domain: 'wto.org',
    raw: { symbol, subjects: tag(h, 'SUBJECTLIST'), doc_type: tag(h, 'TYPES'),
           countries: tag(h, 'CONCERNEDCOUNTRIES').split('#').filter(Boolean).slice(0, 80),
           contents: tag(h, 'CONTENTS').slice(0, 500) },
  };
}).filter((i) => i.item_key);
return [{ json: { source_id: sid, status: items.length ? 'ok' : 'empty', items } }];
"""

JS_PARSE_WTO_NEWS = PARSE_RSS + r"""
const sid = 'wto-news-rss';
const src = $('設定').first().json.sources[sid];
const res = $('抓 WTO 新聞').first().json;
if (!src || !src.enabled) return [{ json: { source_id: sid, status: 'skipped', items: [] } }];
if (res.error || typeof res.data !== 'string') {
  return [{ json: { source_id: sid, status: 'error', error: String(res.error?.message ?? res.error ?? 'no data'), items: [] } }];
}
const items = parseRss(res.data).map((e) => ({
  source_id: sid, item_key: e.link || e.guid, title: e.title, url: e.link,
  published_at: isoDate(e.pubDate), publisher_domain: 'wto.org',
  raw: { description: e.description.slice(0, 800) },
})).filter((i) => i.item_key);
return [{ json: { source_id: sid, status: items.length ? 'ok' : 'empty', items } }];
"""

JS_PARSE_GNEWS = PARSE_RSS + r"""
const sid = 'gnews-wto-ecom';
const src = $('設定').first().json.sources[sid];
const res = $('抓 Google 新聞').first().json;
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
"""

JS_COLLECT = r"""
// 合併三個來源,新聞用關鍵字初篩(官方文件本身就是 JSI 查詢結果,全部保留)
const cfg = $('設定').first().json;
const parts = ['整理 WTO 文件', '整理 WTO 新聞', '整理 Google 新聞'].map((n) => $(n).first().json);
const relevant = (i) => i.source_id === 'wto-docs-ecom'
  || cfg.keywords.some((k) => `${i.title} ${i.raw?.description ?? ''}`.toLowerCase().includes(k));
const rows = [];
const stats = {};
const seen = new Set();
for (const p of parts) {
  const kept = (p.items || []).filter(relevant);
  stats[p.source_id] = { status: p.status, fetched: (p.items || []).length, relevant: kept.length, error: p.error ?? null };
  for (const i of kept) {
    const k = `${i.source_id}|${i.item_key}`;
    if (seen.has(k)) continue;
    seen.add(k);
    rows.push({ source_id: i.source_id, item_key: i.item_key, title: (i.title || '').slice(0, 500), url: i.url,
                published_at: i.published_at, raw: { ...i.raw, publisher_domain: i.publisher_domain } });
  }
}
return [{ json: { rows, stats } }];
"""

JS_PLAN = r"""
// 決定這次要送 AI 的項目:尚未處理、且在回溯期間內的,依新到舊、最多 maxLlmItems 則
const cfg = $('設定').first().json;
const pending = $('讀取待處理項目').all().map((i) => i.json).filter((r) => r && r.id);
const known = $('讀取近期事件').all().map((i) => i.json).filter((r) => r && r.id)
  .map((e) => ({ id: e.id, agreement_id: e.agreement_id, date: e.event_date, summary: e.summary_zh }));
const cutoff = Date.now() - cfg.lookbackDays * 86400000;
const old = pending.filter((r) => r.published_at && Date.parse(r.published_at) < cutoff);
const recent = pending.filter((r) => !r.published_at || Date.parse(r.published_at) >= cutoff)
  .sort((a, b) => String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')));
const forLlm = recent.slice(0, cfg.maxLlmItems);
const summary = {
  pending: pending.length, baselineIds: old.map((r) => r.id),
  deferred: recent.length - forLlm.length, llmCount: forLlm.length,
};

const system = `你是國際貿易協定研究助理,負責追蹤「WTO 電子商務協定(Agreement on Electronic Commerce,源自電子商務聯合聲明倡議 JSI)」與「WT/GC/283 電子傳輸暫免課徵關稅聯合聲明」的進展。對輸入的每一則項目判斷:
1. relevant:是否直接涉及上述兩者。一般數位經濟、其他協定或泛論的報導判 false。
2. agreement_id:wto-jsi-ecommerce(電子商務協定或 JSI 本身)、wt-gc-283-moratorium(電子傳輸關稅暫免、WT/GC/283)、none。
3. event_type:new_document(新的官方文件)、ministerial(部長會議或總理事會的決定)、accession(成員遞交接受書或加入)、signed、in_force、news(其他報導)。只有原文明確寫出「已簽署」「已生效」才可以用 signed 或 in_force。
4. event_date:事件發生日期 YYYY-MM-DD;不確定就用項目的發布日期;都沒有就留空字串。
5. summary_zh:臺灣繁體中文摘要,80 字以內。只能根據提供的內容,不可推測或補充原文沒有的資訊。專有名詞第一次出現時,用半形括號附英文原文。
6. confidence:0 到 1,你對以上判斷的把握。
7. story:用英文小寫與連字號寫一個簡短代號,描述這則項目報導的「具體事件」,例如 india-questions-interim-arrangements。同一批裡報導同一件事的項目,story 必須完全相同;不同的事要用不同代號。
8. same_as:如果這則項目和 known_events 裡某一則報導的是同一件事(同一份文件、同一場會議、同一個決定),填那則事件的 id;否則填 0。只是主題相近不算同一件事。
譯名:Agreement=協定、Arrangement=協議、Treaty=條約、Convention=公約、Covenant=盟約、MOU=備忘錄、Joint Statement / Joint Declaration=聯合聲明、Joint Statement Initiative=聯合聲明倡議、Pilot Project=先導計畫、WTO=世界貿易組織、General Council=總理事會、Ministerial Conference=部長會議、interim arrangements=過渡性安排。報導裡用 deal、pact 指稱電子商務協定時,一律寫「電子商務協定」,不可寫成「協議」。Taiwan 一律寫「中華民國(臺灣)」,「臺」不寫成「台」。
每一則都要回傳,key 必須和輸入完全相同。`;

const schema = { type: 'ARRAY', items: { type: 'OBJECT', properties: {
  key: { type: 'STRING' }, relevant: { type: 'BOOLEAN' },
  agreement_id: { type: 'STRING', enum: ['wto-jsi-ecommerce', 'wt-gc-283-moratorium', 'none'] },
  event_type: { type: 'STRING', enum: ['new_document', 'ministerial', 'accession', 'signed', 'in_force', 'news'] },
  event_date: { type: 'STRING' }, summary_zh: { type: 'STRING' }, confidence: { type: 'NUMBER' },
  story: { type: 'STRING' }, same_as: { type: 'INTEGER' },
}, required: ['key', 'relevant', 'agreement_id', 'event_type', 'event_date', 'summary_zh', 'confidence', 'story', 'same_as'] } };

const batches = [];
for (let i = 0; i < forLlm.length; i += cfg.batchSize) batches.push(forLlm.slice(i, i + cfg.batchSize));
if (!batches.length) return [{ json: { hasBatch: false, batch: [], summary } }];
return batches.map((batch) => {
  const payload = batch.map((r) => ({
    key: String(r.id), source: r.source_id, publisher: r.raw?.publisher_domain ?? '', published_at: r.published_at,
    title: r.title, document_symbol: r.raw?.symbol, subjects: r.raw?.subjects, doc_type: r.raw?.doc_type,
    description: r.raw?.description ?? r.raw?.contents ?? '',
  }));
  return { json: { hasBatch: true, batch, summary, request: {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: JSON.stringify({ items: payload, known_events: known }) }] }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.2 },
  } } };
});
"""

JS_VALIDATE = r"""
// 品質檢查:格式 → 協定代碼 → 日期 → 來源信任等級 → 決定「顯示(active)/待確認(pending)」
const cfg = $('設定').first().json;
const runId = $('建立執行紀錄').first().json.id;
const plans = $('規劃 AI 批次').all().map((i) => i.json).filter((p) => p.hasBatch);
const responses = $input.all().map((i) => i.json);

__TIERS__const DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const today = new Date().toISOString().slice(0, 10);
const okDate = (s) => typeof s === 'string' && DATE.test(s) && s >= '1990' && s <= today;
const TYPES = ['new_document', 'ministerial', 'accession', 'signed', 'in_force', 'news'];
const STATE_CHANGING = ['signed', 'in_force', 'accession'];
const OFFICIAL = ['wto-docs-ecom', 'wto-news-rss', 'wto-rta-is'];
// 譯名規則的最後防線(AI 偶爾不遵守):只改明確的詞,不碰「平台」這類一般用字
const fixTerms = (s) => s
  .replace(/電子商務協議/g, '電子商務協定')
  .replace(/台灣/g, '臺灣')
  .replace(/中華民國（臺灣）/g, '中華民國(臺灣)');

// 近期已知事件:判斷「同一件事」用。沒有 story_key 的事件,自己就是一個 story(event-<id>)
const known = Object.fromEntries($('讀取近期事件').all().map((i) => i.json).filter((r) => r && r.id)
  .map((e) => [e.id, { ...e, story_key: e.story_key || `event-${e.id}`, tier: e.new_value?.tier ?? (OFFICIAL.includes(e.source_id) ? 'S' : 'C') }]));
const slug = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const events = [], handledIds = [], failedIds = [], rejected = [];
plans.forEach((plan, idx) => {
  let out = null;
  try { out = JSON.parse(responses[idx]?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''); } catch { out = null; }
  if (!Array.isArray(out)) { failedIds.push(...plan.batch.map((b) => b.id)); return; }
  const byKey = Object.fromEntries(out.map((o) => [String(o.key), o]));
  for (const item of plan.batch) {
    const o = byKey[String(item.id)];
    if (!o) { failedIds.push(item.id); continue; }
    handledIds.push(item.id);
    const isDoc = item.source_id === 'wto-docs-ecom';
    const domain = item.raw?.publisher_domain || '';
    const tier = isDoc ? 'S' : tierOf(domain);
    const summary = fixTerms(String(o.summary_zh || '').trim()).slice(0, 200);
    let agreementId = o.agreement_id, type = o.event_type, conf = Math.max(0, Math.min(1, Number(o.confidence) || 0));
    if (isDoc) {
      // 官方文件:分類用規則,不靠 AI;AI 只負責摘要
      agreementId = String(item.raw?.symbol || '').startsWith('WT/GC/283') ? 'wt-gc-283-moratorium' : 'wto-jsi-ecommerce';
      type = 'new_document'; conf = 1;
    } else {
      if (!o.relevant || !cfg.agreementIds.includes(agreementId)) { rejected.push({ id: item.id, reason: 'not relevant' }); continue; }
      if (!TYPES.includes(type)) type = 'news';
    }
    if (!summary) { rejected.push({ id: item.id, reason: 'empty summary' }); continue; }
    const published = String(item.published_at || '').slice(0, 10);
    const eventDate = isDoc ? published : (okDate(o.event_date) ? o.event_date : (okDate(published) ? published : null));
    let status = 'pending';
    if (tier === 'S' && conf >= 0.7) status = 'active';
    else if (STATE_CHANGING.includes(type)) status = 'pending';      // 非官方來源宣稱狀態改變:待交叉確認
    else if ((tier === 'A' || tier === 'B') && conf >= 0.6) status = 'active';
    // 同一件事:AI 指認的已知事件 → 沿用它的 story;否則用「協定/月份/代號」
    const same = known[Number(o.same_as)];
    const storyKey = same && same.agreement_id === agreementId
      ? same.story_key
      : `${agreementId}/${(eventDate || today).slice(0, 7)}/${slug(o.story) || `item-${item.id}`}`;
    events.push({
      agreement_id: agreementId, event_type: type, event_date: eventDate, summary_zh: summary,
      source_id: item.source_id, source_url: item.url, source_item_id: item.id, confidence: conf,
      status, by_tool: cfg.model, run_id: runId, story_key: storyKey,
      new_value: { title: item.title, publisher: domain, tier, symbol: item.raw?.symbol ?? null },
    });
  }
});
// 交叉確認:同一個 story 已有可信來源(S/A/B)且已顯示的事件時,一般媒體的報導也一併顯示,
// 網頁上會列在那則事件底下的「另有 N 則報導」,不會單獨成為一則動態
const trusted = new Set([
  ...Object.values(known).filter((e) => e.status === 'active' && e.tier !== 'C').map((e) => e.story_key),
  ...events.filter((e) => e.status === 'active' && e.new_value.tier !== 'C').map((e) => e.story_key),
]);
let corroborated = 0;
for (const e of events) {
  if (e.status === 'pending' && trusted.has(e.story_key)) { e.status = 'active'; corroborated++; }
}
return [{ json: { events, handledIds, failedIds, rejected, corroborated } }];
"""

JS_VALIDATE = JS_VALIDATE.replace("__TIERS__", JS_TIERS.strip() + "\n")

JS_FINISH = r"""
// 整理這次執行的結果:哪些項目標記為已處理、各來源狀態、執行紀錄
const run = $('建立執行紀錄').first().json;
const merged = $('合併與初篩').first().json;
const plan = $('規劃 AI 批次').first().json.summary;
const fresh = $('存入新項目').all().map((i) => i.json).filter((r) => r && r.id);
const v = $('驗證並產生事件').isExecuted
  ? $('驗證並產生事件').first().json
  : { events: [], handledIds: [], failedIds: [], rejected: [], corroborated: 0 };
const writeFailed = $('寫入事件').isExecuted && !!$('寫入事件').first().json.error;

const processed = [...plan.baselineIds, ...v.handledIds];
const sourceRuns = Object.entries(merged.stats).map(([sid, s]) => ({
  run_id: run.id, source_id: sid, status: s.status, items_fetched: s.fetched,
  items_new: fresh.filter((r) => r.source_id === sid).length, error: s.error,
}));
const partial = writeFailed || v.failedIds.length > 0 || sourceRuns.some((s) => s.status === 'error');
const written = writeFailed ? 0 : v.events.length;
const report = {
  抓取: Object.fromEntries(Object.entries(merged.stats).map(([k, s]) => [k, `${s.status}:抓到 ${s.fetched} 則,相關 ${s.relevant} 則`])),
  第一次見到: fresh.length,
  只記為已看過的舊項目: plan.baselineIds.length,
  送給AI: plan.llmCount,
  超過上限留待下次: plan.deferred,
  AI處理失敗留待下次: v.failedIds.length,
  判定不相關: v.rejected.length,
  新事件: written,
  其中直接顯示: writeFailed ? 0 : v.events.filter((e) => e.status === 'active').length,
  其中待確認: writeFailed ? 0 : v.events.filter((e) => e.status === 'pending').length,
  其中因交叉確認而顯示: writeFailed ? 0 : (v.corroborated ?? 0),
};
return [{ json: {
  processedFilter: processed.length ? `in.(${processed.join(',')})` : 'eq.-1',
  sourceRuns,
  runPatch: { status: partial ? 'partial' : 'success', finished_at: new Date().toISOString(),
              llm_items: plan.llmCount, events_count: written,
              error: writeFailed ? String($('寫入事件').first().json.error?.message ?? 'events insert failed') : null },
  report,
} }];
"""

# ─── Layout ───────────────────────────────────────────────────────────────
# Five colour-coded sections. A sticky note frames each section and explains
# every node in it; each node also shows a one-line note underneath.

MAIN_Y = 700        # main row
AI_Y = 420          # the AI branch sits above the main row; the "nothing for AI" path runs underneath

S1 = xs(0, 5)
S2 = xs(S1[-1] + STEP + 160, 6)
S3 = xs(S2[-1] + STEP + 160, 6)
S4 = xs(S3[-1] + STEP + 80, 3)
S5 = xs(S4[-1] + STEP + 160, 5)

# ─── Nodes ────────────────────────────────────────────────────────────────

trigger = node("手動執行", "n8n-nodes-base.manualTrigger", 1, [S1[0], MAIN_Y], {},
               note="在 n8n 畫面按執行")
hook = wf.webhook("網頁或排程觸發", [S1[0], MAIN_Y + 200], FLOW_PATHS["jsi_ecom"], note="網頁按鈕或排程呼叫")
settings = http("讀取更新設定", [S1[1], MAIN_Y], "GET", f"{SB}/update_settings",
                query=[{"name": "pipeline", "value": "eq.news"}, {"name": "select", "value": "max_llm_items,auto_enabled"}],
                note="讀「每次最多送幾則給 AI」")
srcs = http("讀取來源設定", [S1[2], MAIN_Y], "GET", f"{SB}/sources",
            query=[{"name": "id", "value": f"in.({','.join(SOURCE_IDS)})"},
                   {"name": "select", "value": "id,enabled,tier,url,config"}], executeOnce=True,
            note="讀 3 個來源是否停用")
config = code("設定", [S1[3], MAIN_Y], JS_CONFIG, note="流程參數集中在這裡")
run = http("建立執行紀錄", [S1[4], MAIN_Y], "POST", f"{SB}/pipeline_runs",
           headers=[{"name": "Prefer", "value": "return=representation"}],
           body='={{ JSON.stringify({ pipeline: "news", trigger: ($("網頁或排程觸發").isExecuted && $("網頁或排程觸發").first().json.body?.trigger === "scheduled" ? "scheduled" : "manual"), runner: "n8n", status: "running" }) }}',
           note="資料庫記一筆「執行中」")

f_docs = http("抓 WTO 官方文件", [S2[0], MAIN_Y], "GET",
              "https://docs.wto.org/dol2fe/Pages/SS/GetXMLResults.aspx", cred=None, text=True,
              headers=[UA],
              query=[{"name": "DataSource", "value": "Cat"},
                     {"name": "query", "value": "={{ $('設定').first().json.sources['wto-docs-ecom'].config.query }}"},
                     {"name": "Language", "value": "English"}], note="查 WTO 官方文件庫", **FETCH)
p_docs = code("整理 WTO 文件", [S2[1], MAIN_Y], JS_PARSE_DOCS, note="XML → 文件清單")
f_news = http("抓 WTO 新聞", [S2[2], MAIN_Y], "GET", "https://www.wto.org/library/rss/latest_news_e.xml",
              cred=None, text=True, headers=[UA], note="讀 WTO 新聞 RSS", **FETCH)
p_news = code("整理 WTO 新聞", [S2[3], MAIN_Y], JS_PARSE_WTO_NEWS, note="RSS → 新聞清單")
f_gn = http("抓 Google 新聞", [S2[4], MAIN_Y], "GET", "https://news.google.com/rss/search",
            cred=None, text=True, headers=[UA],
            query=[{"name": n, "value": f"={{{{ $('設定').first().json.sources['gnews-wto-ecom'].config.{n} }}}}"}
                   for n in ("q", "hl", "gl", "ceid")], note="用關鍵字搜尋新聞", **FETCH)
p_gn = code("整理 Google 新聞", [S2[5], MAIN_Y], JS_PARSE_GNEWS, note="記下原始媒體網域")

collect = code("合併與初篩", [S3[0], MAIN_Y], JS_COLLECT, note="新聞須含關鍵字")
store = http("存入新項目", [S3[1], MAIN_Y], "POST", f"{SB}/source_items",
             query=[{"name": "on_conflict", "value": "source_id,item_key"}],
             headers=[{"name": "Prefer", "value": "resolution=ignore-duplicates,return=representation"}],
             body="={{ JSON.stringify($json.rows) }}", alwaysOutputData=True,
             note="看過的自動略過")
pending = http("讀取待處理項目", [S3[2], MAIN_Y], "GET", f"{SB}/source_items",
               query=[{"name": "select", "value": "id,source_id,item_key,title,url,published_at,raw"},
                      {"name": "processed_at", "value": "is.null"},
                      {"name": "source_id", "value": f"in.({','.join(SOURCE_IDS)})"},
                      {"name": "order", "value": "published_at.desc.nullslast"},
                      {"name": "limit", "value": "1000"}],
               executeOnce=True, alwaysOutputData=True, note="所有還沒處理的項目")
recent = http("讀取近期事件", [S3[3], MAIN_Y], "GET", f"{SB}/events",
              query=[{"name": "select", "value": "id,agreement_id,event_date,summary_zh,story_key,status,source_id,new_value"},
                     {"name": "agreement_id", "value": "in.(wto-jsi-ecommerce,wt-gc-283-moratorium)"},
                     {"name": "detected_at", "value": "=gte.{{ new Date(Date.now() - $('設定').first().json.storyLookbackDays * 86400000).toISOString() }}"},
                     {"name": "order", "value": "detected_at.desc"},
                     {"name": "limit", "value": "80"}],
              executeOnce=True, alwaysOutputData=True, note="判斷是否同一件事用")
plan = code("規劃 AI 批次", [S3[4], MAIN_Y], JS_PLAN, note="近 120 天、一次最多 30 則")
gate = wf.if_true("有要給 AI 的項目?", [S3[5], MAIN_Y], "={{ $json.hasBatch }}",
                  note="上:有 → AI;下:沒有 → 收尾", cond_key="gate")

llm = http("AI 分類與摘要", [S4[0], AI_Y], "POST",
           "=https://generativelanguage.googleapis.com/v1beta/models/{{ $('設定').first().json.model }}:generateContent",
           cred=GEMINI_CRED, body="={{ JSON.stringify($json.request) }}", timeout=120000,
           retryOnFail=True, maxTries=3, waitBetweenTries=5000, onError="continueRegularOutput",
           note="Gemini,失敗重試 3 次")
validate = code("驗證並產生事件", [S4[1], AI_Y], JS_VALIDATE, note="品質檢查,決定顯示或待確認")
write = http("寫入事件", [S4[2], AI_Y], "POST", f"{SB}/events",
             headers=[{"name": "Prefer", "value": "return=minimal"}],
             body="={{ JSON.stringify($json.events) }}", onError="continueRegularOutput", alwaysOutputData=True,
             note="只新增事件,不改協定")

finish = code("收尾整理", [S5[0], MAIN_Y], JS_FINISH, note="統計這次的結果")
mark = http("標記已處理", [S5[1], MAIN_Y], "PATCH", f"{SB}/source_items",
            query=[{"name": "id", "value": "={{ $('收尾整理').first().json.processedFilter }}"}],
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body="={{ JSON.stringify({ processed_at: new Date().toISOString() }) }}",
            executeOnce=True, alwaysOutputData=True, note="下次不再送 AI")
sruns = http("寫入來源結果", [S5[2], MAIN_Y], "POST", f"{SB}/source_runs",
             headers=[{"name": "Prefer", "value": "return=minimal"}],
             body="={{ JSON.stringify($('收尾整理').first().json.sourceRuns) }}", executeOnce=True, alwaysOutputData=True,
             note="健康燈號的依據")
done = http("完成執行紀錄", [S5[3], MAIN_Y], "PATCH", f"{SB}/pipeline_runs",
            query=[{"name": "id", "value": "=eq.{{ $('建立執行紀錄').first().json.id }}"}],
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body="={{ JSON.stringify($('收尾整理').first().json.runPatch) }}", executeOnce=True, alwaysOutputData=True,
            note="標記成功或部分失敗")
report = code("執行摘要", [S5[4], MAIN_Y], "return [{ json: $('收尾整理').first().json.report }];",
              note="點我看中文報告")

# ─── Sticky notes ─────────────────────────────────────────────────────────

section("① 讀取設定", S1, MAIN_Y, 4, """## ① 讀取設定(準備工作)
- **手動執行**:在 n8n 畫面按下方「Execute workflow」就從這裡開始。
- **網頁或排程觸發**:網頁「資料狀態」頁的「立即更新」按鈕,或自動更新排程(預設關閉)從這裡啟動。要帶金鑰才能呼叫,而且只接受這台電腦上的網頁。
- **讀取更新設定**:從資料庫讀「每次最多送幾則給 AI」,目前是 30 則。
- **讀取來源設定**:讀這條流程用到的 3 個來源,以及有沒有被停用(停用的會跳過)。
- **設定**:模型名稱、回溯天數(120 天)、搜尋關鍵字等參數都集中在這裡。要調整就改這個節點。
- **建立執行紀錄**:在資料庫新增一筆「執行中」,這次的所有結果都會記在它底下。""", below=200)

section("② 抓取資料來源", S2, MAIN_Y, 6, """## ② 抓取三個資料來源
- **抓 WTO 官方文件**:向 WTO 官方文件庫查詢電子商務 JSI 相關文件(INF/ECOM、WT/GC/283、WT/MIN(26)/42 等),目前約 119 份。
- **整理 WTO 文件**:把查詢結果(XML)整理成一筆筆文件:文件編號、標題、日期、PDF 連結。
- **抓 WTO 新聞**:讀 WTO「最新消息」RSS,每次約 10 則。
- **整理 WTO 新聞**:整理成標題、日期、連結、摘要。
- **抓 Google 新聞**:用關鍵字搜尋 Google 新聞 RSS,最多 100 則。
- **整理 Google 新聞**:整理新聞,並記下原始媒體的網域(例如 reuters.com),之後用來判斷可信度。

任何一個來源抓取失敗都不會中斷流程,只會記為「失敗」,網頁「資料狀態」頁的燈號會變黃或紅。""")

section("③ 判斷哪些是新的", S3, MAIN_Y, 5, """## ③ 判斷哪些是新的
- **合併與初篩**:把三個來源合在一起。新聞要含關鍵字(e-commerce、moratorium 等)才保留;官方文件全部保留。
- **存入新項目**:存進資料庫的「已看過項目」清單,已經存過的會自動略過。判斷新舊就是靠這一步。
- **讀取待處理項目**:讀出所有「還沒處理過」的項目,包括上次超過上限、還沒輪到的。
- **讀取近期事件**:讀出近 60 天已記錄的事件,讓 AI 判斷新項目是不是在報導「同一件事」。
- **規劃 AI 批次**:只挑近 120 天內的項目,依新到舊、最多送「上限」則給 AI,一次送完(同一件事的報導才能一起比對)。更舊的只記為已看過,不送 AI。
- **有要給 AI 的項目?**:有 → 往上走到 ④;沒有新東西 → 直接往右到 ⑤ 收尾,不花 AI 額度。""")

section("④ AI 處理與品質檢查", S4, AI_Y, 3, """## ④ AI 處理與品質檢查
只有在有新項目時才會執行。
- **AI 分類與摘要**:把一批項目送給 Gemini,請它判斷是否相關、事件類型、日期,寫繁體中文摘要(附譯名對照表),並標出哪些項目報導的是同一件事。失敗會自動重試 3 次。
- **驗證並產生事件**:品質檢查:
  - 官方文件的分類由規則決定,AI 只負責摘要
  - 檢查協定代碼和日期格式
  - 官方、學術、一線媒體 → 直接顯示;一般媒體 → 待確認
  - 非官方來源宣稱「已簽署/已生效」→ 一律待確認
  - 自動修正譯名(電子商務協議→協定、台→臺)
  - 同一件事的報導串成一個「故事」:網頁只顯示最可信的一則,其餘列為「另有 N 則報導」
  - 交叉確認:同一件事已有可信來源時,一般媒體的報導也一併列出
- **寫入事件**:把通過檢查的事件寫進資料庫。只新增事件,不會改協定本身的狀態。""")

section("⑤ 收尾與紀錄", S5, MAIN_Y, 7, """## ⑤ 收尾與紀錄
- **收尾整理**:統計哪些項目已處理完、每個來源的結果。
- **標記已處理**:處理完的項目做記號,下次不會再送 AI。AI 失敗的不做記號,下次會重試。
- **寫入來源結果**:記錄每個來源這次抓到幾則、有幾則是新的,也就是網頁「資料狀態」頁健康燈號的依據。
- **完成執行紀錄**:把這次執行標記為「成功」或「部分失敗」,記下 AI 處理數和新事件數。
- **執行摘要**:點開這個節點,就能看到這次的中文報告。""")

top = min(s[2] for s in wf.sections)
sticky("說明", [S1[0] - PAD, top - 460], 1120, 420, 1, """## WTO 電子商務 JSI 追蹤(第一條流程)
**怎麼執行**:按畫面下方「Execute workflow」,或在網頁「資料狀態」頁按「立即更新」。自動更新預設關閉,要在網頁上打開開關才會依排程執行。

**流程**:① 讀取設定 → ② 抓三個來源 → ③ 判斷哪些是新的 → ④ AI 摘要與品質檢查 → ⑤ 收尾與紀錄

**怎麼看結果**
- 點任何一個節點,右側會顯示它收到的資料(輸入)和產出的資料(輸出)
- 最右邊的「執行摘要」是這次的中文報告
- 網頁版 http://localhost:8082 的「動態」和「資料狀態」頁會顯示新結果(按重新整理)

**注意**:這個流程是由程式檔 n8n/workflows/build_jsi_ecom.py 產生的。如果在畫面上修改,請告訴我,我會同步回程式檔,避免下次更新時被覆蓋。""")

wf.link(hook, settings)
wf.chain(trigger, settings, srcs, config, run, f_docs, p_docs, f_news, p_news, f_gn, p_gn,
         collect, store, pending, recent, plan, gate)
wf.chain(llm, validate, write, finish, mark, sruns, done, report)
wf.link(gate, llm, 0)
wf.link(gate, finish, 1)

wf.save(OUT)
