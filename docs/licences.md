# 授權清單(2026-10-20)

工具目前以個人使用為主,之後可能給同事使用,最終可能上架或販售。這份清單列出工具用到的每個資料來源、程式套件與服務,以及它們能不能用在商業用途,作為商業化之前要逐項處理的依據。

> 這是整理公開條款的結果,不是法律意見。正式販售前,請以各來源最新條款為準,必要時請律師確認。

圖例:✅ 可商用(依條款標示出處即可) ⚠️ 需確認、需申請或可能要付費 ❌ 條款限非商業使用

## 一、資料來源

| 來源 | 工具裡的用途 | 商用 | 說明與處理方式 |
|---|---|---|---|
| WTO 區域貿易協定資料庫(Regional Trade Agreements Database, RTA-IS) | 協定資料庫主幹(約 650 筆) | ⚠️ | 找不到這個資料庫本身的授權條款;WTO 其他網站寫明商業使用要事先取得書面許可。**處理:**商業化前寫信到 enquiries@wto.org 申請。 |
| WTO 新聞與文件 | 電子商務聯合聲明倡議(JSI)追蹤、官方來源追蹤 | ⚠️ | 同上,由 WTO 擁有著作權。工具只存標題、連結與自己寫的摘要。 |
| Google 新聞 RSS | 全球協定新聞追蹤、JSI 追蹤的新聞部分 | ❌ | 第三方整理指出 RSS 僅限個人、非商業使用(Google 原文待確認)。**處理:**商業版改用官方來源追蹤或付費新聞服務,停用 Google 新聞來源。 |
| 美國貿易代表署(USTR) | 官方來源追蹤 | ✅ | 美國聯邦政府的著作不受著作權保護(第三方內容除外)。 |
| 歐盟執委會新聞中心 | 官方來源追蹤 | ✅ | 執委會文件預設可重複使用,只需標示出處。 |
| 英國商業貿易部(GOV.UK) | 官方來源追蹤 | ✅ | 依開放政府授權(Open Government Licence)可商用,標示出處。 |
| 加拿大全球事務部(Canada.ca) | 官方來源追蹤 | ⚠️ | 非商業重製免申請;**商業再散布要事先取得書面許可**。工具只存標題、連結與自寫摘要,商業化前仍應確認。 |
| 東協秘書處、南共市秘書處 | 官方來源追蹤 | ⚠️ | 網站未找到明確的再利用條款。**處理:**商業化前確認或改為只連結。 |
| 經濟部國際貿易署網站 | 官方來源追蹤(新聞稿、國際經貿資訊) | ✅ | 政府網站資料原則上可重複使用,標示出處;個別頁面若另有聲明以聲明為準。 |
| 國際貿易署 WTO 小辭典(政府資料開放平臺) | 名詞資料庫的 WTO 詞條 | ✅ | 政府資料開放授權條款第 1 版,可商用,標示出處。 |
| 人工整理的協定與名詞 | 協定詳情、名詞解釋 | ✅ | 內容由本工具撰寫,引用各國政府與國際組織的官方文件並附來源。 |
| Natural Earth 國界 | 地球儀 | ✅ | 公有領域。 |
| Digital Policy Alert | 名詞資料庫的引用來源 | ⚠️ | 網站內容為「姓名標示-非商業性」授權;API 資料另有付費授權。工具只引用個別頁面,沒有串接資料。 |

**存放方式要注意:**官方來源追蹤會在資料庫存每則項目的原文摘要(最多 800 字)供 AI 判斷。商業版可改成判斷完就清除原文,只保留標題、連結與自己寫的摘要。

## 二、程式套件

| 套件 | 授權 | 商用 |
|---|---|---|
| Expo、React、React Native、react-native-web、react-native-webview | MIT | ✅ |
| globe.gl、react-globe.gl、three.js | MIT | ✅ |
| world-atlas、topojson-client、d3-geo、polylabel | ISC | ✅ |
| i18n-iso-countries、Ionicons | MIT | ✅ |
| Python 套件(requests、openpyxl、FastAPI 等) | MIT/BSD 類 | ✅ |

上架前可用 `npx license-checker --summary` 再全面檢查一次相依套件。

## 三、服務與工具

| 服務 | 用途 | 商用 | 說明與處理方式 |
|---|---|---|---|
| n8n(Sustainable Use License,永續使用授權) | 所有更新流程 | ⚠️ | 在自家產品背後執行、客戶無法建立或編輯流程,依官方常見問題屬允許範圍;界線模糊時官方建議寫信 license@n8n.io 確認。**不可**讓客戶自己建立流程。 |
| Docker Desktop | 在電腦上執行 n8n 與網頁 | ⚠️ | 個人、教育與小型企業(員工少於 250 人**且**年營收低於 1,000 萬美元)免費;**超過任一門檻要付費訂閱**。給同事用之前要先確認公司規模。改在伺服器上用 Docker Engine(免費開源)可避開。 |
| Supabase 免費方案 | 資料庫 | ⚠️ | 可商用,但 7 天沒使用會暫停(已用 GitHub Actions 每週兩次讀取避免),容量與連線數有限;正式服務建議升級付費方案。 |
| Gemini API 免費額度 | AI 判斷與摘要 | ⚠️ | 免費版的輸入輸出可能被 Google 用來改進產品,也可能有人工審閱;商業版改用付費版(不用於改進產品)。 |
| GitHub(公開 repo、Actions) | 原始碼、保持資料庫連線 | ✅ | 公開 repo 的 Actions 免費;排程在 repo 60 天沒有活動時會被 GitHub 暫停,需要時到 Actions 頁重新啟用。 |

## 四、商業化前的待辦

1. 寫信問 WTO:區域貿易協定資料庫與新聞的商業使用許可。
2. 停用 Google 新聞來源,改以官方來源追蹤為主。
3. 確認加拿大、東協、南共市的再利用條件,不行就改為只連結。
4. Gemini 改用付費版。
5. 依公司規模確認 Docker Desktop;或改在伺服器上用 Docker Engine。
6. 必要時寫信問 n8n,確認產品的使用方式在授權範圍內。
7. 官方來源的原文摘要改為判斷後清除。

## 參考來源

- Docker. (n.d.). *Docker pricing FAQ*. https://docker.io/pricing/faq/
- Government of Canada. (n.d.). *Terms and conditions*. https://www.canada.ca/en/transparency/terms
- n8n. (n.d.). *License FAQ*. https://docs.n8n.io/n8n-community-license/community-license/license-faq
- Search Engine Journal. (2022). *Google News offers RSS and Atom feeds*. https://www.searchenginejournal.com/google-news-offers-rss-and-atom-feeds/2022
- Google. (n.d.). *Gemini API billing*. https://ai.google.dev/gemini-api/docs/billing
- World Trade Organization. (n.d.). *WTO iLibrary copyright*. https://www.wto-ilibrary.org/copyright
- St. Gallen Endowment for Prosperity Through Trade. (2026). *DPA Licensed Data — General Terms* (Version 6). https://sgeptupload.s3.eu-west-1.amazonaws.com/terms/DPA+Licensed+Data+-+General+Terms.pdf
