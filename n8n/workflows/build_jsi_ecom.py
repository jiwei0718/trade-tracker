"""Generate the n8n workflow JSON for the first end-to-end flow:
WTO e-commerce JSI / WT/GC/283 tracking.

    python n8n/workflows/build_jsi_ecom.py      # writes n8n/workflows/jsi-ecom.json

The workflow has NO schedule trigger: it only runs when started manually
(auto-update stays off until the user approves it).
"""
from __future__ import annotations

import json
import uuid
from pathlib import Path

OUT = Path(__file__).with_name("jsi-ecom.json")
WORKFLOW_ID = "TtJsiEcomFlow001"
SB = "https://tsvmouanmvhbhwwwqtdt.supabase.co/rest/v1"
SB_CRED = {"httpHeaderAuth": {"id": "TtSupabaseSecret", "name": "Supabase secret key (trade-tracker)"}}
GEMINI_CRED = {"httpHeaderAuth": {"id": "TtGeminiApiKey01", "name": "Gemini API key"}}
UA = {"name": "User-Agent", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) trade-tracker"}
SOURCE_IDS = ["wto-docs-ecom", "wto-news-rss", "gnews-wto-ecom"]

nodes: list[dict] = []
connections: dict[str, dict] = {}


def node(name, type_, version, pos, params, **extra):
    nodes.append({
        "id": str(uuid.uuid5(uuid.NAMESPACE_URL, f"{WORKFLOW_ID}/{name}")),
        "name": name, "type": type_, "typeVersion": version, "position": pos,
        "parameters": params, **extra,
    })
    return name


def link(src, dst, out=0):
    outs = connections.setdefault(src, {"main": []})["main"]
    while len(outs) <= out:
        outs.append([])
    outs[out].append({"node": dst, "type": "main", "index": 0})


def http(name, pos, method, url, *, cred=SB_CRED, query=None, headers=None, body=None,
         text=False, timeout=60000, **settings):
    params = {"method": method, "url": url, "options": {"timeout": timeout}}
    if cred:
        params |= {"authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth"}
    if query:
        params |= {"sendQuery": True, "queryParameters": {"parameters": query}}
    if headers:
        params |= {"sendHeaders": True, "headerParameters": {"parameters": headers}}
    if body is not None:
        params |= {"sendBody": True, "contentType": "json", "specifyBody": "json", "jsonBody": body}
    if text:
        params["options"]["response"] = {"response": {"responseFormat": "text", "outputPropertyName": "data"}}
    extra = {"credentials": cred} if cred else {}
    return node(name, "n8n-nodes-base.httpRequest", 4.2, pos, params, **extra, **settings)


def code(name, pos, js):
    return node(name, "n8n-nodes-base.code", 2, pos, {"mode": "runOnceForAllItems", "jsCode": js.strip()})


FETCH = dict(executeOnce=True, retryOnFail=True, maxTries=3, waitBetweenTries=3000,
             onError="continueRegularOutput")

# ─── JavaScript snippets ──────────────────────────────────────────────────

DECODE = r"""
const decode = (s) => String(s ?? '')
  .replace(/<!\[CDATA\[|\]\]>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
"""

PARSE_RSS = DECODE + r"""
const parseRss = (xml) => (String(xml).match(/<item[\s>][\s\S]*?<\/item>/g) || []).map((it) => {
  const get = (t) => { const m = it.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };
  const sourceUrl = (it.match(/<source[^>]*url="([^"]+)"/) || [])[1] || '';
  return { title: get('title'), link: get('link'), guid: get('guid'), description: get('description'),
           pubDate: get('pubDate'), source: get('source'), sourceUrl };
});
const isoDate = (s) => { const t = Date.parse(s); return Number.isNaN(t) ? null : new Date(t).toISOString(); };
// n8n 的 Code 執行環境沒有 URL 物件,改用字串處理取網域
const host = (u) => String(u || '').replace(/^[a-z]+:\/\//i, '').split(/[/?#:]/)[0].replace(/^www\./, '').toLowerCase();
"""

JS_CONFIG = r"""
// 流程設定。最多送幾則給 AI 讀資料庫的 update_settings(news),在控制台調整。
const settings = $('讀取更新設定').first().json;
const sources = Object.fromEntries($('讀取來源設定').all().map((i) => [i.json.id, i.json]));
return [{ json: {
  model: 'gemini-2.5-flash',
  lookbackDays: 120,          // 第一次看到的項目,只有發布在近 120 天內的才送 AI;更早的只記為已看過
  maxLlmItems: settings.max_llm_items ?? 30,
  batchSize: 10,              // 每次呼叫 AI 處理幾則
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
譯名:Agreement=協定、Arrangement=協議、Treaty=條約、Convention=公約、Covenant=盟約、MOU=備忘錄、Joint Statement / Joint Declaration=聯合聲明、Joint Statement Initiative=聯合聲明倡議、Pilot Project=先導計畫、WTO=世界貿易組織、General Council=總理事會、Ministerial Conference=部長會議、interim arrangements=過渡性安排。報導裡用 deal、pact 指稱電子商務協定時,一律寫「電子商務協定」,不可寫成「協議」。Taiwan 一律寫「中華民國(臺灣)」,「臺」不寫成「台」。
每一則都要回傳,key 必須和輸入完全相同。`;

const schema = { type: 'ARRAY', items: { type: 'OBJECT', properties: {
  key: { type: 'STRING' }, relevant: { type: 'BOOLEAN' },
  agreement_id: { type: 'STRING', enum: ['wto-jsi-ecommerce', 'wt-gc-283-moratorium', 'none'] },
  event_type: { type: 'STRING', enum: ['new_document', 'ministerial', 'accession', 'signed', 'in_force', 'news'] },
  event_date: { type: 'STRING' }, summary_zh: { type: 'STRING' }, confidence: { type: 'NUMBER' },
}, required: ['key', 'relevant', 'agreement_id', 'event_type', 'event_date', 'summary_zh', 'confidence'] } };

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
    contents: [{ role: 'user', parts: [{ text: JSON.stringify(payload) }] }],
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

const TIER = {
  'wto.org': 'S', 'ustr.gov': 'S', 'trade.gov.tw': 'S', 'europa.eu': 'S', 'gov.uk': 'S', 'mfat.govt.nz': 'S',
  'dfat.gov.au': 'S', 'mti.gov.sg': 'S', 'meti.go.jp': 'S', 'mofa.go.jp': 'S', 'mofa.gov.tw': 'S',
  'oecd.org': 'A', 'unctad.org': 'A', 'iisd.org': 'A', 'hinrichfoundation.com': 'A', 'piie.com': 'A',
  'cfr.org': 'A', 'brookings.edu': 'A', 'csis.org': 'A',
  'reuters.com': 'B', 'ft.com': 'B', 'bloomberg.com': 'B', 'wsj.com': 'B', 'nikkei.com': 'B', 'cna.com.tw': 'B',
  'economist.com': 'B', 'scmp.com': 'B', 'politico.eu': 'B', 'politico.com': 'B', 'theguardian.com': 'B',
  'bbc.com': 'B', 'bbc.co.uk': 'B', 'nytimes.com': 'B', 'apnews.com': 'B',
};
const tierOf = (d) => {
  const p = String(d || '').split('.');
  for (let i = 0; i < p.length - 1; i++) { const t = TIER[p.slice(i).join('.')]; if (t) return t; }
  return 'C';
};
const DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const today = new Date().toISOString().slice(0, 10);
const okDate = (s) => typeof s === 'string' && DATE.test(s) && s >= '1990' && s <= today;
const TYPES = ['new_document', 'ministerial', 'accession', 'signed', 'in_force', 'news'];
const STATE_CHANGING = ['signed', 'in_force', 'accession'];
// 譯名規則的最後防線(AI 偶爾不遵守):只改明確的詞,不碰「平台」這類一般用字
const fixTerms = (s) => s
  .replace(/電子商務協議/g, '電子商務協定')
  .replace(/台灣/g, '臺灣')
  .replace(/中華民國（臺灣）/g, '中華民國(臺灣)');

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
    events.push({
      agreement_id: agreementId, event_type: type, event_date: eventDate, summary_zh: summary,
      source_id: item.source_id, source_url: item.url, source_item_id: item.id, confidence: conf,
      status, by_tool: cfg.model, run_id: runId,
      new_value: { title: item.title, publisher: domain, tier, symbol: item.raw?.symbol ?? null },
    });
  }
});
return [{ json: { events, handledIds, failedIds, rejected } }];
"""

JS_FINISH = r"""
// 整理這次執行的結果:哪些項目標記為已處理、各來源狀態、執行紀錄
const run = $('建立執行紀錄').first().json;
const merged = $('合併與初篩').first().json;
const plan = $('規劃 AI 批次').first().json.summary;
const fresh = $('存入新項目').all().map((i) => i.json).filter((r) => r && r.id);
const v = $('驗證並產生事件').isExecuted
  ? $('驗證並產生事件').first().json
  : { events: [], handledIds: [], failedIds: [], rejected: [] };
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

# ─── Nodes ────────────────────────────────────────────────────────────────

Y, X = 400, 0
trigger = node("手動執行", "n8n-nodes-base.manualTrigger", 1, [X, Y], {})
settings = http("讀取更新設定", [X + 220, Y], "GET", f"{SB}/update_settings",
                query=[{"name": "pipeline", "value": "eq.news"}, {"name": "select", "value": "max_llm_items,auto_enabled"}])
srcs = http("讀取來源設定", [X + 440, Y], "GET", f"{SB}/sources",
            query=[{"name": "id", "value": f"in.({','.join(SOURCE_IDS)})"},
                   {"name": "select", "value": "id,enabled,tier,url,config"}], executeOnce=True)
config = code("設定", [X + 660, Y], JS_CONFIG)
run = http("建立執行紀錄", [X + 880, Y], "POST", f"{SB}/pipeline_runs",
           headers=[{"name": "Prefer", "value": "return=representation"}],
           body='={{ JSON.stringify({ pipeline: "all", trigger: "manual", runner: "n8n", status: "running" }) }}')

f_docs = http("抓 WTO 官方文件", [X + 1100, Y - 200], "GET",
              "https://docs.wto.org/dol2fe/Pages/SS/GetXMLResults.aspx", cred=None, text=True,
              headers=[UA],
              query=[{"name": "DataSource", "value": "Cat"},
                     {"name": "query", "value": "={{ $('設定').first().json.sources['wto-docs-ecom'].config.query }}"},
                     {"name": "Language", "value": "English"}], **FETCH)
p_docs = code("整理 WTO 文件", [X + 1320, Y - 200], JS_PARSE_DOCS)
f_news = http("抓 WTO 新聞", [X + 1540, Y - 200], "GET", "https://www.wto.org/library/rss/latest_news_e.xml",
              cred=None, text=True, headers=[UA], **FETCH)
p_news = code("整理 WTO 新聞", [X + 1760, Y - 200], JS_PARSE_WTO_NEWS)
f_gn = http("抓 Google 新聞", [X + 1980, Y - 200], "GET", "https://news.google.com/rss/search",
            cred=None, text=True, headers=[UA],
            query=[{"name": n, "value": f"={{{{ $('設定').first().json.sources['gnews-wto-ecom'].config.{n} }}}}"}
                   for n in ("q", "hl", "gl", "ceid")], **FETCH)
p_gn = code("整理 Google 新聞", [X + 2200, Y - 200], JS_PARSE_GNEWS)

collect = code("合併與初篩", [X + 2420, Y], JS_COLLECT)
store = http("存入新項目", [X + 2640, Y], "POST", f"{SB}/source_items",
             query=[{"name": "on_conflict", "value": "source_id,item_key"}],
             headers=[{"name": "Prefer", "value": "resolution=ignore-duplicates,return=representation"}],
             body="={{ JSON.stringify($json.rows) }}", alwaysOutputData=True)
pending = http("讀取待處理項目", [X + 2860, Y], "GET", f"{SB}/source_items",
               query=[{"name": "select", "value": "id,source_id,item_key,title,url,published_at,raw"},
                      {"name": "processed_at", "value": "is.null"},
                      {"name": "source_id", "value": f"in.({','.join(SOURCE_IDS)})"},
                      {"name": "order", "value": "published_at.desc.nullslast"},
                      {"name": "limit", "value": "1000"}],
               executeOnce=True, alwaysOutputData=True)
plan = code("規劃 AI 批次", [X + 3080, Y], JS_PLAN)
gate = node("有要給 AI 的項目?", "n8n-nodes-base.if", 2.2, [X + 3300, Y], {
    "conditions": {
        "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
        "conditions": [{"id": str(uuid.uuid5(uuid.NAMESPACE_URL, "gate")), "leftValue": "={{ $json.hasBatch }}",
                        "rightValue": "", "operator": {"type": "boolean", "operation": "true", "singleValue": True}}],
        "combinator": "and",
    },
    "options": {},
})
llm = http("AI 分類與摘要", [X + 3520, Y - 160], "POST",
           "=https://generativelanguage.googleapis.com/v1beta/models/{{ $('設定').first().json.model }}:generateContent",
           cred=GEMINI_CRED, body="={{ JSON.stringify($json.request) }}", timeout=120000,
           retryOnFail=True, maxTries=3, waitBetweenTries=5000, onError="continueRegularOutput")
validate = code("驗證並產生事件", [X + 3740, Y - 160], JS_VALIDATE)
write = http("寫入事件", [X + 3960, Y - 160], "POST", f"{SB}/events",
             headers=[{"name": "Prefer", "value": "return=minimal"}],
             body="={{ JSON.stringify($json.events) }}", onError="continueRegularOutput", alwaysOutputData=True)
finish = code("收尾整理", [X + 4180, Y], JS_FINISH)
mark = http("標記已處理", [X + 4400, Y], "PATCH", f"{SB}/source_items",
            query=[{"name": "id", "value": "={{ $('收尾整理').first().json.processedFilter }}"}],
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body="={{ JSON.stringify({ processed_at: new Date().toISOString() }) }}",
            executeOnce=True, alwaysOutputData=True)
sruns = http("寫入來源結果", [X + 4620, Y], "POST", f"{SB}/source_runs",
             headers=[{"name": "Prefer", "value": "return=minimal"}],
             body="={{ JSON.stringify($('收尾整理').first().json.sourceRuns) }}", executeOnce=True, alwaysOutputData=True)
done = http("完成執行紀錄", [X + 4840, Y], "PATCH", f"{SB}/pipeline_runs",
            query=[{"name": "id", "value": "=eq.{{ $('建立執行紀錄').first().json.id }}"}],
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body="={{ JSON.stringify($('收尾整理').first().json.runPatch) }}", executeOnce=True, alwaysOutputData=True)
report = code("執行摘要", [X + 5060, Y], "return [{ json: $('收尾整理').first().json.report }];")

node("說明", "n8n-nodes-base.stickyNote", 1, [X - 40, Y - 420], {
    "content": (
        "## WTO 電子商務 JSI 追蹤(第一條流程)\n"
        "**只會在手動執行時跑**,沒有排程(自動更新預設關閉)。\n\n"
        "1. 讀資料庫的更新設定與來源開關\n"
        "2. 抓 WTO 官方文件庫、WTO 新聞、Google 新聞\n"
        "3. 存入資料庫,只留下尚未處理的項目\n"
        "4. AI 分批分類、摘要(附譯名對照)\n"
        "5. 品質檢查後寫入事件:官方/學術/一線媒體直接顯示,其餘待確認\n\n"
        "每個節點都可以點開看輸入與輸出。"
    ),
    "height": 300, "width": 520, "color": 5,
})

for a, b in [(trigger, settings), (settings, srcs), (srcs, config), (config, run), (run, f_docs),
             (f_docs, p_docs), (p_docs, f_news), (f_news, p_news), (p_news, f_gn), (f_gn, p_gn),
             (p_gn, collect), (collect, store), (store, pending), (pending, plan), (plan, gate),
             (llm, validate), (validate, write), (write, finish),
             (finish, mark), (mark, sruns), (sruns, done), (done, report)]:
    link(a, b)
link(gate, llm, 0)
link(gate, finish, 1)

workflow = {
    "id": WORKFLOW_ID,
    "name": "WTO 電子商務 JSI 追蹤",
    "active": False,
    "nodes": nodes,
    "connections": connections,
    "settings": {"executionOrder": "v1", "timezone": "Asia/Taipei", "saveManualExecutions": True,
                 "saveDataSuccessExecution": "all", "saveDataErrorExecution": "all"},
    "pinData": {},
    "meta": {"templateCredsSetupCompleted": True},
}

OUT.write_text(json.dumps(workflow, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {OUT.name}: {len(nodes)} nodes")
