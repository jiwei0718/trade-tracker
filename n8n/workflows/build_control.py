"""Generate the two control workflows used by the web app's 資料狀態 page.

    python n8n/workflows/build_control.py   # writes control-settings.json and scheduler.json

- 自動更新設定 (webhook): the page's on/off switch writes update_settings.auto_enabled.
- 自動更新排程器 (hourly): starts a pipeline only when its switch is on and its hour has
  come. Both switches start off, so the scheduler does nothing until the user turns one on.
"""
from __future__ import annotations

import json
from pathlib import Path

from n8n_build import PAD, RUN_PATHS, SB, SETTINGS_PATH, STEP, WEBHOOK_CRED, Workflow, xs

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
  if (m && Number(m[2]) === hour) due.push({ json: { pipeline: s.pipeline, path: FLOWS[s.pipeline] } });
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
- **啟動流程**:呼叫該流程的入口(和網頁「立即更新」按鈕相同),執行紀錄會記為「排程」。""")
sched.sticky("說明", [T[0] - PAD, min(s[2] for s in sched.sections) - 300], 1000, 260, 1, """## 自動更新排程器
**自動更新預設關閉**。只有在網頁「資料狀態」頁把開關打開後,才會在設定的時間自動執行對應流程。

**注意**:這個流程由程式檔 n8n/workflows/build_control.py 產生。如果在畫面上修改,請告訴我,我會同步回程式檔。""")
# The hourly checks are not worth keeping; real runs are recorded by the pipelines themselves.
sched.save(HERE / "scheduler.json", saveDataSuccessExecution="none")
