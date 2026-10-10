# 全球貿易協定追蹤工具

追蹤全球雙邊、多邊與特殊性質貿易協定(含 WTO 聯合聲明倡議、聯合聲明、備忘錄)的狀態與最新動態。

> 目的:想驗證某條貿易協定相關說法時,不必一個一個國家查。

## 架構(2026-10 起)

```
┌──────────── 這台電腦(Docker,只開放 localhost)────────────┐
│  web  http://localhost:8080  桌面 App(打包好的網頁)           │
│  n8n  http://localhost:5678                                   │
│   ├─ WTO 區域貿易協定資料庫同步 ──呼叫──▶ worker(Python)       │
│   ├─ WTO 電子商務 JSI 追蹤      ──呼叫──▶ Gemini               │
│   ├─ 全球協定新聞追蹤           ──呼叫──▶ Gemini               │
│   └─ 自動更新開關、排程器、待確認事件審核                      │
└───────────────┬───────────────────────────────────────────────┘
                │ 寫入(secret key,只有 n8n 和匯入腳本持有)
                ▼
         Supabase(Postgres,東京)
                │ 讀取(publishable key,唯讀)
                ▼
   網頁版 http://localhost:8082(Expo;之後打包成 Android App)
```

兩條資料管線:

- **協定資料庫**:結構化的官方資料(目前是 WTO RTA-IS)。比對資料庫後寫入協定的狀態、日期、締約方,每項變動都產生一則事件。
- **新聞動態**:兩條流程。「WTO 電子商務 JSI 追蹤」讀官方文件、WTO 新聞與 Google 新聞;「全球協定新聞追蹤」用英文與中文 Google 新聞搜尋所有協定的進展(簽署、生效、完成或啟動談判),先依新聞提到的國家與組織找出候選協定,再由 AI 判斷是哪一個,或標記為資料庫還沒有的新協定。AI 只負責分類與摘要,產生的是事件,不會改協定本身的狀態。

**更新控制**:在 n8n 或桌面 App 手動執行。自動更新開關(`update_settings.auto_enabled`)預設關閉,只有使用者在網頁上打開才會依排程執行。

## 目錄

```
協定追蹤工具/
├── infra/docker-compose.yml   ← n8n + worker + web(只綁 127.0.0.1)
├── desktop/                   ← 桌面捷徑、啟動腳本、圖示
├── n8n/workflows/             ← n8n 流程:build_*.py 產生 JSON,再匯入 n8n
│   ├── n8n_build.py           ← 共用工具(節點、便利貼、版面)
│   ├── build_wto_rta_sync.py  → wto-rta-sync.json  協定資料庫同步
│   ├── build_jsi_ecom.py      → jsi-ecom.json      電子商務 JSI 追蹤
│   ├── build_global_news.py   → global-news.json   全球協定新聞追蹤
│   └── build_control.py       → control-settings.json、scheduler.json、review.json  開關、排程器、審核
├── backend/
│   ├── worker/app.py          ← n8n 呼叫的 Python 服務(只抓取、整理,不寫資料庫)
│   ├── scrapers/              ← 各來源爬蟲(wto_rta.py 等)
│   ├── import_to_supabase.py  ← 匯入人工整理的協定(每項修正都會產生事件)
│   ├── audit_agreements.py    ← 檢查狀態與日期是否矛盾
│   ├── refresh_wto_derived.py ← 改了名稱解析後,重寫中文名稱與締約方(不產生事件)
│   └── run.py                 ← (舊)GitHub Actions pipeline
├── supabase/migrations/       ← 資料表、權限、來源設定
├── trade-tracker-mobile/      ← (主)Expo App,目前先做網頁版
├── scripts/export-curated.ts  ← 匯出 App 內人工整理的協定,給匯入腳本用
└── data/                      ← (舊)GitHub Actions 產出的 JSON
```

## 本機啟動

**桌面 App**:雙擊桌面的「協定追蹤」圖示。它會確認 Docker 有在執行(沒有就自動啟動並等待),再用 Edge 的 App 模式開啟 http://localhost:8080。只在這台電腦執行,區網其他裝置連不進來。

- 第一次建立捷徑:執行 `desktop/install-shortcut.ps1`
- 改了網頁程式後更新桌面 App:執行 `desktop/update-app.ps1`。網頁打包到 `%LOCALAPPDATA%\trade-tracker\web`(不放 OneDrive:同步中的檔案會被鎖住,Docker 讀不到),web 容器直接讀這個資料夾
- 圖示由 `desktop/make_icons.py` 產生

```bash
docker compose -f infra/docker-compose.yml up -d
```

開發時的即時預覽(改程式會自動重新載入):

```bash
npm run start --prefix trade-tracker-mobile -- --port 8082
```

改了 `backend/` 的程式後要重建 worker:

```bash
docker compose -f infra/docker-compose.yml up -d --build worker
```

改了 `n8n/workflows/build_*.py` 後,重新產生 JSON 並匯入 n8n(以協定資料庫同步為例):

```bash
python n8n/workflows/build_wto_rta_sync.py
```

```bash
docker cp n8n/workflows/wto-rta-sync.json trade-tracker-n8n-1:/tmp/w.json
```

```bash
docker exec trade-tracker-n8n-1 n8n import:workflow --input=/tmp/w.json
```

匯入後要重新發布(網頁按鈕和排程靠 webhook 呼叫,流程沒發布就不會回應),再重啟 n8n:

```bash
docker exec trade-tracker-n8n-1 n8n publish:workflow --id=TtWtoRtaSync0001
```

```bash
docker restart trade-tracker-n8n-1
```

流程 id:`TtWtoRtaSync0001`(協定資料庫同步)、`TtJsiEcomFlow001`(電子商務 JSI)、`TtGlobalNews0001`(全球協定新聞)、`TtSettingsFlow01`(自動更新開關)、`TtSchedulerFlw01`(自動更新排程器)、`TtReviewFlow0001`(待確認事件審核)。

流程畫面上的每個區段和節點都有中文便利貼說明。要只看差異、不寫入,把流程裡「設定」節點的 `dryRun` 改成 `true`。

## 立即更新與自動更新

桌面 App 的「資料狀態」頁,每條管線都有:

- **立即更新**:馬上執行一次,完成後顯示新事件數。新聞動態會同時執行 JSI 追蹤與全球協定新聞兩條流程。
- **自動更新開關**:預設關閉。打開前會先確認;打開後,排程器在設定的時間(預設臺北時間每天 21:00)執行。排程器每小時只讀一次開關,開關關閉時不會抓任何資料。

**待確認事件**:「資料狀態」頁的「待確認事件」列出還沒顯示的事件:一般媒體的報導、非官方來源宣稱的狀態改變、資料庫還沒有的新協定。同一件事的報導放在一起,按「採用」就出現在「動態」頁,按「不採用」就撤回。新協定採用後,要再人工加進協定資料(`trade-tracker-mobile/src/data/agreements.ts`)。

這些控制透過本機 n8n 的 webhook,要帶金鑰(`trade-tracker-mobile/.env` 的 `EXPO_PUBLIC_N8N_RUN_KEY`,與 n8n 憑證 `Webhook key (trade-tracker)` 相同),而且只接受 localhost 的網頁。

## 專有名詞資料庫

App 的「名詞資料庫」(名詞頁 `/glossary`、說明頁 `/term/<id>`):

- **常用名詞**(`trade-tracker-mobile/src/data/terms.ts`):約 50 個,每個都有中文名稱、原文、解釋與 APA 格式的來源。來源優先序為官方與國際組織 → 研究或學術機構 → 企業 → 其他,不使用簡體中文或中國大陸的來源。找不到來源而由 AI 翻譯或撰寫的部分會標示並說明方法。
- **WTO 小辭典**(`trade-tracker-mobile/src/data/wto-glossary.json`):經濟部國際貿易署的官方資料(539 個詞條),由 `backend/build_wto_glossary.py` 從政府資料開放平臺的 CSV 產生。
- **自動連結**:協定、動態、組織、時期等頁面的文字中,常用名詞、國際組織與協定簡稱會變成可點的連結。同一頁第一次出現時寫成「中文 (原文)」,之後只寫中文(`<TermText>`、`<TermScope>`)。

## 3D 地球儀

側邊欄「地球儀」分頁用可拖拉、縮放的 3D 地球畫出協定:

- **弧線**:兩方協定畫在兩國之間,同一對國家的協定合併成一條,越粗代表越多;顏色依狀態(綠:已生效、藍:已簽署、橘:談判中、灰:已失效)。三方以上的協定從各締約方連到協定中心點。
- **集團**(紫色標籤):畫在總部或成員國中心;點選後成員國標黃,並以虛線連到成員國。點國家則直接連到它的每個協定夥伴,包含透過所屬集團簽署的協定。
- **時間軸**:播放 1947 年到今天,依生效年(可切換為簽署年)顯示每一年有效的協定。
- **其他**:依協定數為國家上色、最近 30 天有動態的地方顯示光圈、臺灣視角、依協定類型篩選。全球性的多邊協定沒有單一位置,列在「沒有畫在地球上的協定」。

全部使用免費資源:globe.gl、three.js(MIT 授權);國界與國家標示點來自 Natural Earth(公有領域,經 `world-atlas` 套件)。國家標示點由 `trade-tracker-mobile/scripts/build-geo-points.mjs` 產生到 `src/data/geo-points.json`,集團位置在 `src/data/geo.ts`;`backend/fill_country_points.py` 把國家座標寫進資料庫的 `countries.lat/lng`。地球在 Expo DOM 元件裡執行,之後 Android 版可直接沿用。規劃與後續項目見 `docs/globe-plan.md`。

## 資料原則

- 人工整理過的協定(`origin = curated`)流程一律不覆蓋。
- 每項變動都記成事件(`events`),並記下欄位出處(`field_provenance`)與來源等級:S 官方、A 學術智庫、B 一線媒體、C 一般。
- 非官方來源宣稱「已簽署/已生效」一律列為待確認,不直接顯示。
- 不使用中國大陸的來源:新聞流程丟棄 .cn 網域與中國官方媒體的報導,人工整理的協定也不引用(改用 WTO 等國際組織或我國政府資料)。
- 修正自己的錯誤資料時,用 `python backend/import_to_supabase.py --correction <協定代碼>`,動態頁記一筆「資料更正」,不會被當成新進展。
- `python backend/audit_agreements.py` 檢查狀態與日期是否矛盾、AI 撰寫的進展說明有沒有寫錯日期,並把人工整理的協定和 WTO 資料庫中同一組締約方的紀錄比對。
- `python backend/check_source_links.py`(先執行 `npx tsx scripts/export-curated.ts`)列出已失效的來源連結;`npx tsx scripts/check-terms.ts` 檢查名詞資料庫每個詞條都有中文名稱、原文、解釋與來源。
- 協定資料庫同步有熔斷:一次變動太多筆(例如狀態變更超過 35 筆)就整批不寫入,資料狀態頁亮黃燈。
- WTO 不再列出的協定(多半是改名前的舊名稱)只加 `wto-delisted` 標記,網頁隱藏,資料不刪除。
- 網頁版只在本機執行,不放到公開網路。

---

# 舊版說明(GitHub Actions 版,已停用)

> 以下是 2026-10 之前的架構,保留參考。`.github/workflows/update-data.yml` 只在手動觸發或 repo 變數 `AUTO_UPDATE=on` 時執行,目前不會自動跑。

## 架構總覽(舊)

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions  (每日 13:00 UTC，免費 tier)                    │
│  ─────────────────────────────────────────────                  │
│  1. 跑 backend/run.py                                            │
│     ├─ WTO RTA-IS 爬蟲   (≈600 個已通報協定)                    │
│     ├─ WTO JSI 爬蟲      (7 個聯合聲明倡議)                     │
│     ├─ DESTA 學術 CSV    (~900 個歷史協定，每半年更新)          │
│     ├─ RSS：USTR / WTO / EU DG Trade / Politico                  │
│     ├─ GDELT 2.0 API     (全球新聞事件)                          │
│     └─ Gemini API 萃取   (從新聞讀出狀態變化，免費 tier)        │
│  2. 與前一版 diff，產生 events                                   │
│  3. 寫入 data/*.json 並 commit 回 repo                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                  data/agreements.json + events.json
                  (公開於 raw.githubusercontent.com)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Expo 手機 App                                                   │
│  ─────────────────────────────────────────────                  │
│  - 啟動時 fetch JSON，AsyncStorage 快取 6 小時                  │
│  - 下拉 refresh 強制重新拉取                                     │
│  - 追蹤清單偵測未讀事件、首頁顯示「後端 X 分鐘前更新」           │
│  - 純前端 = Expo Push 可後加 (本版不含)                          │
└─────────────────────────────────────────────────────────────────┘
```

## 目錄(舊)

```
協定追蹤工具/
├── README.md                  ← 你正在看的這份
├── trade-tracker/             ← (舊) 網頁版 demo
├── trade-tracker-mobile/      ← (主) 手機 App，Expo + React Native
├── backend/                   ← Python pipeline
│   ├── run.py                 ← 主進入點
│   ├── requirements.txt
│   ├── scrapers/              ← 各來源爬蟲
│   │   ├── wto_rta.py
│   │   ├── wto_jsi.py
│   │   ├── desta.py
│   │   ├── gdelt.py
│   │   └── rss_feeds.py
│   ├── extractors/
│   │   └── llm_extract.py    ← Gemini 萃取
│   └── pipeline/              ← reconcile / diff / schema
├── data/                      ← pipeline 產出
│   ├── agreements.json        ← App 主要讀取的檔案
│   ├── events.json            ← 狀態變化事件
│   ├── meta.json              ← 上次跑的時間、各來源筆數
│   └── seed/
│       └── agreements.seed.json ← 歷史 89 個協定作為起點
└── .github/workflows/
    └── update-data.yml        ← 每日定時更新的 cron job（台灣 21:00）
```

---

## 首次部署步驟（一次性）

### 1. 推到 GitHub

```powershell
cd "C:\Users\jiwei\OneDrive\Desktop\claude code\協定追蹤工具"
git init
git add .
git commit -m "initial commit"
git branch -M main
gh repo create trade-tracker --public --source=. --push
# 或手動到 github.com 建 repo，然後：
# git remote add origin https://github.com/<USERNAME>/<REPO>.git
# git push -u origin main
```

### 2. 拿一把免費的 Gemini API Key

1. 前往 https://aistudio.google.com/apikey
2. 用 Google 帳號登入 → Create API Key
3. 複製 key（格式：`AIza...`）

**免費 tier 額度**（2025-2026 之間有效）：
- gemini-2.5-flash：1500 req/day, 15 req/min
- 我們一天最多用 ~20 次（25 篇新聞/批），遠低於上限

### 3. 把 API Key 加進 GitHub Secret

到你的 repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
- Name: `GEMINI_API_KEY`
- Value: 貼上剛才的 key

### 4. 啟用 GitHub Actions

到你的 repo → **Actions** 分頁 → 點 "I understand my workflows, enable them"

然後點 **update-data** workflow → **Run workflow** → 手動觸發第一次。
跑完後 `data/agreements.json`、`data/events.json`、`data/meta.json` 會出現在你的 repo。

### 5. 把 App 指向你的 repo

編輯 `trade-tracker-mobile/src/lib/data-source.ts`，把：

```ts
const REMOTE_AGREEMENTS_URL =
  'https://raw.githubusercontent.com/<USERNAME>/<REPO>/main/data/agreements.json';
```

裡的 `<USERNAME>` 和 `<REPO>` 換成你的。同時改 `REMOTE_EVENTS_URL` 和 `REMOTE_META_URL`。

提交：

```powershell
git add trade-tracker-mobile/src/lib/data-source.ts
git commit -m "app: point to live data URL"
git push
```

### 6. 在手機上開 App

```powershell
cd trade-tracker-mobile
npm start
```

掃 QR code → App 啟動時會 fetch 你 repo 的 JSON → 首頁應該顯示「🟢 即時資料」。

---

## 日常維運

### 確認 cron 有跑

到 repo **Actions** 分頁 → 看 `update-data` 每天有沒有綠色勾勾。
如果紅色，點進去看 log；常見問題：

| 症狀 | 處理 |
|------|------|
| WTO RTA-IS 抓 0 筆 | WTO 改了網頁 → 編輯 `backend/scrapers/wto_rta.py`，調整 selector |
| DESTA 404 | 上 https://www.designoftradeagreements.org/downloads/ 抄新檔名到 `DESTA_CANDIDATES` |
| RSS XML 解析失敗 | 該媒體換 feed URL，編輯 `backend/scrapers/rss_feeds.py` |
| GEMINI quota 超額 | 已用滿 1500/day，明天就會恢復 |

### 看 App 有沒有顯示新事件

- 首頁狀態列：「🟢 即時資料 · 後端 X 小時前」
- 追蹤清單分頁：「後端偵測到的變動」綠色區塊會列出狀態變化

### 手動加新協定

如果某協定不在 WTO 系統（例如雙邊 MOU），可以：
1. 編輯 `trade-tracker-mobile/src/data/agreements.ts` 加一筆
2. 跑 `node backend/extract_seed.mjs`（重新匯出 seed JSON）
3. push

---

## 涵蓋協定類型

本系統覆蓋以下類型（在 `backend/pipeline/schema.py` 的 `VALID_TYPES`）：

| type 值 | 中文 | 例子 |
|---------|------|------|
| `bilateral`     | 雙邊                     | 美韓 KORUS、UK–India FTA |
| `multilateral`  | 多邊                     | WTO、GATT |
| `regional`      | 區域                     | RCEP、CPTPP、AfCFTA |
| `plurilateral`  | 複邊                     | ITA、政府採購協定 |
| `sectoral`      | 特定領域                 | 加美汽車協定 |
| `jsi`           | WTO 聯合聲明倡議         | E-commerce JSI、IFD |
| `ministerial`   | WTO 部長決議             | MC13/MC14 結果 |
| `mou`           | 備忘錄                   | 雙邊 MOU |
| `joint_declaration` | 聯合聲明             | 中英聯合聲明風格 |
| `pilot`         | 先導計畫                 | 數位貿易先導計畫 |

新 type 也可以隨時加入，App 端會自動處理未知 type（不會崩潰，只是不在 type 篩選欄位顯示翻譯）。

---

## 已知限制（透明說明）

1. **不是分鐘級即時**：每日一次。要分鐘級需要付費 Reuters API + 自架伺服器，是另一個量級。
2. **WTO RTA-IS 的 ASP.NET 反爬**：他們的 GridView 表格仰賴 `__VIEWSTATE`，目前我寫的 scraper 在 CSV export 端點不通、HTML 端點 selector 過時時會抓 0 筆。需要逐步調整。**短期解法**：依賴 DESTA + RSS + LLM 抓變化。
3. **DESTA 下載 URL 不穩定**：他們半年改一次檔名，要手動更新 `DESTA_CANDIDATES`。
4. **LLM 萃取會有偽陽性**：Gemini 對「Trump 宣布要簽 FTA」這類發言可能誤判為「已簽」。我們設 `_confidence: 0.4–0.8` 並要求 reconciler 在 `>= 0.7` 才覆蓋既有狀態，降低錯誤。
5. **沒有 push 通知**：本版只有 App 內事件顯示。要做真推播要加 `expo-notifications` 並架後端打 Expo Push Service。

---

## 本地開發 / 除錯

### 本地跑一次 pipeline

```powershell
cd "C:\Users\jiwei\OneDrive\Desktop\claude code\協定追蹤工具"
python -m pip install -r backend/requirements.txt
$env:GEMINI_API_KEY = "AIza..."   # 選擇性
python backend/run.py
```

### 在手機 App 上強制更新

下拉首頁或追蹤頁面即可 refresh（pull-to-refresh）。

### 把 App 切回離線測試模式

把 `data-source.ts` 裡的 URL 改回含 `<USERNAME>` 的，App 會自動 fallback 到 bundled seed。

---

## 為什麼這樣設計

| 設計選擇 | 為什麼 |
|---------|--------|
| **GitHub Actions cron 而非自架伺服器** | 免費、log 永久保存、不用維運機器 |
| **JSON 檔放在 repo 而非資料庫** | 版本控制免費、可以 `git log data/agreements.json` 看歷史 |
| **多源 + LLM** | 沒有單一可靠 API，必須多源拼湊 |
| **scraper 失敗不阻塞 pipeline** | 任一來源掛掉時其他來源仍貢獻資料 |
| **App 端 cache 6 小時** | 減少 GitHub bandwidth、離線可用 |
| **本地 seed fallback** | 你斷網或還沒部署時 App 仍能用 |

---

## 後續可擴充項目

- [ ] 加 `expo-notifications` 推播
- [ ] WTO RTA-IS Playwright 爬蟲（穩定但較重）
- [ ] OECD ITF 統計 API（要 key）抓貿易量真實數字
- [ ] 中文媒體 RSS（聯合報、經濟日報、財訊國際版）
- [ ] EU EUR-Lex API 抓條約全文
- [ ] PostgreSQL 改造（如果協定數超過 10k）
