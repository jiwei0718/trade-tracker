"""Generate the n8n workflow that syncs the WTO RTA-IS agreement database into Supabase.

    python n8n/workflows/build_wto_rta_sync.py              # writes wto-rta-sync.json
    python n8n/workflows/build_wto_rta_sync.py --dry-run    # same, but the flow only compares

The Python worker (backend/worker, http://worker:8000) downloads and parses the WTO
export; this flow compares it with the database, runs the safety checks, and writes.
Manual trigger only: auto-update stays off until the user approves it.

Write policy
- Curated agreements are never touched.
- Scraped agreements follow the WTO list (status, dates, parties, names).
- Agreements the WTO no longer lists get the tag "wto-delisted" (hidden in the app),
  never deleted.
- Every change becomes an event (tier S); field_provenance records where it came from.
- Circuit breaker: if a run would change unusually many rows, nothing is written.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from n8n_build import PAD, RUN_PATHS, SB, STEP, Workflow, xs

DRY_RUN = "--dry-run" in sys.argv
OUT = Path(__file__).with_name("wto-rta-sync.json")
WORKER = "http://worker:8000"

wf = Workflow("TtWtoRtaSync0001", "WTO 區域貿易協定資料庫同步")
node, http, code, section = wf.node, wf.http, wf.code, wf.section

# ─── JavaScript snippets ──────────────────────────────────────────────────

JS_CONFIG = r"""
// 流程設定。要「只比對、不寫入」就把 dryRun 改成 true。
return [{ json: {
  dryRun: __DRY_RUN__,
  sourceId: 'wto-rta-is',
  // 安全檢查(熔斷):任何一項超過上限,這次就整批不寫入,資料狀態頁會亮黃燈。
  // [最少筆數, 比例]:上限 = 兩者取大。例如資料庫有 690 筆時,狀態變更上限是 max(20, 35) = 35 筆。
  guard: {
    minFetchRatio: 0.9,           // WTO 清單筆數至少要是資料庫現有筆數的 90%(防止下載不完整)
    maxStatusChanges: [20, 0.05], // 狀態變更
    maxDateFixes: [20, 0.05],     // 日期被更正或移除
    maxNew: [50, 0.1],            // 新協定
    maxDelisted: [50, 0.1],       // WTO 不再列出的協定
    maxPartyChanges: [20, 0.05],  // 締約方變更(大量變動多半是解析程式改了,不是真的有國家加入)
  },
} }];
"""

JS_DIFF = r"""
// 比對 WTO 最新清單和資料庫:算出要寫入的資料、要產生的事件,並做安全檢查
const cfg = $('設定').first().json;
const src = $('讀取來源設定').first().json;
const res = $('呼叫 Python 整理程式').first().json;
const db = $('讀取現有協定').all().map((i) => i.json).filter((r) => r && r.id);

const STATUS = { in_force: '已生效', signed: '已簽署', concluded: '談判完成', negotiating: '談判中', suspended: '已暫停',
                 cancelled: '已取消', proposed: '提議中', superseded: '已被取代', expired: '已失效' };
const DATE = { proposed: '提議', started: '啟動談判', concluded: '完成談判', signed: '簽署', in_force: '生效',
               suspended: '暫停', cancelled: '取消', expired: '失效', superseded: '被取代' };
const DELISTED = 'wto-delisted';
const NONE = 'eq.__none__';    // 沒有東西要刪時用的條件(不會符合任何一筆)

const finish = (status, error, extra = {}) => [{ json: {
  status, error, canWrite: false, blocked: [], fetched: 0,
  newRows: [], updateRows: [], partyResetFilter: NONE, partyRows: [], provenance: [], events: [],
  counts: {}, ...extra,
  report: { 模式: cfg.dryRun ? '試跑(只比對,不寫入)' : '正式執行', 結果: error ?? status, ...(extra.report ?? {}) },
} }];

if (!src.id || !src.enabled) return finish('skipped', null, { report: { 結果: '來源已停用,略過' } });
if (res.error || !Array.isArray(res.agreements)) {
  return finish('error', `Python 整理程式失敗:${String(res.error?.message ?? res.error ?? '沒有資料').slice(0, 300)}`);
}

const fetchedAt = res.fetched_at;
const urls = res.source_urls ?? {};
const byId = new Map(db.map((r) => [r.id, r]));
const partiesOf = {};
for (const p of res.parties) (partiesOf[p.agreement_id] ??= []).push(p);

const newRows = [], updateRows = [], partyResetIds = [], partyRows = [], provenance = [], events = [], delistedIds = [];
const counts = { 新協定: 0, 狀態變更: 0, 新增日期: 0, 更正日期: 0, 移除日期: 0, 締約方變更: 0, 名稱或類型更新: 0,
                 WTO不再列出: 0, 重新列出: 0, 人工整理略過: 0 };

// 每一筆都帶齊所有欄位:Supabase 一次寫入多筆時,欄位要一致
const ev = (id, type, summary, extra = {}) => events.push({
  agreement_id: id, event_type: type, event_date: null, field: null, old_value: null, new_value: null,
  summary_zh: summary, source_id: cfg.sourceId, source_url: urls[id] ?? src.url, confidence: 0.95, status: 'active',
  ...extra,
});
const prov = (id, field) => provenance.push({
  agreement_id: id, field, confidence: 0.95, source_tier: 'S', source_label: 'WTO RTA-IS',
  source_url: urls[id] ?? src.url, extracted_at: fetchedAt, status: 'active',
});
const st = (s) => STATUS[s] ?? s;
const dt = (k) => DATE[k] ?? k;

const fetchedIds = new Set();
for (const a of res.agreements) {
  fetchedIds.add(a.id);
  const old = byId.get(a.id);
  const name = a.name_zh || a.name;
  const dates = a.key_dates ?? {};

  if (!old) {
    counts.新協定++;
    newRows.push(a);
    partyRows.push(...(partiesOf[a.id] ?? []));
    ['status', 'key_dates', 'parties'].forEach((f) => prov(a.id, f));
    ev(a.id, 'new_agreement', `WTO 區域貿易協定資料庫新增「${name}」(${st(a.status)})。`,
       { event_date: dates.in_force ?? dates.signed ?? null, new_value: a.status });
    continue;
  }
  if (old.origin === 'curated') { counts.人工整理略過++; continue; }   // 人工整理過的協定,一律不覆蓋

  if (old.status !== a.status) {
    counts.狀態變更++;
    prov(a.id, 'status');
    ev(a.id, 'status_change', `「${name}」狀態由「${st(old.status)}」變為「${st(a.status)}」。`,
       { event_date: dates[a.status] ?? null, field: 'status', old_value: old.status, new_value: a.status });
  }

  const oldDates = old.key_dates ?? {};
  let datesChanged = false;
  for (const [k, v] of Object.entries(dates)) {
    if (!(k in oldDates)) {
      counts.新增日期++; datesChanged = true;
      ev(a.id, 'date_added', `「${name}」新增${dt(k)}日期:${v}。`, { event_date: v, field: `key_dates.${k}`, new_value: v });
    } else if (oldDates[k] !== v) {
      counts.更正日期++; datesChanged = true;
      ev(a.id, 'field_update', `「${name}」的${dt(k)}日期由 ${oldDates[k]} 更正為 ${v}。`,
         { event_date: v, field: `key_dates.${k}`, old_value: oldDates[k], new_value: v });
    }
  }
  for (const k of Object.keys(oldDates)) {
    if (k in dates) continue;
    counts.移除日期++; datesChanged = true;
    ev(a.id, 'field_update', `WTO 資料已不再列出「${name}」的${dt(k)}日期(原為 ${oldDates[k]}),已移除。`,
       { field: `key_dates.${k}`, old_value: oldDates[k] });
  }
  if (datesChanged) prov(a.id, 'key_dates');

  const codes = (partiesOf[a.id] ?? []).map((p) => p.party_code);
  if ([...(old.parties ?? [])].sort().join() !== [...codes].sort().join()) {
    counts.締約方變更++;
    partyResetIds.push(a.id);
    partyRows.push(...(partiesOf[a.id] ?? []));
    prov(a.id, 'parties');
    ev(a.id, 'field_update', `「${name}」締約方更新為:${(partiesOf[a.id] ?? []).map((p) => p.party_name_zh ?? p.party_code).join('、')}。`,
       { field: 'parties', old_value: old.parties ?? [], new_value: codes });
  }

  if (old.name !== a.name || old.name_zh !== a.name_zh || old.type !== a.type) counts.名稱或類型更新++;
  if ((old.tags ?? []).includes(DELISTED)) counts.重新列出++;
  const tags = [...new Set([...(old.tags ?? []).filter((t) => t !== DELISTED), ...(a.tags ?? [])])];
  updateRows.push({ id: a.id, name: a.name, name_zh: a.name_zh, type: a.type, status: a.status, era: a.era,
                    key_dates: dates, tags, data_as_of: fetchedAt });
}

// 資料庫有、WTO 清單已經沒有的(多半是 WTO 改名留下的舊名稱):加上標記並在網頁隱藏,不刪除
for (const r of db) {
  if (r.origin !== 'scraped' || fetchedIds.has(r.id) || (r.tags ?? []).includes(DELISTED)) continue;
  counts.WTO不再列出++;
  delistedIds.push(r.id);
  updateRows.push({ id: r.id, name: r.name, name_zh: r.name_zh, type: r.type, status: r.status, era: r.era,
                    key_dates: r.key_dates ?? {}, tags: [...(r.tags ?? []), DELISTED], data_as_of: r.data_as_of });
}

// 安全檢查(熔斷)
const g = cfg.guard;
const base = db.filter((r) => r.origin === 'scraped' && !(r.tags ?? []).includes(DELISTED)).length;
const cap = ([min, pct]) => Math.max(min, Math.ceil(base * pct));
const blocked = [];
if (res.agreements.length < base * g.minFetchRatio)
  blocked.push(`WTO 清單只有 ${res.agreements.length} 筆,不到資料庫 ${base} 筆的 ${g.minFetchRatio * 100}%`);
const over = (label, n, rule) => { if (n > cap(rule)) blocked.push(`${label} ${n} 筆,超過上限 ${cap(rule)} 筆`); };
over('狀態變更', counts.狀態變更, g.maxStatusChanges);
over('日期更正或移除', counts.更正日期 + counts.移除日期, g.maxDateFixes);
over('新協定', counts.新協定, g.maxNew);
over('WTO 不再列出', counts.WTO不再列出, g.maxDelisted);
over('締約方變更', counts.締約方變更, g.maxPartyChanges);

return [{ json: {
  status: 'ok', error: null, canWrite: blocked.length === 0, blocked, fetched: res.agreements.length,
  newRows, updateRows, partyRows, provenance, events,
  partyResetFilter: partyResetIds.length ? `in.(${partyResetIds.join(',')})` : NONE,
  counts,
  report: {
    模式: cfg.dryRun ? '試跑(只比對,不寫入)' : '正式執行',
    WTO清單筆數: res.agreements.length,
    資料庫現有筆數: base,
    ...counts,
    安全檢查: blocked.length ? `未通過:${blocked.join(';')}` : '通過',
    事件預覽: events.slice(0, 60).map((e) => e.summary_zh),
    WTO不再列出的協定: delistedIds,
    警告: res.warnings ?? {},
  },
} }];
"""

WRITES = ["寫入新協定", "更新現有協定", "清除變動的締約方", "寫入締約方", "寫入欄位出處", "寫入事件"]

JS_FINISH = r"""
// 整理這次執行的結果:成功、被安全檢查擋下、或某個寫入步驟失敗
const run = $('建立執行紀錄').first().json;
const d = $('比對差異').first().json;
const WRITES = __WRITES__;
const done = WRITES.filter((n) => $(n).isExecuted);
const err = done.length ? $input.first().json.error : null;      // 從某個寫入步驟的「失敗」出口進來
const failedAt = err ? done[done.length - 1] : null;
const wrote = d.status === 'ok' && d.canWrite && !failedAt;

let error = d.error;
if (d.status === 'ok' && !d.canWrite) error = `安全檢查未通過,這次沒有寫入:${d.blocked.join(';')}`;
if (failedAt) error = `「${failedAt}」失敗,後面的步驟沒有執行:${String(err.message ?? JSON.stringify(err)).slice(0, 300)}`;

return [{ json: {
  sourceRun: {
    run_id: run.id, source_id: 'wto-rta-is', items_fetched: d.fetched, items_new: wrote ? d.newRows.length : 0, error,
    status: d.status === 'skipped' ? 'skipped' : wrote ? 'ok' : 'error',
  },
  runPatch: {
    status: d.status === 'skipped' || wrote ? 'success' : 'failed', finished_at: new Date().toISOString(),
    events_count: wrote ? d.events.length : 0, error,
  },
  report: { ...d.report, 結果: wrote ? `已寫入:${d.events.length} 則事件、更新 ${d.updateRows.length} 筆協定` : (error ?? '未寫入') },
} }];
""".replace("__WRITES__", json.dumps(WRITES, ensure_ascii=False))

# ─── Layout ───────────────────────────────────────────────────────────────
# Main row: settings → fetch & compare → safety check → finish.
# The dry-run report and the database writes sit on the row above, so the
# "nothing to write" paths run underneath them.

MAIN_Y = 700
UP_Y = 420

S1 = xs(0, 3)
S2 = xs(S1[-1] + STEP + 160, 4)
SD = xs(S2[-1] + STEP + 80, 2)          # frame width for the single dry-run node
S3 = xs(SD[-1] + STEP + 80, 2)
S4 = xs(S3[-1] + STEP + 80, 6)
S5 = xs(S4[-1] + STEP + 160, 4)
# No alwaysOutputData here: with an error output it would also emit an empty success item,
# and the next write would run after a failure. An empty 2xx body already yields one item.
WRITE_OPTS = dict(executeOnce=True, onError="continueErrorOutput")
UPSERT = [{"name": "Prefer", "value": "resolution=merge-duplicates,return=minimal"}]
DIFF = "$('比對差異').first().json"

# ─── Nodes ────────────────────────────────────────────────────────────────

trigger = node("手動執行", "n8n-nodes-base.manualTrigger", 1, [S1[0], MAIN_Y], {}, note="在 n8n 畫面按執行")
hook = wf.webhook("網頁或排程觸發", [S1[0], MAIN_Y + 200], RUN_PATHS["database"], note="網頁按鈕或排程呼叫")
srcs = http("讀取來源設定", [S1[1], MAIN_Y], "GET", f"{SB}/sources",
            query=[{"name": "id", "value": "eq.wto-rta-is"}, {"name": "select", "value": "id,enabled,tier,url"}],
            executeOnce=True, alwaysOutputData=True, note="來源是否停用")
config = code("設定", [S1[2], MAIN_Y], JS_CONFIG.replace("__DRY_RUN__", "true" if DRY_RUN else "false"),
              note="試跑開關、安全上限")

fetch = http("呼叫 Python 整理程式", [S2[0], MAIN_Y], "POST", f"{WORKER}/sources/wto-rta-is/fetch", cred=None,
             timeout=300000, executeOnce=True, retryOnFail=True, maxTries=2, waitBetweenTries=5000,
             onError="continueRegularOutput", note="下載並整理 WTO 清單")
existing = http("讀取現有協定", [S2[1], MAIN_Y], "GET", f"{SB}/agreements_full",
                query=[{"name": "select", "value": "id,origin,status,key_dates,name,name_zh,type,era,tags,data_as_of,parties"},
                       {"name": "id", "value": "like.wto-rta-*"},
                       {"name": "order", "value": "id"},
                       {"name": "limit", "value": "1000"}],
                pagination={"paginationMode": "updateAParameterInEachRequest",
                            "parameters": {"parameters": [{"type": "qs", "name": "offset",
                                                           "value": "={{ $pageCount * 1000 }}"}]},
                            "paginationCompleteWhen": "other",
                            "completeExpression": "={{ $response.body.length < 1000 }}",
                            "limitPagesFetched": True, "maxRequests": 20},
                executeOnce=True, alwaysOutputData=True, note="每次 1000 筆,讀到完")
diff = code("比對差異", [S2[2], MAIN_Y], JS_DIFF, note="算出變動,做安全檢查")
is_dry = wf.if_true("只是試跑?", [S2[3], MAIN_Y], "={{ $('設定').first().json.dryRun }}",
                    note="上:試跑 → 只看報告;下:正式寫入")

dry_report = code("試跑報告", [SD[0] + STEP // 2, UP_Y], f"return [{{ json: {DIFF}.report }}];",
                  note="點我看會改哪些資料")

run = http("建立執行紀錄", [S3[0], MAIN_Y], "POST", f"{SB}/pipeline_runs",
           headers=[{"name": "Prefer", "value": "return=representation"}],
           body='={{ JSON.stringify({ pipeline: "database", trigger: ($("網頁或排程觸發").isExecuted && $("網頁或排程觸發").first().json.body?.trigger === "scheduled" ? "scheduled" : "manual"), runner: "n8n", status: "running" }) }}',
           executeOnce=True, note="資料庫記一筆「執行中」")
gate = wf.if_true("通過安全檢查?", [S3[1], MAIN_Y], f"={{{{ {DIFF}.canWrite }}}}",
                  note="上:通過 → 寫入;下:擋下 → 收尾")

w_new = http(WRITES[0], [S4[0], UP_Y], "POST", f"{SB}/agreements",
             query=[{"name": "on_conflict", "value": "id"}], headers=UPSERT,
             body=f"={{{{ JSON.stringify({DIFF}.newRows) }}}}", note="WTO 新列出的協定", **WRITE_OPTS)
w_upd = http(WRITES[1], [S4[1], UP_Y], "POST", f"{SB}/agreements",
             query=[{"name": "on_conflict", "value": "id"}], headers=UPSERT,
             body=f"={{{{ JSON.stringify({DIFF}.updateRows) }}}}", note="狀態、日期、查核時間", **WRITE_OPTS)
w_pdel = http(WRITES[2], [S4[2], UP_Y], "DELETE", f"{SB}/agreement_parties",
              query=[{"name": "agreement_id", "value": f"={{{{ {DIFF}.partyResetFilter }}}}"}],
              headers=[{"name": "Prefer", "value": "return=minimal"}], note="只清締約方有變的協定", **WRITE_OPTS)
w_par = http(WRITES[3], [S4[3], UP_Y], "POST", f"{SB}/agreement_parties",
             query=[{"name": "on_conflict", "value": "agreement_id,party_code"}], headers=UPSERT,
             body=f"={{{{ JSON.stringify({DIFF}.partyRows) }}}}", note="新協定與變動的締約方", **WRITE_OPTS)
w_prov = http(WRITES[4], [S4[4], UP_Y], "POST", f"{SB}/field_provenance",
              query=[{"name": "on_conflict", "value": "agreement_id,field"}], headers=UPSERT,
              body=f"={{{{ JSON.stringify({DIFF}.provenance) }}}}", note="記下資料出處", **WRITE_OPTS)
w_ev = http(WRITES[5], [S4[5], UP_Y], "POST", f"{SB}/events",
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body=("={{ JSON.stringify(" + DIFF + ".events.map((e) => ({ ...e, run_id: "
                  "$('建立執行紀錄').first().json.id }))) }}"),
            note="動態頁會顯示", **WRITE_OPTS)

finish = code("收尾整理", [S5[0], MAIN_Y], JS_FINISH, note="判斷成功或失敗")
sruns = http("寫入來源結果", [S5[1], MAIN_Y], "POST", f"{SB}/source_runs",
             headers=[{"name": "Prefer", "value": "return=minimal"}],
             body="={{ JSON.stringify($('收尾整理').first().json.sourceRun) }}", executeOnce=True,
             alwaysOutputData=True, note="健康燈號的依據")
done = http("完成執行紀錄", [S5[2], MAIN_Y], "PATCH", f"{SB}/pipeline_runs",
            query=[{"name": "id", "value": "=eq.{{ $('建立執行紀錄').first().json.id }}"}],
            headers=[{"name": "Prefer", "value": "return=minimal"}],
            body="={{ JSON.stringify($('收尾整理').first().json.runPatch) }}", executeOnce=True,
            alwaysOutputData=True, note="標記成功或失敗")
report = code("執行摘要", [S5[3], MAIN_Y], "return [{ json: $('收尾整理').first().json.report }];",
              note="點我看中文報告")

# ─── Sticky notes ─────────────────────────────────────────────────────────

section("① 讀取設定", S1, MAIN_Y, 4, """## ① 讀取設定
- **手動執行**:在 n8n 畫面按下方「Execute workflow」就從這裡開始。
- **網頁或排程觸發**:網頁「資料狀態」頁的「立即更新」按鈕,或自動更新排程(預設關閉)從這裡啟動。要帶金鑰才能呼叫,而且只接受這台電腦上的網頁。
- **讀取來源設定**:確認「WTO RTA-IS」來源沒有被停用(停用就整條略過)。
- **設定**:
  - dryRun(試跑):改成 true 時只比對、不寫入
  - 安全上限:一次變動太多筆就不寫入""", below=200)

section("② 抓取與比對", S2, MAIN_Y, 6, """## ② 抓取 WTO 清單並和資料庫比對
- **呼叫 Python 整理程式**:請 Docker 裡的 Python 程式(worker)下載 WTO 區域貿易協定資料庫(RTA-IS)的完整清單,整理成資料庫格式。約 660 筆,要幾秒鐘。
- **讀取現有協定**:從資料庫讀出目前所有 WTO 協定。Supabase 每次最多回傳 1000 筆,所以設定成自動翻頁讀到完。
- **比對差異**:一筆筆比對,找出:新協定、狀態變更、日期新增/更正/移除、締約方變更、WTO 已不再列出的協定。人工整理過的協定一律略過。每項變動都會產生一則「事件」。最後做安全檢查。
- **只是試跑?**:試跑 → 往上只產生報告;正式執行 → 往右下。""")

section("試跑", SD, UP_Y, 5, """## 試跑模式
- **試跑報告**:列出「如果正式執行,會改哪些資料」,包括每一則事件的內容。

資料庫完全不會被改動,也不會留下執行紀錄。""")

section("③ 安全檢查", S3, MAIN_Y, 3, """## ③ 安全檢查(熔斷)
- **建立執行紀錄**:在資料庫新增一筆「執行中」。
- **通過安全檢查?**:任何一項變動超過上限(例如狀態變更超過 35 筆),代表 WTO 網站格式可能改了、或下載不完整,這次就整批不寫入,直接到 ⑤ 收尾並記為「失敗」,資料狀態頁亮黃燈。""")

section("④ 寫入資料庫", S4, UP_Y, 7, """## ④ 寫入資料庫
只有通過安全檢查時才會執行。每一步失敗都會從節點下方的「失敗」出口跳到 ⑤,後面的步驟不會執行。
- **寫入新協定**:WTO 新列出的協定。
- **更新現有協定**:更新狀態、日期、名稱和「資料查核時間」。WTO 已不再列出的協定加上 wto-delisted 標記(網頁會隱藏,資料不刪除)。
- **清除變動的締約方** → **寫入締約方**:只重寫締約方有變動的協定。
- **寫入欄位出處**:記下每個變動欄位的來源(WTO RTA-IS,S 級)與時間。
- **寫入事件**:每項變動一則事件,會出現在網頁「動態」頁;事件附有 WTO 該協定頁面的連結。""")

section("⑤ 收尾與紀錄", S5, MAIN_Y, 4, """## ⑤ 收尾與紀錄
- **收尾整理**:判斷這次是成功、被安全檢查擋下、還是某個寫入步驟失敗。
- **寫入來源結果**:資料狀態頁健康燈號的依據。
- **完成執行紀錄**:標記成功或失敗,失敗時記下原因。
- **執行摘要**:點開就能看到這次的中文報告。""")

top = min(s[2] for s in wf.sections)
wf.sticky("說明", [S1[0] - PAD, top - 500], 1240, 460, 1, """## WTO 區域貿易協定資料庫同步
**怎麼執行**:按畫面下方「Execute workflow」,或在網頁「資料狀態」頁按「立即更新」。自動更新預設關閉,要在網頁上打開開關才會依排程執行。

**流程**:① 讀取設定 → ② 抓 WTO 清單並比對 → ③ 安全檢查 → ④ 寫入資料庫 → ⑤ 收尾與紀錄

**原則**
- 人工整理過的協定絕對不覆蓋;WTO 已不再列出的協定只加標記、不刪除
- 每項變動都留下事件和出處,可以追查
- 一次變動太多筆時自動停止,不寫入

**怎麼看結果**:點「執行摘要」看中文報告;網頁 http://localhost:8082 的「動態」和「資料狀態」頁會顯示新結果。

**注意**:這個流程由程式檔 n8n/workflows/build_wto_rta_sync.py 產生。如果在畫面上修改,請告訴我,我會同步回程式檔。""")

# ─── Connections ──────────────────────────────────────────────────────────

wf.chain(trigger, srcs, config, fetch, existing, diff, is_dry)
wf.link(hook, srcs)
wf.link(is_dry, dry_report, 0)
wf.link(is_dry, run, 1)
wf.link(run, gate)
wf.link(gate, w_new, 0)
wf.link(gate, finish, 1)
wf.chain(w_new, w_upd, w_pdel, w_par, w_prov, w_ev, finish)
for w in WRITES:
    wf.link(w, finish, 1)       # error output → finish
wf.chain(finish, sruns, done, report)

wf.save(OUT)
