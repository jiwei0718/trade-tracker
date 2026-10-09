"""Generate the control workflows used by the web app on this computer.

    python n8n/workflows/build_control.py   # writes control-settings.json, scheduler.json, review.json

- 自動更新設定 (webhook): the 資料狀態 page's on/off switch writes update_settings.auto_enabled.
- 自動更新排程器 (hourly): starts a pipeline only when its switch is on and its hour has
  come. Both switches start off, so the scheduler does nothing until the user turns one on.
- 待確認事件審核 (webhooks): the 待確認 page lists pending events and approves/rejects them.
"""
from __future__ import annotations

import json
from pathlib import Path

from n8n_build import PAD, REVIEW_PATHS, RUN_PATHS, SB, SETTINGS_PATH, STEP, WEBHOOK_CRED, Workflow, xs

HERE = Path(__file__).parent
MAIN_Y = 700

# ─── 自動更新設定 ─────────────────────────────────────────────────────────

JS_CHECK = r"""
// 只接受兩種流程與 true/false,其他內容一律拒絕
const body = $input.first().json.body ?? {};
const pipeline = body.pipeline;
const enabled = body.auto_enabled;
if (!['database', 'news'].includes(pipeline) || typeof enabled !== 'boolean') {
  throw new Error('pipeline 必須是 database 或 news,auto_enabled 必須是 true 或 false');
}
return [{ json: { pipeline, patch: { auto_enabled: enabled, updated_by: 'web' } } }];
"""

settings = Workflow("TtSettingsFlow01", "自動更新設定(網頁開關)")
S = xs(0, 4)
hook = settings.webhook("網頁開關", [S[0], MAIN_Y], SETTINGS_PATH, note="資料狀態頁的開關", respond="lastNode")
check = settings.code("檢查內容", [S[1], MAIN_Y], JS_CHECK, note="只接受合法的值")
save = settings.http("寫入設定", [S[2], MAIN_Y], "PATCH", f"{SB}/update_settings",
                     query=[{"name": "pipeline", "value": "=eq.{{ $json.pipeline }}"}],
                     headers=[{"name": "Prefer", "value": "return=representation"}],
                     body="={{ JSON.stringify($json.patch) }}", note="更新 update_settings")
reply = settings.code("回覆網頁", [S[3], MAIN_Y],
                      "const s = $input.first().json;\nreturn [{ json: { ok: true, pipeline: s.pipeline, auto_enabled: s.auto_enabled } }];",
                      note="告訴網頁結果")
settings.chain(hook, check, save, reply)
settings.section("設定", S, MAIN_Y, 4, """## 自動更新開關(網頁呼叫)
- **網頁開關**:網頁「資料狀態」頁切換「自動更新」時呼叫這裡。要帶金鑰,而且只接受這台電腦上的網頁。
- **檢查內容**:只接受「協定資料庫/新聞動態」與「開/關」,其他內容一律拒絕。
- **寫入設定**:更新資料庫的 update_settings。
- **回覆網頁**:把新的開關狀態回傳給網頁。

這條流程只改開關,不會抓任何資料;真正依排程執行的是「自動更新排程器」。""")
settings.sticky("說明", [S[0] - PAD, min(s[2] for s in settings.sections) - 300], 1000, 260, 1, """## 自動更新設定(網頁開關)
網頁「資料狀態」頁的「自動更新」開關會呼叫這條流程。兩個開關預設都是關閉。

**注意**:這個流程由程式檔 n8n/workflows/build_control.py 產生。如果在畫面上修改,請告訴我,我會同步回程式檔。""")
settings.save(HERE / "control-settings.json")

# ─── 自動更新排程器 ───────────────────────────────────────────────────────

JS_DUE = r"""
// 每小時整點檢查:開關打開、而且現在是設定的時間(臺北時間),才觸發該流程。開關都關閉時什麼都不做。
const FLOWS = __FLOWS__;
const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));
const due = [];
for (const s of $input.all().map((i) => i.json)) {
  if (!s.auto_enabled || !FLOWS[s.pipeline]) continue;
  const m = String(s.schedule_cron ?? '').match(/^(\d+) (\d+) \* \* \*$/);   // 每天固定時間,例如 "0 21 * * *"
  if (m && Number(m[2]) === hour) for (const path of FLOWS[s.pipeline]) due.push({ json: { pipeline: s.pipeline, path } });
}
return due;
""".replace("__FLOWS__", json.dumps(RUN_PATHS))

sched = Workflow("TtSchedulerFlw01", "自動更新排程器")
T = xs(0, 4)
tick = sched.node("每小時整點", "n8n-nodes-base.scheduleTrigger", 1.2, [T[0], MAIN_Y],
                  {"rule": {"interval": [{"field": "cronExpression", "expression": "0 * * * *"}]}},
                  note="只是檢查,不抓資料")
read = sched.http("讀取開關", [T[1], MAIN_Y], "GET", f"{SB}/update_settings",
                  query=[{"name": "select", "value": "pipeline,auto_enabled,schedule_cron"}], note="兩個開關與時間")
due = sched.code("到時間了嗎?", [T[2], MAIN_Y], JS_DUE, note="開關關閉 → 到此為止")
start = sched.http("啟動流程", [T[3], MAIN_Y], "POST", "=http://localhost:5678/webhook/{{ $json.path }}",
                   cred=WEBHOOK_CRED, body='={{ JSON.stringify({ trigger: "scheduled" }) }}', note="和網頁按鈕一樣的入口")
sched.chain(tick, read, due, start)
sched.section("排程", T, MAIN_Y, 7, """## 自動更新排程器
- **每小時整點**:每小時檢查一次。只是讀開關,不會抓任何資料。
- **讀取開關**:讀資料庫的 update_settings:「協定資料庫」與「新聞動態」兩個開關,以及各自的執行時間(預設臺北時間每天 21:00)。
- **到時間了嗎?**:開關打開、而且現在是設定的時間,才往下走;開關關閉時流程到這裡就結束。
- **啟動流程**:呼叫該管線每條流程的入口(和網頁「立即更新」按鈕相同;新聞動態包含 JSI 追蹤與全球協定新聞兩條),執行紀錄會記為「排程」。""")
sched.sticky("說明", [T[0] - PAD, min(s[2] for s in sched.sections) - 300], 1000, 260, 1, """## 自動更新排程器
**自動更新預設關閉**。只有在網頁「資料狀態」頁把開關打開後,才會在設定的時間自動執行對應流程。

**注意**:這個流程由程式檔 n8n/workflows/build_control.py 產生。如果在畫面上修改,請告訴我,我會同步回程式檔。""")
# The hourly checks are not worth keeping; real runs are recorded by the pipelines themselves.
sched.save(HERE / "scheduler.json", saveDataSuccessExecution="none")

# ─── 待確認事件審核 ───────────────────────────────────────────────────────

JS_LIST = r"""
// 只回傳網頁需要的欄位
const events = $input.all().map((i) => i.json).filter((e) => e && e.id);
return [{ json: { events } }];
"""

JS_DECIDE = r"""
// 只接受事件 id 清單與「採用/不採用」;只改仍在待確認的事件
const body = $input.first().json.body ?? {};
const ids = Array.isArray(body.ids) ? body.ids.map(Number).filter((n) => Number.isInteger(n) && n > 0) : [];
if (!ids.length || ids.length > 100 || !['approve', 'reject'].includes(body.decision)) {
  throw new Error('ids 必須是 1–100 個事件 id,decision 必須是 approve 或 reject');
}
return [{ json: { filter: `in.(${ids.join(',')})`, patch: { status: body.decision === 'approve' ? 'active' : 'retracted' } } }];
"""

review = Workflow("TtReviewFlow0001", "待確認事件審核(網頁)")
R = xs(0, 3)
LIST_Y, DECIDE_Y = MAIN_Y, MAIN_Y + 420
list_hook = review.webhook("讀取待確認", [R[0], LIST_Y], REVIEW_PATHS["list"], note="待確認頁開啟時", respond="lastNode")
list_get = review.http("查詢待確認事件", [R[1], LIST_Y], "GET", f"{SB}/events",
                       query=[{"name": "select", "value": "id,agreement_id,event_type,event_date,summary_zh,source_id,source_url,story_key,new_value,detected_at"},
                              {"name": "status", "value": "eq.pending"},
                              {"name": "detected_at", "value": "=gte.{{ new Date(Date.now() - 120 * 86400000).toISOString() }}"},
                              {"name": "order", "value": "detected_at.desc"}, {"name": "limit", "value": "300"}],
                       alwaysOutputData=True, note="近 120 天")
list_out = review.code("整理清單", [R[2], LIST_Y], JS_LIST, note="回傳給網頁")
review.chain(list_hook, list_get, list_out)

dec_hook = review.webhook("審核決定", [R[0], DECIDE_Y], REVIEW_PATHS["decide"], note="按採用/不採用時", respond="lastNode")
dec_check = review.code("檢查內容", [R[1], DECIDE_Y], JS_DECIDE, note="只接受合法的值")
dec_save = review.http("更新事件狀態", [R[2], DECIDE_Y], "PATCH", f"{SB}/events",
                       query=[{"name": "id", "value": "={{ $json.filter }}"}, {"name": "status", "value": "eq.pending"}],
                       headers=[{"name": "Prefer", "value": "return=representation"}],
                       body="={{ JSON.stringify($json.patch) }}", alwaysOutputData=True, note="待確認 → 顯示或撤回")
dec_out = review.code("回覆網頁", [R[2] + STEP, DECIDE_Y],
                      "const rows = $input.all().map((i) => i.json).filter((r) => r && r.id);\n"
                      "return [{ json: { ok: true, updated: rows.length } }];",
                      note="告訴網頁結果")
review.chain(dec_hook, dec_check, dec_save, dec_out)

review.section("讀取", R, LIST_Y, 5, """## 讀取待確認事件
- **讀取待確認**:網頁「待確認」頁開啟時呼叫這裡。要帶金鑰,只接受這台電腦上的網頁。
- **查詢待確認事件**:讀出近 120 天、狀態為「待確認」的事件(一般媒體的報導、非官方來源宣稱的狀態改變、資料庫還沒有的新協定)。
- **整理清單**:回傳給網頁,網頁會把同一件事的報導放在一起。""")
review.section("決定", R + [R[2] + STEP], DECIDE_Y, 6, """## 採用或不採用
- **審核決定**:在網頁按「採用」或「不採用」時呼叫這裡。
- **檢查內容**:只接受事件 id 與「採用/不採用」。
- **更新事件狀態**:採用 → 改為「顯示」,出現在網頁「動態」頁;不採用 → 改為「撤回」,不會再出現。只會改仍在待確認的事件。
- **回覆網頁**:回傳更新了幾筆。""")
review.sticky("說明", [R[0] - PAD, min(x[2] for x in review.sections) - 300], 1100, 260, 1, """## 待確認事件審核(網頁)
網頁「資料狀態」→「待確認事件」頁會呼叫這條流程。所有決定都由你在網頁上按下,流程本身不會自動採用任何事件。

**注意**:這個流程由程式檔 n8n/workflows/build_control.py 產生。如果在畫面上修改,請告訴我,我會同步回程式檔。""")
review.save(HERE / "review.json")
