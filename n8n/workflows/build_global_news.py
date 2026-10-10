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

from n8n_build import (FETCH, FLOW_PATHS, GEMINI_CRED, JS_PARSE_RSS, JS_TIERS, PAD, SB, STEP, UA,
                       Workflow, xs)

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

JS_PLAN = r"""
// 1) 找出每則新聞提到的國家與組織 → 候選協定  2) 沒有候選的只記為已看過  3) 組成給 AI 的提示
const cfg = $('設定').first().json;
const pending = $('讀取待處理項目').all().map((i) => i.json).filter((r) => r && r.id);
const agreements = $('讀取協定清單').all().map((i) => i.json).filter((r) => r && r.id);
const countries = $('讀取國家名稱').all().map((i) => i.json).filter((r) => r && r.code);
const orgs = $('讀取組織名稱').all().map((i) => i.json).filter((r) => r && r.code);
const known = $('讀取近期事件').all().map((i) => i.json).filter((r) => r && r.id)
  .map((e) => ({ id: e.id, agreement_id: e.agreement_id, date: e.event_date, summary: e.summary_zh }));

// 名稱 → 代碼。中文用子字串比對;英文用整個字比對,全大寫縮寫(EU、UK、US)區分大小寫
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cjk = (s) => /[㐀-鿿]/.test(s);
const matchers = [];
const add = (alias, code) => {
  const a = String(alias ?? '').trim();
  if (!a || (cjk(a) ? a.length < 2 : (a.length < 4 && !['EU', 'UK', 'US', 'USA', 'UAE', 'GCC'].includes(a)))) return;
  const upper = a === a.toUpperCase();
  matchers.push({ code, a, re: cjk(a) ? null : new RegExp(`(^|[^A-Za-z])${esc(a)}([^A-Za-z]|$)`, upper ? '' : 'i') });
};
for (const c of countries) { add(c.name_en, c.code); add(c.name_zh, c.code); (c.aliases ?? []).forEach((x) => add(x, c.code)); }
for (const o of orgs) { add(o.name_en, o.code); add(o.abbr, o.code); add(o.name_zh, o.code); add(o.abbr_zh, o.code); }

const byParty = new Map();
for (const a of agreements) for (const p of a.parties ?? []) { if (!byParty.has(p)) byParty.set(p, []); byParty.get(p).push(a); }
const names = agreements.map((a) => ({ a, keys: [a.short_name, (a.name_zh || '').split(/ \(|（/)[0], a.name]
  .filter((n) => n && n.length >= 4).map((n) => n.toLowerCase()) }));
const latest = (a) => Object.values(a.key_dates ?? {}).sort().pop() ?? '';

const candidatesFor = (text) => {
  const lower = text.toLowerCase();
  const codes = new Set(matchers.filter((m) => (m.re ? m.re.test(text) : text.includes(m.a))).map((m) => m.code));
  const score = new Map();
  for (const code of codes) for (const a of byParty.get(code) ?? []) {
    const hits = (a.parties ?? []).filter((p) => codes.has(p)).length;
    score.set(a.id, Math.max(score.get(a.id) ?? 0, hits * 10));
  }
  for (const { a, keys } of names) if (keys.some((k) => lower.includes(k))) score.set(a.id, (score.get(a.id) ?? 0) + 25);
  const byId = new Map(agreements.map((a) => [a.id, a]));
  return [...score.entries()].map(([id, s]) => {
    const a = byId.get(id);
    return { a, s: s + (a.origin === 'curated' ? 3 : 0) + (a.status === 'expired' ? -5 : 0) + (latest(a) >= '2020' ? 2 : 0) };
  }).sort((x, y) => y.s - x.s).slice(0, cfg.maxCandidates)
    .map(({ a }) => ({ id: a.id, name: a.name_zh || a.name, status: a.status, parties: (a.parties ?? []).slice(0, 8) }));
};

const cutoff = Date.now() - cfg.lookbackDays * 86400000;
const recent = pending.filter((r) => !r.published_at || Date.parse(r.published_at) >= cutoff)
  .sort((a, b) => String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')));
const withCands = [], baselineIds = pending.filter((r) => r.published_at && Date.parse(r.published_at) < cutoff).map((r) => r.id);
for (const r of recent) {
  const cands = candidatesFor(`${r.title} ${r.raw?.description ?? ''}`);
  if (cands.length) withCands.push({ r, cands }); else baselineIds.push(r.id);   // 沒提到任何已知國家或協定
}
const forLlm = withCands.slice(0, cfg.maxLlmItems);
const summary = { pending: pending.length, baselineIds, deferred: withCands.length - forLlm.length, llmCount: forLlm.length,
                  noCandidates: recent.length - withCands.length };

const system = `你是國際貿易協定研究助理。每則輸入是一則新聞,附有「候選協定」清單(資料庫中可能相關的協定)。請判斷:
1. relevant:這則新聞是否報導「某個特定貿易協定」的具體進展(啟動談判、完成談判、簽署、批准或生效、新成員加入、暫停)。泛論、評論、關稅措施、只是提到協定名稱的報導判 false。
2. agreement_id:從候選協定中選出報導的那一個,填它的 id。如果是資料庫還沒有的協定(候選裡沒有),填 new;不相關填 none。只能填候選清單裡的 id、new 或 none。
3. proposed_name_zh:agreement_id 為 new 時,寫這個協定的中文名稱(例如「阿聯–歐亞經濟聯盟經濟夥伴協定」);否則留空字串。
4. event_type:started(啟動談判)、concluded(完成談判)、signed(簽署)、in_force(生效)、accession(新成員加入)、suspended(暫停)、ministerial(部長會議或聯合委員會)、news(其他進展)。只有原文明確寫出已簽署、已生效、已完成談判,才可用對應類型;「預計」「將於」一律用 news。
5. event_date:事件發生日期 YYYY-MM-DD;不確定就用新聞發布日期。
6. summary_zh:臺灣繁體中文摘要,80 字以內,只能根據提供的內容,不可推測。專有名詞第一次出現時用半形括號附英文原文。
7. confidence:0 到 1。
8. story:英文小寫與連字號的簡短代號,描述報導的具體事件,例如 uae-eaeu-epa-enters-into-force。同一批裡報導同一件事的新聞,story 必須完全相同。
9. same_as:如果和 known_events 中某一則是同一件事,填那則事件的 id,否則填 0。
譯名:Agreement=協定、Arrangement=協議、Treaty=條約、MOU=備忘錄、Joint Statement=聯合聲明、Economic Partnership Agreement=經濟夥伴協定、Free Trade Agreement=自由貿易協定。GATT=關稅及貿易總協定、Safeguards=防衛措施、Countervailing duties=平衡稅、Rules of origin=原產地規則、Most-favoured-nation=最惠國待遇。專有名詞(協定、組織、法規、會議名稱)第一次出現時寫成「中文 (原文)」,用半形括號;中文採我國官方譯名,不得使用中國大陸用語(例如「數字貿易」應為「數位貿易」、「信息」應為「資訊」)。Taiwan 一律寫「中華民國(臺灣)」,「臺」不寫成「台」。
每一則都要回傳,key 必須和輸入完全相同。`;

const schema = { type: 'ARRAY', items: { type: 'OBJECT', properties: {
  key: { type: 'STRING' }, relevant: { type: 'BOOLEAN' }, agreement_id: { type: 'STRING' },
  proposed_name_zh: { type: 'STRING' },
  event_type: { type: 'STRING', enum: ['started', 'concluded', 'signed', 'in_force', 'accession', 'suspended', 'ministerial', 'news'] },
  event_date: { type: 'STRING' }, summary_zh: { type: 'STRING' }, confidence: { type: 'NUMBER' },
  story: { type: 'STRING' }, same_as: { type: 'INTEGER' },
}, required: ['key', 'relevant', 'agreement_id', 'proposed_name_zh', 'event_type', 'event_date', 'summary_zh', 'confidence', 'story', 'same_as'] } };

if (!forLlm.length) return [{ json: { hasBatch: false, batch: [], summary } }];
const payload = forLlm.map(({ r, cands }) => ({
  key: String(r.id), publisher: r.raw?.publisher_domain ?? '', published_at: r.published_at,
  title: r.title, description: r.raw?.description ?? '', candidates: cands,
}));
return [{ json: { hasBatch: true, batch: forLlm.map(({ r, cands }) => ({ ...r, candidateIds: cands.map((c) => c.id) })), summary, request: {
  systemInstruction: { parts: [{ text: system }] },
  contents: [{ role: 'user', parts: [{ text: JSON.stringify({ items: payload, known_events: known }) }] }],
  generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.2 },
} } }];
"""

JS_VALIDATE = r"""
// 品質檢查:協定代碼必須來自候選清單 → 日期 → 來源信任等級 → 決定「顯示(active)/待確認(pending)」
const cfg = $('設定').first().json;
const runId = $('建立執行紀錄').first().json.id;
const plans = $('規劃 AI 批次').all().map((i) => i.json).filter((p) => p.hasBatch);
const responses = $input.all().map((i) => i.json);
__TIERS__
const DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const today = new Date().toISOString().slice(0, 10);
const okDate = (s) => typeof s === 'string' && DATE.test(s) && s >= '1990' && s <= today;
const TYPES = ['started', 'concluded', 'signed', 'in_force', 'accession', 'suspended', 'ministerial', 'news'];
const STATE_CHANGING = ['started', 'concluded', 'signed', 'in_force', 'accession', 'suspended'];
const fixTerms = (s) => s.replace(/台灣/g, '臺灣').replace(/中華民國（臺灣）/g, '中華民國(臺灣)');
const known = Object.fromEntries($('讀取近期事件').all().map((i) => i.json).filter((r) => r && r.id)
  .map((e) => [e.id, { ...e, story_key: e.story_key || `event-${e.id}`, tier: e.new_value?.tier ?? 'S' }]));
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
    if (!o.relevant || o.agreement_id === 'none') { rejected.push({ id: item.id, reason: 'not relevant' }); continue; }
    const isNew = o.agreement_id === 'new';
    if (!isNew && !item.candidateIds.includes(o.agreement_id)) { rejected.push({ id: item.id, reason: `id not in candidates: ${o.agreement_id}` }); continue; }
    const summary = fixTerms(String(o.summary_zh || '').trim()).slice(0, 200);
    if (!summary) { rejected.push({ id: item.id, reason: 'empty summary' }); continue; }
    const domain = item.raw?.publisher_domain || '';
    if (isBlocked(domain)) { rejected.push({ id: item.id, reason: 'mainland Chinese source' }); continue; }
    const tier = tierOf(domain);
    const type = TYPES.includes(o.event_type) ? o.event_type : 'news';
    const conf = Math.max(0, Math.min(1, Number(o.confidence) || 0));
    const published = String(item.published_at || '').slice(0, 10);
    const eventDate = okDate(o.event_date) ? o.event_date : (okDate(published) ? published : null);
    let status = 'pending';
    if (isNew) status = 'pending';                                        // 新協定:要人工確認後才加入資料庫
    else if (tier === 'S' && conf >= 0.7) status = 'active';
    else if (STATE_CHANGING.includes(type)) status = 'pending';           // 非官方來源宣稱狀態改變:待交叉確認
    else if ((tier === 'A' || tier === 'B') && conf >= 0.6) status = 'active';
    const agreementId = isNew ? null : o.agreement_id;
    const same = known[Number(o.same_as)];
    const storyKey = same && (isNew || same.agreement_id === agreementId)
      ? same.story_key
      : `${agreementId ?? 'new'}/${(eventDate || today).slice(0, 7)}/${slug(o.story) || `item-${item.id}`}`;
    events.push({
      agreement_id: agreementId, event_type: type, event_date: eventDate, summary_zh: summary,
      source_id: item.source_id, source_url: item.url, source_item_id: item.id, confidence: conf,
      status, by_tool: cfg.model, run_id: runId, story_key: storyKey,
      new_value: { title: item.title, publisher: domain, tier,
                   proposed_name: isNew ? String(o.proposed_name_zh || '').slice(0, 120) || null : null },
    });
  }
});

// 交叉確認:(1) 同一件事已有可信來源(S/A/B)且已顯示的事件;或 (2) 這次有兩家以上不同的可信媒體(A/B)報導同一件事
const trusted = new Set(Object.values(known).filter((e) => e.status === 'active' && e.tier !== 'C').map((e) => e.story_key));
const outlets = {};
for (const e of events) if (e.new_value.tier !== 'C') (outlets[e.story_key] ??= new Set()).add(e.new_value.publisher);
for (const [k, s] of Object.entries(outlets)) if (s.size >= 2) trusted.add(k);
for (const e of events) if (e.status === 'active' && e.new_value.tier !== 'C') trusted.add(e.story_key);
let corroborated = 0;
for (const e of events) {
  if (e.status === 'pending' && e.agreement_id && trusted.has(e.story_key)) { e.status = 'active'; corroborated++; }
}
return [{ json: { events, handledIds, failedIds, rejected, corroborated } }];
""".replace("__TIERS__", JS_TIERS.strip())

JS_FINISH = r"""
// 整理這次執行的結果:哪些項目標記為已處理、各來源狀態、執行紀錄
const run = $('建立執行紀錄').first().json;
const merged = $('合併兩個來源').first().json;
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
const written = writeFailed ? [] : v.events;
const report = {
  抓取: Object.fromEntries(Object.entries(merged.stats).map(([k, s]) => [k, `${s.status}:抓到 ${s.fetched} 則`])),
  第一次見到: fresh.length,
  沒提到已知國家或協定: plan.noCandidates,
  只記為已看過的舊項目: plan.baselineIds.length - plan.noCandidates,
  送給AI: plan.llmCount,
  超過上限留待下次: plan.deferred,
  AI處理失敗留待下次: v.failedIds.length,
  判定不相關: v.rejected.length,
  新事件: written.length,
  其中直接顯示: written.filter((e) => e.status === 'active').length,
  其中待確認: written.filter((e) => e.status === 'pending').length,
  其中因交叉確認而顯示: writeFailed ? 0 : (v.corroborated ?? 0),
  資料庫還沒有的協定: written.filter((e) => !e.agreement_id).map((e) => e.new_value.proposed_name),
  事件預覽: written.slice(0, 20).map((e) => `[${e.status}] ${e.agreement_id ?? '新協定'}:${e.summary_zh}`),
};
return [{ json: {
  processedFilter: processed.length ? `in.(${processed.join(',')})` : 'eq.-1',
  sourceRuns,
  runPatch: { status: partial ? 'partial' : 'success', finished_at: new Date().toISOString(),
              llm_items: plan.llmCount, events_count: written.length,
              error: writeFailed ? String($('寫入事件').first().json.error?.message ?? 'events insert failed') : null },
  report,
} }];
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
plan = code("規劃 AI 批次", [S3[7], MAIN_Y], JS_PLAN, note="找候選協定、最多 30 則")
gate = wf.if_true("有要給 AI 的項目?", [S3[8], MAIN_Y], "={{ $json.hasBatch }}",
                  note="上:有 → AI;下:沒有 → 收尾")

llm = http("AI 判斷與摘要", [S4[0], AI_Y], "POST",
           "=https://generativelanguage.googleapis.com/v1beta/models/{{ $('設定').first().json.model }}:generateContent",
           cred=GEMINI_CRED, body="={{ JSON.stringify($json.request) }}", timeout=180000,
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
