# 全球貿易協定追蹤工具

一個 **自動更新** 的全球雙邊/多邊/特殊性質貿易協定追蹤系統。

> 目的：解決「想驗證某條貿易協定相關說法時，要一個一個國家查」的問題。
> 設計目標：你每天打開 App，就能看到全球所有協定（含 WTO JSI、聯合聲明、備忘錄等）的最新狀態變化，不需自己找資料。

## 架構總覽

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions  (每日 06:00 UTC，免費 tier)                    │
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

## 目錄

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
    └── update-data.yml        ← 每日定時更新的 cron job
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
