"""Shared helpers for the n8n workflow generators (build_*.py).

Each generator builds one Workflow and writes it as JSON for `n8n import:workflow`.
Every workflow follows the same canvas conventions so the user can read it:
colour-coded section sticky notes that explain each node, a one-line note under
every node, and an overview sticky at the top-left.
"""
from __future__ import annotations

import json
import uuid
from pathlib import Path

SB = "https://tsvmouanmvhbhwwwqtdt.supabase.co/rest/v1"
SB_CRED = {"httpHeaderAuth": {"id": "TtSupabaseSecret", "name": "Supabase secret key (trade-tracker)"}}
GEMINI_CRED = {"httpHeaderAuth": {"id": "TtGeminiApiKey01", "name": "Gemini API key"}}
UA = {"name": "User-Agent", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) trade-tracker"}
# Key the web app sends (header X-TT-Key) when it starts a flow or changes a setting.
WEBHOOK_CRED = {"httpHeaderAuth": {"id": "TtWebhookKey0001", "name": "Webhook key (trade-tracker)"}}
# Pages allowed to call the webhooks: the desktop app and the dev preview (both local only).
WEB_ORIGINS = "http://localhost:8080,http://localhost:8082"
# Webhook paths the web app and the scheduler call (http://localhost:5678/webhook/<path>).
FLOW_PATHS = {"wto_rta_sync": "tt-run-wto-rta-sync", "jsi_ecom": "tt-run-jsi-ecom", "global_news": "tt-run-global-news",
              "official": "tt-run-official-sources"}
# 「立即更新」and the scheduler start every flow of a pipeline.
RUN_PATHS = {"database": [FLOW_PATHS["wto_rta_sync"]],
             "news": [FLOW_PATHS["jsi_ecom"], FLOW_PATHS["global_news"], FLOW_PATHS["official"]]}
SETTINGS_PATH = "tt-settings"
REVIEW_PATHS = {"list": "tt-review-list", "decide": "tt-review-decide"}

# Settings for fetch nodes: run once, retry, and let the flow carry on when a source is down.
FETCH = dict(executeOnce=True, retryOnFail=True, maxTries=3, waitBetweenTries=3000,
             onError="continueRegularOutput")

# ─── JavaScript shared by the news flows ──────────────────────────────────

JS_DECODE = r"""
const decode = (s) => String(s ?? '')
  .replace(/<!\[CDATA\[|\]\]>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
"""

JS_PARSE_RSS = JS_DECODE + r"""
const parseRss = (xml) => (String(xml).match(/<item[\s>][\s\S]*?<\/item>/g) || []).map((it) => {
  const get = (t) => { const m = it.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };
  const sourceUrl = (it.match(/<source[^>]*url="([^"]+)"/) || [])[1] || '';
  return { title: get('title'), link: get('link'), guid: get('guid'), description: get('description'),
           pubDate: get('pubDate'), source: get('source'), sourceUrl };
});
const isoDate = (s) => { const t = Date.parse(s); return Number.isNaN(t) ? null : new Date(t).toISOString(); };
// RSS(<item>)或 Atom(<entry>,連結寫在 <link href="…"/>)都能讀
const parseFeed = (xml) => {
  const s = String(xml);
  const blocks = s.match(/<item[\s>][\s\S]*?<\/item>/g) || s.match(/<entry[\s>][\s\S]*?<\/entry>/g) || [];
  return blocks.map((it) => {
    const get = (t) => { const m = it.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };
    const href = (it.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/) || it.match(/<link[^>]*href="([^"]+)"/) || [])[1] || '';
    return { title: get('title'), link: get('link') || decode(href), guid: get('guid') || get('id'),
             description: get('description') || get('summary'),
             pubDate: get('pubDate') || get('published') || get('updated') || get('dc:date') };
  });
};
// n8n 的 Code 執行環境沒有 URL 物件,改用字串處理取網域
const host = (u) => String(u || '').replace(/^[a-z]+:\/\//i, '').split(/[/?#:]/)[0].replace(/^www\./, '').toLowerCase();
"""

JS_TIERS = r"""
// 來源信任等級:S 官方、A 學術智庫、B 一線媒體;其他一律 C。比對網域尾端(例如 asia.nikkei.com → nikkei.com)
const TIER = {
  // 官方:國際組織與各國貿易主管機關
  'wto.org': 'S', 'efta.int': 'S', 'asean.org': 'S', 'mercosur.int': 'S', 'europa.eu': 'S', 'admin.ch': 'S',
  'ustr.gov': 'S', 'commerce.gov': 'S', 'whitehouse.gov': 'S', 'gov.uk': 'S', 'international.gc.ca': 'S',
  'dfat.gov.au': 'S', 'mfat.govt.nz': 'S', 'mti.gov.sg': 'S', 'miti.gov.my': 'S', 'meti.go.jp': 'S', 'mofa.go.jp': 'S',
  'motie.go.kr': 'S', 'commerce.gov.in': 'S', 'pib.gov.in': 'S', 'gob.mx': 'S', 'gov.br': 'S',
  'trade.gov.tw': 'S', 'moea.gov.tw': 'S', 'ey.gov.tw': 'S', 'mofa.gov.tw': 'S', 'president.gov.tw': 'S',
  // 學術與智庫
  'oecd.org': 'A', 'unctad.org': 'A', 'iisd.org': 'A', 'hinrichfoundation.com': 'A', 'piie.com': 'A',
  'cfr.org': 'A', 'brookings.edu': 'A', 'csis.org': 'A', 'ecipe.org': 'A', 'bruegel.org': 'A', 'chathamhouse.org': 'A',
  'carnegieendowment.org': 'A', 'lowyinstitute.org': 'A', 'eastasiaforum.org': 'A', 'digitalpolicyalert.org': 'A',
  'wita.org': 'A', 'cier.edu.tw': 'A', 'tier.org.tw': 'A',
  // 一線媒體與通訊社
  'reuters.com': 'B', 'ft.com': 'B', 'bloomberg.com': 'B', 'wsj.com': 'B', 'nikkei.com': 'B', 'economist.com': 'B',
  'apnews.com': 'B', 'afp.com': 'B', 'bbc.com': 'B', 'bbc.co.uk': 'B', 'nytimes.com': 'B', 'theguardian.com': 'B',
  'politico.eu': 'B', 'politico.com': 'B', 'euractiv.com': 'B', 'borderlex.net': 'B', 'insidetrade.com': 'B',
  'ip-watch.org': 'B', 'devex.com': 'B', 'dw.com': 'B', 'france24.com': 'B', 'aljazeera.com': 'B',
  'scmp.com': 'B', 'straitstimes.com': 'B', 'kyodonews.net': 'B', 'yna.co.kr': 'B', 'koreaherald.com': 'B',
  'bernama.com': 'B', 'antaranews.com': 'B', 'abc.net.au': 'B', 'rnz.co.nz': 'B', 'cbc.ca': 'B',
  'theglobeandmail.com': 'B', 'mercopress.com': 'B', 'batimes.com.ar': 'B',
  'economictimes.com': 'B', 'thehindubusinessline.com': 'B', 'thehindu.com': 'B', 'livemint.com': 'B',
  'business-standard.com': 'B', 'financialexpress.com': 'B', 'indianexpress.com': 'B', 'hindustantimes.com': 'B',
  'cna.com.tw': 'B', 'focustaiwan.tw': 'B', 'taipeitimes.com': 'B', 'udn.com': 'B', 'ltn.com.tw': 'B',
  'chinatimes.com': 'B', 'cw.com.tw': 'B', 'rti.org.tw': 'B', 'pts.org.tw': 'B', 'ftvnews.com.tw': 'B',
  'tvbs.com.tw': 'B', 'setn.com': 'B', 'ettoday.net': 'B', 'storm.mg': 'B', 'businessweekly.com.tw': 'B',
  'wealth.com.tw': 'B', 'ctee.com.tw': 'B', 'moneydj.com': 'B', 'technews.tw': 'B',
  'gmanetwork.com': 'B', 'inquirer.net': 'B', 'philstar.com': 'B', 'bangkokpost.com': 'B', 'nationthailand.com': 'B',
  'vnexpress.net': 'B', 'thejakartapost.com': 'B', 'thestar.com.my': 'B', 'channelnewsasia.com': 'B',
  'arabnews.com': 'B', 'thenationalnews.com': 'B', 'gulfnews.com': 'B', 'khaleejtimes.com': 'B', 'zawya.com': 'B',
  'wam.ae': 'B', 'spa.gov.sa': 'B', 'japantimes.co.jp': 'B', 'asahi.com': 'B', 'mainichi.jp': 'B', 'nhk.or.jp': 'B',
};
const tierOf = (d) => {
  const p = String(d || '').split('.');
  for (let i = 0; i < p.length - 1; i++) { const t = TIER[p.slice(i).join('.')]; if (t) return t; }
  return 'C';
};
// 本工具不採用中國大陸的來源:.cn 網域、官方媒體與入口網站的報導一律不寫入
const BLOCKED = ['cn', 'xinhuanet.com', 'chinadaily.com.cn', 'cgtn.com', 'chinanews.com', 'huanqiu.com', 'cctv.com',
  'caixin.com', 'yicai.com', 'sohu.com', '163.com', 'qq.com', 'ifeng.com', 'eastmoney.com', 'jiemian.com'];
const isBlocked = (d) => {
  const p = String(d || '').toLowerCase().split('.');
  for (let i = 0; i < p.length; i++) if (BLOCKED.includes(p.slice(i).join('.'))) return true;
  return false;
};
"""


# ─── JavaScript shared by the news flows (global news, official sources) ──────

_NEWS_PLAN = r"""
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
const onTopic = __ON_TOPIC__;           // 與協定無關的項目(依關鍵字)不送 AI
let offTopic = 0;
for (const r of recent) {
  if (!onTopic(`${r.title} ${r.raw?.description ?? ''}`)) { baselineIds.push(r.id); offTopic++; continue; }
  const cands = candidatesFor(`${r.title} ${r.raw?.description ?? ''}`);
  if (cands.length) withCands.push({ r, cands }); else baselineIds.push(r.id);   // 沒提到任何已知國家或協定
}
const forLlm = withCands.slice(0, cfg.maxLlmItems);
const summary = { pending: pending.length, baselineIds, deferred: withCands.length - forLlm.length, llmCount: forLlm.length,
                  noCandidates: recent.length - withCands.length - offTopic, offTopic };

const system = `你是國際貿易協定研究助理。每則輸入是一則__INPUT_KIND__,附有「候選協定」清單(資料庫中可能相關的協定)。請判斷:
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

_NEWS_VALIDATE = r"""
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
    const tier = item.raw?.tier || tierOf(domain);
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
"""

_NEWS_FINISH = r"""
// 整理這次執行的結果:哪些項目標記為已處理、各來源狀態、執行紀錄
const run = $('建立執行紀錄').first().json;
const merged = $('__COLLECT__').first().json;
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
  與協定無關略過: plan.offTopic ?? 0,
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


def js_news_plan(input_kind: str = "新聞", on_topic: str = "() => true") -> str:
    """Pick candidate agreements for each new item and build the Gemini request.

    input_kind: how the prompt names an item (「新聞」, 「官方新聞稿或公告」).
    on_topic: JS predicate on the item text; items it rejects are only marked as seen.
    """
    return _NEWS_PLAN.replace("__INPUT_KIND__", input_kind).replace("__ON_TOPIC__", on_topic)


def js_news_validate() -> str:
    """Check the AI output and turn it into events (shown at once, or waiting for review)."""
    return _NEWS_VALIDATE.replace("__TIERS__", JS_TIERS.strip())


def js_news_finish(collect_node: str) -> str:
    """Wrap up a run: items to mark processed, per-source results, the run record, the report."""
    return _NEWS_FINISH.replace("__COLLECT__", collect_node)

# ─── Layout ───────────────────────────────────────────────────────────────

STEP = 260          # horizontal distance between nodes
NODE_H = 100        # node box height
NOTE_H = 50         # room for the one-line note under a node
PAD = 40


def xs(start, n):
    return [start + i * STEP for i in range(n)]


def text_height(content, width):
    """Generous estimate of how tall a sticky's text is (CJK ~14px wide, ~24px per line)."""
    per_line = max(10, int((width - 40) / 14))
    h = 30
    for line in content.split("\n"):
        if line.startswith("## "):
            h += 44
        elif not line.strip():
            h += 12
        else:
            h += 24 * max(1, -(-len(line) // per_line))
    return h + 10


class Workflow:
    def __init__(self, workflow_id: str, name: str):
        self.id = workflow_id
        self.name = name
        self.nodes: list[dict] = []
        self.connections: dict[str, dict] = {}
        self.sections: list[tuple] = []

    def node(self, name, type_, version, pos, params, note=None, **extra):
        """note: one-line description shown under the node on the canvas."""
        if note:
            extra |= {"notes": note, "notesInFlow": True}
        self.nodes.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_URL, f"{self.id}/{name}")),
            "name": name, "type": type_, "typeVersion": version, "position": pos,
            "parameters": params, **extra,
        })
        return name

    def link(self, src, dst, out=0):
        outs = self.connections.setdefault(src, {"main": []})["main"]
        while len(outs) <= out:
            outs.append([])
        outs[out].append({"node": dst, "type": "main", "index": 0})

    def chain(self, *names):
        for a, b in zip(names, names[1:]):
            self.link(a, b)

    def http(self, name, pos, method, url, *, cred=SB_CRED, query=None, headers=None, body=None,
             text=False, timeout=60000, pagination=None, note=None, **settings):
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
        if pagination:
            params["options"]["pagination"] = {"pagination": pagination}
        extra = {"credentials": cred} if cred else {}
        return self.node(name, "n8n-nodes-base.httpRequest", 4.2, pos, params, note=note, **extra, **settings)

    def code(self, name, pos, js, note=None, **settings):
        return self.node(name, "n8n-nodes-base.code", 2, pos,
                         {"mode": "runOnceForAllItems", "jsCode": js.strip()}, note=note, **settings)

    def webhook(self, name, pos, path, note=None, respond="onReceived"):
        """POST webhook guarded by the X-TT-Key header; only the local web app may call it (CORS).

        respond="onReceived" answers at once (long flows); "lastNode" answers with the last node's output.
        Production webhooks only work while the workflow is published (n8n publish:workflow).
        """
        params = {"httpMethod": "POST", "path": path, "authentication": "headerAuth",
                  "responseMode": respond, "options": {"allowedOrigins": WEB_ORIGINS}}
        if respond == "lastNode":
            params["responseData"] = "firstEntryJson"
        return self.node(name, "n8n-nodes-base.webhook", 2, pos, params, note=note,
                         webhookId=str(uuid.uuid5(uuid.NAMESPACE_URL, f"{self.id}/{path}")),
                         credentials=WEBHOOK_CRED)

    def if_true(self, name, pos, expr, note=None, cond_key=None):
        """IF node: output 0 when `expr` is true, output 1 otherwise."""
        cond_id = str(uuid.uuid5(uuid.NAMESPACE_URL, cond_key or f"{self.id}/{name}/cond"))
        return self.node(name, "n8n-nodes-base.if", 2.2, pos, {
            "conditions": {
                "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
                "conditions": [{"id": cond_id, "leftValue": expr, "rightValue": "",
                                "operator": {"type": "boolean", "operation": "true", "singleValue": True}}],
                "combinator": "and",
            },
            "options": {},
        }, note=note)

    def sticky(self, name, pos, width, height, color, content):
        """A note on the canvas. Placed behind nodes, so it can frame a group of them."""
        return self.node(name, "n8n-nodes-base.stickyNote", 1, pos,
                         {"content": content, "width": width, "height": height, "color": color})

    def section(self, name, xs_, y, color, content, below=0):
        """Sticky note framing nodes placed at x positions xs_ on row y: text on top, nodes below.

        below: extra height under the row, for nodes placed lower (e.g. a second trigger)."""
        x = xs_[0] - PAD
        width = xs_[-1] - xs_[0] + 100 + 2 * PAD
        th = text_height(content, width)
        top = y - th - 20
        height = th + 20 + NODE_H + NOTE_H + PAD + below
        self.sticky(name, [x, top], width, height, color, content)
        self.sections.append((name, x, top, width, height, y, xs_))

    def save(self, path: Path, **settings):
        workflow = {
            "id": self.id,
            "name": self.name,
            "active": False,
            "nodes": self.nodes,
            "connections": self.connections,
            "settings": {"executionOrder": "v1", "timezone": "Asia/Taipei", "saveManualExecutions": True,
                         "saveDataSuccessExecution": "all", "saveDataErrorExecution": "all"} | settings,
            "pinData": {},
            "meta": {"templateCredsSetupCompleted": True},
        }
        path.write_text(json.dumps(workflow, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"wrote {path.name}: {len(self.nodes)} nodes")
