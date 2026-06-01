import type { AgreementDetail } from './types';

/**
 * Curated rich detail keyed by agreement id (bundled in-app).
 * - INDIGO scores: OECD INDIGO is a COUNTRY-level index (193 countries, 2000-2024).
 *   Per-agreement INDIGO-t scores below are TOOL ESTIMATES applying the published
 *   OECD methodology (28 issues across 5 domains; shall=1, endeavour=0.5, absent=0),
 *   except where a published research figure is cited. All marked official:false.
 *   Methodology: OECD (2025), Methodology for the OECD INDIGO, doi:10.1787/b6d01a7b-en
 * - latestStatus: short summaries are AI-written (byTool:true) from public reporting.
 * - We do NOT fabricate official full clause text; sourceDocs link to official documents.
 */
export const AGREEMENT_DETAILS: Record<string, AgreementDetail> = {
  'wto-jsi-ecommerce': {
    latestStatus: {
      summary:
        'WTO 第14屆部長會議（MC14，2026年3月於喀麥隆雅溫德）未能完成電子傳輸關稅暫免（moratorium）的延續，該措施已於 2026 年 3 月底依期失效。但同會議通過《電子商務協定過渡性安排宣言》，66 個成員（涵蓋約 70% 全球貿易）採納過渡性安排，待 45 國完成國內批准即生效。我國等 23 個成員於 2026 年 4 月以複邊臨時措施維持電子傳輸不課關稅。',
      detail:
        'MC14 於 2026 年 3 月 26 日至 29 日在喀麥隆雅溫德召開。\n\n【moratorium】MC14 主席、喀麥隆貿易部長 Mbarga Atangana 於閉幕時坦承「時間不夠」，電子商務工作計畫及 moratorium 的延續均屬未能完成的待決事項。WTO 秘書長宣布將「以不同方式運作」，以 MC14 期間形成的草案文本為基礎，帶回日內瓦於下次總理事會會議繼續完成。待完成的「雅溫德套案」（Yaoundé package）包含雅溫德部長宣言暨 WTO 改革工作計畫草案、電子商務部長決議草案等一攬子方案。WTO 秘書長確認 moratorium 於 2026 年 3 月底依期失效。\n\n【電子商務協定】MC14 有明確進展。2026 年 3 月 28 日，WTO 通過《電子商務協定過渡性安排宣言》（Declaration on Interim Arrangements for the Agreement on Electronic Commerce，WT/MIN(26)/W/26），讓 66 個 WTO 成員（涵蓋約 70% 全球貿易量）採納「過渡性安排」，使電子商務協定可在尚未納入 Annex 4 之前生效。依此安排，各成員啟動國內批准程序，待 45 個成員完成並提交接受書後，協議即正式對已接受成員生效。\n\n【我國立場】moratorium 失效後，2026 年 4 月 1 日，包含我國在內的 23 個 WTO 成員聯合向總理事會提交《電子傳輸暫免課徵關稅聯合聲明》（WT/GC/283），表達對 MC14 未能完成 moratorium 延續的遺憾，並承諾以複邊臨時措施（temporary, plurilateral measure）形式，在簽署成員之間維持不對電子傳輸課徵關稅的現行做法，效期延續至下次總理事會會議召開為止。',
      asOf: '2026-04-01',
      byTool: true,
    },
    indigo: {
      total: 0.41, raw: 11.5, max: 28, official: false,
      sourceNote: '研究文獻試算值（WTO JSI 穩定文本 11.5/28 ≈ 0.41）；非 OECD 官方分數',
      asOf: '2026-03',
    },
    sourceDocs: [
      { label: 'WTO 電子商務聯合聲明倡議官方頁面', url: 'https://www.wto.org/english/tratop_e/ecom_e/joint_statement_e.htm', lang: 'en' },
      { label: 'WT/MIN(26)/W/26 過渡性安排宣言（WTO 文件庫）', url: 'https://docs.wto.org/', lang: 'en' },
    ],
  },

  'us-taiwan-21st': {
    latestStatus: {
      summary: '美臺於 2023 年 6 月 1 日簽署「臺美 21 世紀貿易倡議」首批協定，涵蓋海關及貿易便捷化、良好法制作業、服務業國內規章、反貪腐、中小企業 5 項議題。第二階段就勞動、環境、農業、數位貿易、標準、國營事業、非市場政策等議題持續談判。',
      detail:
        '「臺美 21 世紀貿易倡議」（U.S.-Taiwan Initiative on 21st-Century Trade，21CT）於 2022 年 6 月 1 日由 USTR 與我駐美代表處宣布啟動，是美臺自 1979 年斷交以來最具實質意義的雙邊經貿安排。\n\n【架構】不是傳統 FTA，未涉關稅減讓，刻意避開美方對「FTA = 政治承認」之疑慮；採「議題分批達成」模式，分兩階段共 11 項議題。\n\n【第一批協定（2023/6/1 簽署）】涵蓋 5 項議題：\n  - 海關行政與貿易便捷化\n  - 良好法制作業\n  - 服務業國內規章\n  - 反貪腐\n  - 中小企業\n  我國於 2023 年 8 月完成立法院審議，2024 年 1 月生效。\n\n【第二批談判（持續中）】另 6 項議題：勞動、環境、農業、數位貿易、標準、國營事業/非市場政策。其中數位貿易、勞動、環境章節雙方已多次互換文本。川普 2025 年再任後，是否延續 21CT 模式抑或轉向其他形式安排仍待觀察；美貿易代表 Greer 於 2025 年國會聽證會表示將「持續對臺貿易接觸」但未明確承諾繼續 21CT。\n\n【意義】21CT 是我國在無 FTA 情況下，與美國建立的最高層級雙邊經貿制度安排；與美日數位貿易協定、CPTPP 等相互呼應，是我國融入區域數位通商規則的重要支柱。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — U.S.-Taiwan Initiative on 21st-Century Trade', url: 'https://ustr.gov/countries-regions/china-mongolia-taiwan/taiwan', lang: 'en' },
      { label: '經濟部國際貿易署', url: 'https://www.trade.gov.tw/', lang: 'zh' },
    ],
  },
  'wto-rta-new-zealand-chinese-taipei': {
    latestStatus: {
      summary: 'ANZTEC 自 2013 年 12 月生效以來持續運作，逾 99% 我國輸紐產品及全部紐國輸我農產品已享零關稅，是我國對外經貿正常化的重要範例。',
      detail:
        '《臺澎金馬個別關稅領域與紐西蘭經濟合作協定》（ANZTEC）於 2013 年 7 月 10 日簽署、同年 12 月 1 日生效，是我國與非邦交國簽署的首個具 FTA 性質的全面性經濟合作協定，亦是我國加入 CPTPP 與全球高標準 FTA 體系的重要鋪墊。\n\n【規模與意義】(1) 為我國突破外交孤立、與非邦交先進國家深化經貿關係的指標；(2) 紐西蘭為我國第 36 大貿易夥伴（2024 年雙邊貿易約 17 億美元）；(3) 為後續臺星 ASTEP（2013/11 簽）打開政治空間。\n\n【主要承諾】\n  - 貨品：紐方對我國全部產品（含農產品）4 年內降至零關稅；我方對紐 88.6% 工業品立即降至零、其餘 12 年內降至零、約 35% 農產品立即降至零、共 88.5% 農產品逐年降至零\n  - 服務：互開金融、運輸、營建、專業服務；雙方亦開放教育、醫療、觀光等\n  - 投資：含「投資人對地主國」（ISDS）類似機制\n  - 全球首部 FTA 級「原住民族合作」專章（第 16 章），與紐方毛利傳統商業文化承認結合\n  - 含電影電視合製、勞動、環境章節（屬高標準 FTA 規範）\n\n【經濟成果】生效後雙邊貿易由 13 億美元（2013）成長至 17 億美元（2024）；我國乳製品、原木、奇異果、葡萄酒等紐方產品大幅進口；紐方則進口我國電子、機械、塑膠製品。\n\n【後續】紐方於 2024 年起積極支持我加入 CPTPP，雙方並於 ANZTEC 架構下成立工作小組探討升級議定書（含電子商務、永續發展、貿易便捷化等）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署 — ANZTEC', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-singapore-chinese-taipei': {
    latestStatus: {
      summary: 'ASTEP 自 2014 年 4 月生效以來持續運作，雙方絕大多數貨品已達零關稅，並涵蓋服務、投資及電子商務合作。',
      detail:
        '《新加坡與臺澎金馬個別關稅領域經濟夥伴協定》（ASTEP）於 2013 年 11 月 7 日簽署、2014 年 4 月 19 日生效，是我國繼 ANZTEC 後簽署的第二個與非邦交先進國家的全面性經濟合作協定。\n\n【規模】新加坡為我國第 6 大貿易夥伴（2024 年雙邊貿易約 270 億美元），涵蓋範圍與重要性遠大於 ANZTEC。\n\n【主要承諾】\n  - 貨品：新加坡對我國 100% 工業品立即零關稅（新方原本即低關稅）；我方對新方約 83% 工業品立即降至零、其餘 15 年內降至零；農產品保留部分敏感品例外\n  - 服務：互開金融、電信、運輸、營建、專業服務；我方並承諾擴大新方金融機構（如華僑銀行）來臺營運便捷化\n  - 投資：採高標準保護機制\n  - 包含電子商務章節（第 13 章），是我國 FTA 首部數位章節\n  - 含貿易便捷化、海關程序、政府採購、競爭等完整章節\n\n【經濟成果】生效以來，雙邊貿易由 213 億美元（2014）成長至 270 億美元（2024）；我方對新加坡 IC、電子產品、機械為主出口；新方對我方化學品、機械、運輸設備為主出口。雙方亦透過 ASTEP 強化金融、人才合作。\n\n【意義】(1) 我國對東協國家的第一個 FTA，補上戰略缺口；(2) 為後續加入 CPTPP（新加坡為現有締約方）形成有利政治基礎；(3) 第 13 章電子商務為我國加入 DEPA、DEFA 等數位協定打下制度經驗。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署 — ASTEP', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-guatemala-chinese-taipei': {
    latestStatus: {
      summary: '臺瓜 FTA 仍生效中。瓜地馬拉為我國中美洲重要邦交國，協定持續提供雙邊貨品優惠關稅。',
      detail:
        '《中華民國與瓜地馬拉共和國自由貿易協定》於 2005 年 9 月 22 日簽署、2006 年 7 月 1 日生效，是我國第二個 FTA（繼 2003 年臺巴拿馬 FTA 之後）。\n\n【主要承諾】(1) 我方對瓜方 87% 工業品立即降至零、其餘 10–15 年內逐步降稅；對其農產品設較長過渡與配額；(2) 瓜方對我方近全部工業品 10 年內降至零；(3) 服務、投資、政府採購條款；(4) 含原產地規則、爭端解決、智財等章節。\n\n【經濟意義】(1) 對我方而言，協定的戰略意義大於經濟規模（2024 雙邊貿易約 1.8 億美元）；(2) 鞏固我國在中美洲的邦交（瓜地馬拉迄今為我國少數重要邦交國，亦是中美洲僅存對我邦交國）；(3) 提供瓜方咖啡、糖、香蕉、紡織品優惠進入我市場。\n\n【近年動態】(1) 雙方於 2018、2023 年舉行 FTA 聯合委員會檢視協定運作；(2) 2025 年我方提供瓜方咖啡產業升級合作計畫；(3) 瓜地馬拉新政府 Arévalo（2024 上任）公開重申維持與我國邦交，協定運作不受影響。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-panama-chinese-taipei': {
    latestStatus: {
      summary: '本協定（我國史上首個 FTA，2004 年生效）已實質終止。巴拿馬於 2017 年 6 月與我斷交、轉與中華人民共和國建交，雙邊優惠關稅安排隨之失效。',
      detail:
        '《中華民國與巴拿馬共和國自由貿易協定》於 2003 年 8 月 21 日簽署、2004 年 1 月 1 日生效，是我國史上**第一個自由貿易協定**。\n\n【歷史意義】(1) 開啟我國對外簽署 FTA 之先河；(2) 為其後臺瓜（2006）、臺薩宏（2008）、臺尼（2008）等中美洲 FTA 鋪路；(3) 雖規模有限（2016 雙邊貿易約 1 億美元），但戰略象徵意義重大。\n\n【主要承諾】(1) 雙方對絕大多數工業品 10 年內降至零關稅；(2) 我方對巴方咖啡、糖、香蕉、海產等農產品給予優惠；(3) 含服務、政府採購、爭端解決、智財等章節。\n\n【斷交與失效】2017 年 6 月 13 日，巴拿馬時任總統 Varela 宣布與我斷交、改與中華人民共和國建交，雙方 FTA 隨之實質失效：\n  - 6/13 巴方宣布斷交\n  - 6/14 我國外交部即發表聲明，宣布終止與巴方所有合作關係（含 FTA）\n  - 巴方雖未正式以條約程序終止 FTA，但因關稅同盟與經貿關係轉移，協定實質停止運作\n\n【後續】此事件揭開 2016 年起對我邦交國斷交潮：聖多美普林西比（2016/12）、巴拿馬（2017/6）、多明尼加（2018/5）、布吉納法索（2018/5）、薩爾瓦多（2018/8）、所羅門群島（2019/9）、吉里巴斯（2019/9）、尼加拉瓜（2021/12）、宏都拉斯（2023/3）、諾魯（2024/1）。其中與我有 FTA 之巴拿馬、薩爾瓦多、宏都拉斯、尼加拉瓜均隨斷交失效。',
      asOf: '2017-06', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署（歷史協定）', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-nicaragua-chinese-taipei': {
    latestStatus: {
      summary: '本協定已終止。尼加拉瓜於 2021 年 12 月與我斷交、轉與中國建交後，雙邊 FTA 失效。',
      detail:
        '《中華民國與尼加拉瓜共和國自由貿易協定》於 2006 年 6 月 16 日簽署、2008 年 1 月 1 日生效，是我國第三個 FTA（繼巴拿馬、瓜地馬拉之後）。\n\n【主要承諾】(1) 雙方絕大多數工業品 10 年內降至零；(2) 我方對尼方咖啡、糖、肉品給予優惠；(3) 含服務、政府採購、原產地、爭端解決、智財等章節。\n\n【斷交與終止】2021 年 12 月 9 日，尼加拉瓜時任總統 Ortega 宣布與我斷交、改與中華人民共和國建交。我國外交部 12/10 宣布終止與尼方所有外交、合作關係：\n  - 我駐尼大使館於 12/12 撤館\n  - 尼方 2022 年 7 月 28 日正式通知 WTO 終止與我之 FTA\n  - 雙邊優惠關稅安排自此完全失效\n\n【經濟影響】生效 14 年期間，雙邊貿易由 0.5 億美元成長至 2 億美元（2020 高峰）；終止後我國對尼出口大幅萎縮。\n\n【歷史地位】尼國斷交為 2016 年以來與我斷交潮的第 8 個案例，但相對其他斷交國而言（多為印太或加勒比小國），尼國斷交對我國中美洲布局衝擊最大；後續宏都拉斯（2023/3）斷交更使中美洲僅餘瓜地馬拉為我邦交國。',
      asOf: '2022-07', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署（歷史協定）', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-el-salvador-honduras-chinese-taipei': {
    latestStatus: {
      summary: '本三方協定已終止。薩爾瓦多（2018）與宏都拉斯（2023）相繼與我斷交、轉與中國建交，協定失效。',
      detail:
        '《中華民國與薩爾瓦多共和國及宏都拉斯共和國自由貿易協定》於 2007 年 5 月 7 日簽署，2008 年 3 月 1 日對宏都拉斯生效、2008 年 3 月 21 日對薩爾瓦多生效，是我國唯一三方 FTA，亦是中美洲三角邦交（臺、薩、宏）的制度核心。\n\n【主要承諾】(1) 雙方對絕大多數工業品 10 年內降至零；(2) 我方對薩宏咖啡、糖、紡織品優惠；薩宏方對我電子、機械、塑膠製品開放；(3) 含服務、政府採購、爭端解決、智財等章節。\n\n【兩階段斷交與終止】\n  - 2018/8/21：薩爾瓦多時任總統 Sánchez Cerén 宣布與我斷交、轉與中華人民共和國建交。協定對薩部分實質失效。\n  - 2023/3/26：宏都拉斯時任總統 Xiomara Castro 宣布與我斷交、轉與中華人民共和國建交。協定對宏部分隨之失效，三方協定完全終止。\n\n【經濟影響】生效 15 年期間，三方貿易由 1.5 億美元成長至約 3 億美元（2017 高峰），主要受惠者為薩宏咖啡與成衣產業；我方則對中美洲整合佈局受重大挫折。\n\n【後續】中美洲整合體系（SICA）9 國（含哥斯大黎加 2007 早已斷交、巴拿馬 2017 斷交、薩爾瓦多 2018 斷交、宏都拉斯 2023 斷交、尼加拉瓜 2021 斷交）僅餘瓜地馬拉、貝里斯、多明尼克為我邦交國，瓜地馬拉為我國中美洲僅存的 FTA 夥伴。',
      asOf: '2023-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署（歷史協定）', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },

  'taiwan-japan-dta': {
    latestStatus: {
      summary: '臺日數位貿易協議於 2025 年 12 月 4 日由臺灣日本關係協會與日本台灣交流協會簽署，是我國少數以官方文本對外簽署的數位貿易協議。在跨境資料流動與數位信任領域已奠定完整規範基礎，但廣義數位經濟議題（AI、金融科技等）尚未納入。',
      detail:
        '《臺灣日本關係協會與公益財團法人日本台灣交流協會數位貿易相互合作協議》於 2025 年 12 月 4 日簽署，是我國繼 1990 年代《亞東關係協會與財團法人交流協會貿易協定》之後，與日本簽署的最重要雙邊經貿協議。\n\n【談判脈絡】談判自 2022 年 11 月雙方在「臺日經濟夥伴對話」第一屆會議上達成共識後啟動，歷經 3 年 6 輪實質會談。\n\n【協議架構】共 30 條，採用英文作準。涵蓋：定義（第 1 條）、原則與目標（第 2 條）、範圍（第 3 條）、關稅（第 4 條）、數位產品非歧視性待遇（第 5 條）、電子交易框架（第 6 條）、規章（第 7 條）、電子驗證與電子簽章（第 8 條）、線上消費者保護（第 9 條）、個人資訊保護（第 10 條）、網際網路接取（第 11 條）、跨境資料流動（第 12 條）、算力設施位置（第 13 條）、開放網際網路（第 14 條）、商業電子訊息（第 15 條）、原始碼（第 16 條）、商業 ICT 加密技術（第 17 條）、開放政府資料（第 18 條）、電子契約（第 19 條）、電子發票（第 20 條）、電子支付（第 21 條）、無紙化貿易（第 22 條）、網路安全（第 23 條）、數位包容（第 24 條）、機構（第 25 條）、爭端解決（第 26 條）、例外（第 27 條）、修訂（第 28 條）、生效（第 29 條）、終止（第 30 條）。\n\n【意義】\n(1) 我國對外簽署的第一個全面性數位貿易協議；\n(2) 為我國加入 CPTPP、DEPA 等高標準數位通商架構的重要鋪墊；\n(3) 在跨境資料流動（第 12 條）與算力設施位置（第 13 條）兩項核心條款上，採取與美日 DTA、CPTPP 第 14 章相同的高標準禁止性義務；\n(4) 開放原始碼（第 16 條）採取「禁止強制移轉」之主流規範，與我國《營業秘密法》保護立場一致；\n(5) 政府採購（第 3 條）明確排除，反映雙方對 GPA 適用範圍的彈性處理。\n\n【限制】未納入 DEPA / DEA 第二代協定常見的 AI、金融科技、數位身分、競爭政策章節，反映此協議定位為「基礎性」雙邊安排，預留未來擴展空間。',
      asOf: '2025-12-04', byTool: true,
    },
    indigo: {
      total: 0.48, raw: 13.5, max: 28, official: false,
      sourceNote: '研究文獻試算值（依 OECD INDIGO-t 方法論，13.5/28 ≈ 0.48）；非 OECD 官方分數',
      domains: [
        { code: 'A', name: '促進電子商務', raw: 4.0, max: 7, score: 0.57, note: '電子交易、電子簽章、電子契約為強制；電子發票、無紙化貿易為致力；電子支付與邊境數位化缺漏' },
        { code: 'B', name: '開放性與電子商務', raw: 2.0, max: 5, score: 0.40, note: '關稅豁免為強制；開放資料與網路接取為致力；ICT 關稅與電信缺漏' },
        { code: 'C', name: '信任與電子商務', raw: 5.5, max: 6, score: 0.92, note: '消費者保護、個資、原始碼、加密為強制；網路安全僅致力' },
        { code: 'D', name: '跨境資料流動與在地化', raw: 2.0, max: 2, score: 1.0, note: '跨境資料傳輸（第12條）與禁止強制設置算力設施（第13條）均為強制禁止義務' },
        { code: 'E', name: '廣義數位經濟議題', raw: 0.0, max: 8, score: 0, note: 'AI、金融科技、數位包容、法律科技、政府採購（第3條明確排除）、稅務均缺漏' },
      ],
      asOf: '2025-12',
    },
    sourceDocs: [
      { label: '臺灣日本關係協會（協議簽署新聞）', url: 'https://www.koryu.or.jp/', lang: 'ja' },
      { label: '經濟部國際貿易署', url: 'https://www.trade.gov.tw/', lang: 'zh' },
    ],
  },

  'us-japan-dta': {
    latestStatus: {
      summary: '美日數位貿易協定自 2020 年 1 月生效後維持運作，是美國數位貿易條款的旗艦範本。後續未再擴大，數位經濟新興議題（AI、金融科技等）仍未納入。',
      detail:
        '美日數位貿易協定（U.S.-Japan Digital Trade Agreement, USJDTA）於 2019 年 10 月 7 日簽署、2020 年 1 月 1 日生效，與美日《貿易協定》第一階段同時生效。\n\n【背景】美方於 2017 年退出 TPP 後，「TPP 第 14 章（電子商務）」之高標準規範一度懸空。USJDTA 將原 TPP 數位條款全數復刻並進一步強化（如禁止強制揭露原始碼與演算法），成為美方此後對外數位貿易談判的範本（USMCA 第 19 章、IPEF 第一支柱草案均沿用）。\n\n【架構】共 22 條，涵蓋（與臺日 DTA 高度雷同）：定義、原則、範圍、數位產品關稅、數位產品非歧視性待遇、線上消費者保護、垃圾訊息、個人資訊保護、跨境資料流動、算力設施位置（禁止資料在地化）、金融服務算力設施、原始碼（強化版，含演算法）、加密 ICT 產品、政府開放資料、電子簽章與電子認證、互動式電腦服務（線上平台責任）、網際網路接取原則、貿易便捷化電子文件、無紙化貿易管理、爭端解決等。\n\n【規範亮點】\n(1) 第 17 條「互動式電腦服務」：複製美國《通訊端正法》第 230 條保護網路平台不為使用者內容負責的精神，是首個國際協定納入此規範；\n(2) 第 11 條「演算法揭露禁止」：較 USMCA 與 CPTPP 更嚴格，明確涵蓋「演算法」而非僅「原始碼」；\n(3) 不限「數位內容」之關稅豁免：與 WTO moratorium 範圍一致；\n(4) 廣義「個人資訊保護」：要求採取與相關國際機構（如 OECD、APEC CBPR）原則一致的法律架構。\n\n【後續】USJDTA 未進一步擴大或升級；川普政府 2025 年後更傾向以單邊關稅手段重塑貿易關係，雙方未啟動 USJDTA 二代談判。',
      asOf: '2025-12', byTool: true,
    },
    indigo: {
      total: 0.46, raw: 13.0, max: 28, official: false,
      sourceNote: '本工具依 OECD INDIGO-t 方法論粗估（依條文涵蓋範圍）；非 OECD 官方分數。精確分數需逐條判讀「應/致力」語言。',
      domains: [
        { code: 'A', name: '促進電子商務', raw: 4.0, max: 7, score: 0.57, note: '電子交易框架、電子簽章為強制；電子發票缺漏' },
        { code: 'B', name: '開放性與電子商務', raw: 2.0, max: 5, score: 0.40, note: '關稅豁免強制；開放資料、網路接取致力' },
        { code: 'C', name: '信任與電子商務', raw: 5.0, max: 6, score: 0.83, note: '消費者保護、個資、原始碼、加密強制；網安致力' },
        { code: 'D', name: '跨境資料流動與在地化', raw: 2.0, max: 2, score: 1.0, note: '兩項均為強制禁止義務' },
        { code: 'E', name: '廣義數位經濟議題', raw: 0.0, max: 8, score: 0, note: 'AI、金融科技、數位身分、政府採購均缺漏' },
      ],
      asOf: '2026-05',
    },
    sourceDocs: [
      { label: 'USTR — US-Japan Digital Trade Agreement Text', url: 'https://ustr.gov/countries-regions/japan-korea-apec/japan/us-japan-trade-agreement-negotiations/us-japan-digital-trade-agreement-text', lang: 'en' },
    ],
  },

  'singapore-australia-dea': {
    latestStatus: {
      summary: '星澳數位經濟協定 2020 年 12 月生效，是全球首批全面性 DEA 之一，涵蓋 AI、金融科技、資料創新等新興議題，被視為新世代數位貿易規則範本。',
      asOf: '2025-12', byTool: true,
    },
    indigo: {
      total: 0.66, raw: 18.5, max: 28, official: false,
      sourceNote: '本工具依 OECD INDIGO-t 方法論粗估；非 OECD 官方分數。第二代 DEA，E 類（新興議題）覆蓋完整故分數較高。',
      domains: [
        { code: 'A', name: '促進電子商務', raw: 6.0, max: 7, score: 0.86 },
        { code: 'B', name: '開放性與電子商務', raw: 3.0, max: 5, score: 0.60 },
        { code: 'C', name: '信任與電子商務', raw: 5.0, max: 6, score: 0.83 },
        { code: 'D', name: '跨境資料流動與在地化', raw: 2.0, max: 2, score: 1.0 },
        { code: 'E', name: '廣義數位經濟議題', raw: 2.5, max: 8, score: 0.31, note: 'AI、金融科技、資料創新、數位身分均納入（多為致力語言）' },
      ],
      asOf: '2026-05',
    },
    sourceDocs: [
      { label: '新加坡 MTI — SADEA 官方頁面', url: 'https://www.mti.gov.sg/Trade/Digital-Economy-Agreements/The-Singapore-Australia-Digital-Economy-Agreement', lang: 'en' },
    ],
  },

  'uk-singapore-dea': {
    latestStatus: {
      summary: '英星數位經濟協定 2022 年 6 月生效，是英國第一個 DEA、脫歐後數位貿易旗艦，新增法律科技合作、AI、數位身分等條款。',
      asOf: '2025-12', byTool: true,
    },
    indigo: {
      total: 0.64, raw: 18.0, max: 28, official: false,
      sourceNote: '研究文獻試算值（UKSDEA 18/28 ≈ 0.64）；非 OECD 官方分數',
      asOf: '2026-03',
    },
    sourceDocs: [
      { label: 'UK Gov — UK-Singapore Digital Economy Agreement', url: 'https://www.gov.uk/government/collections/uk-singapore-digital-economy-agreement', lang: 'en' },
    ],
  },

  'korea-singapore-dpa': {
    latestStatus: {
      summary: '韓星數位夥伴協定 2023 年 1 月生效，是韓國第一個 DEA，作為韓星 FTA 第 14 章的升級，涵蓋 AI、資料創新、金融科技、中小企業數位化。',
      asOf: '2025-12', byTool: true,
    },
    indigo: {
      total: 0.61, raw: 17.0, max: 28, official: false,
      sourceNote: '本工具依 OECD INDIGO-t 方法論粗估；非 OECD 官方分數。第二代 DEA，E 類覆蓋較完整。',
      domains: [
        { code: 'A', name: '促進電子商務', raw: 6.0, max: 7, score: 0.86 },
        { code: 'B', name: '開放性與電子商務', raw: 2.5, max: 5, score: 0.50 },
        { code: 'C', name: '信任與電子商務', raw: 5.0, max: 6, score: 0.83 },
        { code: 'D', name: '跨境資料流動與在地化', raw: 2.0, max: 2, score: 1.0 },
        { code: 'E', name: '廣義數位經濟議題', raw: 1.5, max: 8, score: 0.19, note: 'AI、金融科技、數位身分、標準與符合性評鑑納入' },
      ],
      asOf: '2026-05',
    },
    sourceDocs: [
      { label: '新加坡 MTI — KSDPA 官方頁面', url: 'https://www.mti.gov.sg/Trade/Digital-Economy-Agreements/The-Korea-Singapore-Digital-Partnership-Agreement', lang: 'en' },
    ],
  },

  // ── 主要現代大型協定（按最新進展補充；摘要為 AI 整理之公開資訊，byTool）──
  'cptpp': {
    latestStatus: {
      summary:
        'CPTPP 自 2018 年 12 月生效，現有 12 個締約方。英國為首個新加入成員，其加入議定書已於 2024 年 12 月 15 日對英國生效。中國、中華民國（臺灣）、烏克蘭、烏拉圭、哥斯大黎加等已提出加入申請；哥斯大黎加加入工作小組已於 2024 年成立並啟動審查。',
      detail:
        'CPTPP（跨太平洋夥伴全面進步協定）原 11 國於 2018 年 3 月於智利聖地牙哥簽署、同年 12 月 30 日對前 6 個完成國內批准的成員（墨西哥、日本、新加坡、紐西蘭、加拿大、澳洲）生效；越南於 2019 年 1 月、秘魯於 2021 年 9 月、馬來西亞於 2022 年 11 月、智利於 2023 年 2 月、汶萊於 2023 年 7 月生效。\n\n【內容】CPTPP 大致保留原 TPP 的 30 章架構，但「凍結」了 22 項主要由美國推動的條款（多為智財與投資爭端解決相關），其餘條款照常適用。其涵蓋貨品零關稅、服務、投資、數位貿易、勞動、環境、智財、國營事業等高標準規範，被視為亞太地區最具雄心的 FTA。\n\n【擴大】英國於 2021 年 2 月提交加入申請，2023 年 7 月簽署加入議定書，2024 年 12 月 15 日正式生效，成為首個非創始成員，締約方增至 12 國。\n\n【待審申請】依提出順序：中國（2021/9）、中華民國（臺灣）（2021/9）、厄瓜多（2021/12，後撤回）、哥斯大黎加（2022/8）、烏拉圭（2022）、烏克蘭（2023/5）。哥斯大黎加加入工作小組已於 2024 年成立並啟動實質審查，是英國之後最有可能率先進入加入談判的申請方。\n\n【加入機制】新成員加入須經全體現有 12 個締約方共識決，並完成「市場進入要約」（market access offer）談判，承諾達成 CPTPP 高標準。\n\n【我國地位】我國於 2021 年 9 月 22 日正式向 CPTPP 存放機構（紐西蘭）遞交加入申請，由經濟部負責統籌跨部會準備工作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'New Zealand MFAT — CPTPP（存放國官方頁面）', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/free-trade-agreements-in-force/cptpp', lang: 'en' },
      { label: 'UK DBT — CPTPP accession', url: 'https://www.gov.uk/government/collections/the-uks-accession-to-cptpp', lang: 'en' },
    ],
  },

  'rcep': {
    latestStatus: {
      summary:
        'RCEP（區域全面經濟夥伴協定）為全球最大自由貿易區，涵蓋 15 國、約全球 30% GDP 與人口。2020 年 11 月簽署，2022 年 1 月 1 日生效。菲律賓於 2023 年 6 月完成批准後，協定已對全部 15 個簽署國生效。',
      detail:
        'RCEP（Regional Comprehensive Economic Partnership）由東協 10 國與澳洲、中國、日本、韓國、紐西蘭共 15 國組成，2012 年啟動談判，2020 年 11 月 15 日由 15 國以視訊方式簽署。\n\n【生效時序】2022/1/1 對 10 個完成批准之成員（汶、柬、寮、新、泰、越；澳、中、日、紐）生效；2022/2/1 韓國生效；2022/3/18 馬來西亞生效；2023/1/2 印尼生效；2023/6/2 菲律賓生效。協定已對全部 15 個簽署國生效。\n\n【內容】共 20 章，採「逐步整合」模式：原東協與五個 FTA 夥伴間已有的雙邊 FTA 機制獲整合與簡化，使用單一原產地規則、共同關稅減讓表。終局關稅減讓幅度約 91%，並涵蓋服務、投資、電子商務、智慧財產等議題。\n\n【特色】(1) 中、日、韓三大東亞經濟體首度同處一個多邊 FTA；(2) 條款相對 CPTPP 較為彈性，未納入勞動、環境、國營事業等高標準章節；(3) 採取嚴格的累積規則，深化區域供應鏈。\n\n【印度退出】印度於 2019 年 11 月最後階段宣布退出（主因擔憂中國產品衝擊），協定保留印度未來加入的開放條款。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'RCEP 官方網站（秘書處）', url: 'https://rcepsec.org/', lang: 'en' },
      { label: 'ASEAN — RCEP', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' },
    ],
  },

  'usmca': {
    latestStatus: {
      summary:
        'USMCA（美墨加協定，取代 NAFTA）自 2020 年 7 月 1 日生效。依協定第 34.7 條，三國須於生效滿 6 年（2026 年 7 月）進行首次「聯合檢視」（joint review），決定是否延長 16 年效期；各方已於 2026 年展開檢視準備，並涉及關稅與汽車原產地規則等爭議。',
      detail:
        'USMCA（United States-Mexico-Canada Agreement，墨方稱 T-MEC，加方稱 CUSMA）於 2018 年 11 月 30 日簽署、2019 年 12 月經修訂議定書修改勞動與藥品條款後再簽，2020 年 7 月 1 日正式生效，全面取代運作 26 年的 NAFTA。\n\n【主要變動 vs NAFTA】\n(1) 汽車原產地規則大幅提高：北美原產比例由 62.5% 提高至 75%；新增 40-45% 須由時薪 ≥US$16 的勞工生產之「勞動價值含量」（LVC）規定，迫使汽車業遷回美墨北部。\n(2) 數位貿易章節（第 19 章）：禁止對電子傳輸課關稅、禁止強制揭露原始碼、確保跨境資料流動。\n(3) 勞動章節升格為正章（第 23 章）：可由獨立小組對個別工廠進行勞動權利執行（Rapid Response Mechanism）。\n(4) 加入「日落條款」（第 34.7 條）：16 年期限制、每 6 年聯合檢視；如未延展則於第 16 年屆滿。\n(5) 修訂投資人對地主國爭端解決（ISDS）：美加之間取消，墨方僅在特定部門保留。\n\n【2026 聯合檢視】首次檢視於 2026 年 7 月舉行，三方須評估是否延長 16 年效期。川普政府 2025 年起對加、墨課徵「芬太尼／邊境關稅」等措施，加上汽車原產地、農產品、能源等爭議，使檢視談判前景複雜化。',
      asOf: '2026-05', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — USMCA', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement', lang: 'en' },
    ],
  },

  'eu-japan-epa': {
    latestStatus: {
      summary:
        '歐日經濟夥伴協定 2019 年 2 月生效。雙方其後就跨境資料流動補充規範談判，《資料自由流動條款》（納入 EPA 的議定書）已於 2024 年 7 月生效，補足原協定未納入的資料流動承諾。',
      detail:
        '歐盟—日本經濟夥伴協定（EU-Japan EPA）於 2018 年 7 月 17 日簽署、2019 年 2 月 1 日生效，是雙方歷史上規模最大、最具雄心的 FTA，涵蓋約全球 1/3 GDP。\n\n【內容】消除約 99% 歐盟對日、97% 日本對歐關稅；歐盟對日方乳製品、葡萄酒等高度敏感品項分階段降稅，日本則開放歐盟農產與汽車市場。涵蓋 23 章，包含服務、投資、政府採購、智慧財產（含地理標示相互承認）、永續發展，並首度納入《巴黎協定》專條。\n\n【資料流動補充】原 EPA 未納入跨境資料流動承諾（因雙方均自 2019 年起以「個資充分性認定」相互承認）。雙方於 2022 年啟動補充談判，2023 年 10 月達成共識，《資料自由流動議定書》於 2024 年 7 月 1 日生效，正式納入禁止強制資料在地化、保障跨境資料流動等承諾。\n\n【意義】被視為自由貿易與多邊主義在保護主義浪潮中的指標性案例，相互承認個資充分性建立了 5 億人規模的「世界最大自由資料流通區」。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Japan EPA', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/japan/eu-japan-agreement_en', lang: 'en' },
    ],
  },

  'eu-uk-tca': {
    latestStatus: {
      summary:
        '歐盟—英國《貿易與合作協定》（TCA）於 2021 年 5 月 1 日正式生效（2021 年 1 月起暫時適用）。雙方於 2025 年起依協定檢視條款檢討執行情況，並就漁業、青年流動、衛生與植物防疫（SPS）等議題協商。',
      detail:
        'TCA 是英國脫歐後與歐盟新關係的核心法律基礎，於 2020 年 12 月 24 日達成、12 月 30 日簽署，自 2021 年 1 月 1 日起暫時適用，2021 年 5 月 1 日正式生效。\n\n【內容】TCA 是一份「零關稅、零配額」FTA，但伴隨深度監管脫鉤：\n- 第一部 通則與制度規定（共同治理機制：夥伴理事會、特別委員會、爭端解決）\n- 第二部 貿易、運輸、漁業（含七個貿易子編：貨品、服務/投資/數位、資本移動、智財、政府採購、競爭/補貼/稅務/勞動環境永續、透明化；獨立的航空、道路、社會安全協調、漁業章節）\n- 第三部 執法與司法合作（資料分享、引渡、刑事司法互助）\n- 第四部 主題合作（資料保護、衛生安全、網路安全）\n- 第五部 英國參與部分歐盟計畫（Horizon Europe、Copernicus 等）\n- 第六部 爭端解決與橫向條款\n- 第七部 最終規定\n\n【特殊機制】「再平衡條款」（rebalancing mechanism）：若一方在勞動、環境、補貼等領域大幅放鬆規管致顯著影響貿易，他方得採取補償措施。\n\n【2025–2026 檢視】依第 776 條，協定每 5 年進行檢視（首次 2026 年）。當前正進行的關鍵協商：(1) 漁業：2021–2026 年漁獲量過渡安排於 2026 年屆滿；(2) 食品 SPS 協定（讓英國農產品恢復對歐盟順暢出口）；(3) 青年流動方案；(4) 學生與專業資格相互承認。\n\n【北愛爾蘭】TCA 不涵蓋北愛爾蘭特殊安排，後者由 2023 年《溫莎架構》（Windsor Framework）處理。',
      asOf: '2026-05', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-UK TCA', url: 'https://commission.europa.eu/strategy-and-policy/relations-non-eu-countries/relations-united-kingdom/eu-uk-trade-and-cooperation-agreement_en', lang: 'en' },
    ],
  },

  'eu-mercosur': {
    latestStatus: {
      summary:
        '歐盟與南方共同市場（Mercosur）歷經逾 25 年談判，於 2024 年 12 月 6 日宣布完成政治協議，將形成涵蓋逾 7 億人口的大型自由貿易區。協定尚待法律文本整理（legal scrubbing）、翻譯，並經歐盟理事會、歐洲議會及各國批准方能生效；歐洲部分國家（如法國）與農業團體仍有反對聲浪。',
      detail:
        '歐盟—Mercosur 協定談判始於 1999 年，原於 2019 年 6 月達成「原則性協議」（agreement in principle），但因環境（亞馬遜雨林、Bolsonaro 政府）與農業反對而未推進。2024 年 12 月 6 日，歐盟執委會主席 von der Leyen 親赴蒙特維多 Mercosur 高峰會，與 4 個 Mercosur 創始國（阿、巴、巴、烏）正式宣布完成談判。\n\n【規模】涵蓋 7.18 億人口、約全球 20% GDP，是歐盟史上最大的 FTA，也是 Mercosur 對外簽署的最大協定。\n\n【內容】將消除約 91% Mercosur 對歐盟進口、92% 歐盟對 Mercosur 進口的關稅，涵蓋貨品、服務、政府採購、永續發展（含《巴黎協定》條款）、地理標示等。歐盟對敏感農產品（牛肉、家禽、糖、乙醇）設配額，對汽車保留 18 年過渡期。新增「再平衡機制」（rebalancing mechanism），允許 Mercosur 在歐盟新法規（如 CBAM 碳邊境調整、EUDR 反森林砍伐法）對其產品產生重大不利影響時要求協商。\n\n【批准前景】法國（馬克宏政府）公開反對，主因國內農民抗議；波蘭、義大利、奧地利、愛爾蘭亦持保留態度。執委會可能採「分拆」策略，將純貿易部分以「歐盟專屬權限」協定處理，僅需歐盟理事會合格多數與歐洲議會通過；投資與政治對話部分另立「混合協定」需所有 27 國批准。預計 2025–2026 進入批准程序。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Mercosur', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/mercosur/eu-mercosur-agreement_en', lang: 'en' },
    ],
  },

  'uk-india': {
    latestStatus: {
      summary:
        '英印《全面經濟貿易協定》（CETA）歷經逾 3 年、14 輪談判，於 2025 年 5 月 6 日宣布達成協議，並於 2025 年 7 月 24 日正式簽署。協定涵蓋貨品關稅大幅削減（英國威士忌、汽車；印度紡織、成衣）、服務與專業人員流動，尚待雙方國內批准後生效。',
      detail:
        '英印《全面經濟貿易協定》（UK-India CETA，部分英方文件亦稱為 FTA）於 2022 年 1 月啟動談判，歷經逾 3 年、14 輪，期間經歷英方 4 任首相（Johnson、Truss、Sunak、Starmer）與印方 Modi 政府的接續推動。\n\n【關鍵里程碑】\n  - 2022/1：英相 Johnson 訪印啟動談判\n  - 2024/7：英國工黨上台後重啟，由 Starmer 政府主導\n  - 2025/5/6：英印共同宣布達成協議\n  - 2025/7/24：英相 Starmer 於倫敦正式簽署（印方由 Modi 訪英共同見證）\n  - 2025–2026：雙方完成國內批准程序後生效\n\n【主要內容】\n(1) 印度將對 85% 英國商品（按種類計）降稅，包含威士忌與琴酒關稅由 150% 降至 75%（即時）並於 10 年內降至 40%；汽車關稅由 100%+ 階段性降至 10%（配額制）；化妝品、醫療器材、巧克力等。\n(2) 英國將對 99% 印度進口降至零關稅，主要受益為紡織、成衣、皮革、海產、寶石珠寶。\n(3) 服務：擴大印度專業人員（IT、廚師、瑜珈師等）赴英短期工作之雙重社安豁免（Double Contribution Convention）。\n(4) 投資：未納入完整投資保護章節，將另立《雙邊投資條約》（BIT）。\n\n【經濟意義】英方預期增加 GDP 每年約 48 億英鎊，雙邊貿易增加約 255 億英鎊；印方預期擴大對英製造品出口、提升「印度製造」品牌。為印度近年最大規模 FTA 之一，僅次於印度—阿聯 CEPA。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'UK DBT — UK-India trade deal', url: 'https://www.gov.uk/government/collections/uk-india-free-trade-agreement', lang: 'en' },
    ],
  },

  'india-uae': {
    latestStatus: {
      summary:
        '印度—阿聯《全面經濟夥伴協定》（CEPA）於 2022 年 2 月簽署、同年 5 月 1 日生效，是印度近年首個全面性 FTA，目標將雙邊非石油貿易大幅提升，協定持續運作中。',
      detail:
        '印度—阿聯 CEPA 從 2021 年 9 月啟動談判，僅 88 天即達成共識，於 2022 年 2 月 18 日簽署、5 月 1 日生效，創下印度 FTA 談判最快紀錄。\n\n【關稅減讓】阿聯對 90% 印度進口（按品項）即時降至零關稅，5 年內擴展至 99%；印度對 65% 阿聯進口即時降稅，10 年內覆蓋 90%。重點受惠品項：印度寶石珠寶、紡織、皮革、藥品、農產品；阿聯石化、鋁、銅、椰棗。\n\n【服務與專業人員】涵蓋 110+ 服務子部門，並對印度專業人員（IT、護理、會計、建築）放寬簽證安排。\n\n【數位與電子商務】納入電子商務、跨境資料流動、消費者保護條款。\n\n【經濟成果】2024 年雙邊非石油貿易達 575 億美元（YoY +15%），達成「5 年內 1,000 億美元非石油貿易」目標進度過半。CEPA 帶動印度黃金珠寶對阿聯出口大幅成長，並推動印度成為阿聯第 2 大貿易夥伴。\n\n【意義】此為印度自 2014 年 Modi 政府上任以來簽署的首個重大 FTA，扭轉印度長期消極 FTA 策略，並啟動後續印澳 ECTA（2022）、印阿曼 CEPA（談判中）、印英 CETA（2025）等系列協定。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'India Ministry of Commerce — India-UAE CEPA', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' },
    ],
  },

  'afcfta': {
    latestStatus: {
      summary:
        '非洲大陸自由貿易區（AfCFTA）協定 2019 年生效，2021 年 1 月 1 日正式啟動貿易，為涵蓋 54 個非洲國家、約 14 億人口的全球成員數最多自由貿易區。「引導貿易倡議」（Guided Trade Initiative）持續擴大參與國與品項，逐步落實零關稅貿易。',
      detail:
        'AfCFTA 由非洲聯盟（AU）54 個成員國（厄利垂亞除外）於 2018 年 3 月在盧安達 Kigali 簽署，2019 年 5 月達到 22 國批准門檻而生效，2021 年 1 月 1 日正式啟動貿易。秘書處設於迦納阿克拉。\n\n【規模】涵蓋 14 億人口、約 3.4 兆美元 GDP，目標於 2035 年前將非洲區內貿易比重由 15% 提高至 30% 以上。\n\n【架構】「主協定 + 多個議定書」模式，分階段談判：\n  第一階段：貨品貿易、服務貿易、爭端解決（已通過）\n  第二階段：投資、智財、競爭政策、數位貿易、婦女青年（陸續通過）\n  第三階段：未來擴充議題\n\n【關鍵里程碑】\n  - 2022/10：啟動「引導貿易倡議」（Guided Trade Initiative，GTI）試行；首批 7 個國家、96 項產品。\n  - 2024/2：第 37 屆 AU 高峰會通過《數位貿易議定書》與《婦女與青年於貿易中之地位議定書》。\n  - 2024–2025：GTI 擴大至約 30 國，涵蓋紡織、農產、化工、汽車零件等。\n\n【關稅減讓】90% 商品於 5–10 年內降至零關稅（敏感商品 7%、可保護商品 3%）；最不發達國家享延長期限。\n\n【挑戰】貿易便捷化（海關、運輸）、規則一致性、付款結算（PAPSS 泛非洲支付系統 2022 年啟用）、與既有區域組織（COMESA、ECOWAS、EAC、SADC）的關係協調。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'AfCFTA Secretariat', url: 'https://au-afcfta.org/', lang: 'en' },
    ],
  },

  'depa': {
    latestStatus: {
      summary:
        'DEPA（數位經濟夥伴協定）由新加坡、智利、紐西蘭發起，2021 年 1 月生效，採模組化設計。韓國加入議定書已生效，成為首個新加入成員；中國、加拿大、哥斯大黎加、秘魯、阿聯等相繼提出加入申請並進行審查。',
      detail:
        'DEPA（Digital Economy Partnership Agreement）由新加坡、智利、紐西蘭於 2020 年 6 月簽署，2021 年 1 月 7 日對首批兩成員（新、紐）生效、2021 年 11 月對智利生效。\n\n【模組化設計】DEPA 拋棄傳統 FTA 一次性整套加入模式，改採 16 個獨立「模組」（modules），新成員加入時可以「全採」或「選採」方式參與。此設計影響了後續 ASEAN DEFA、英星 DEA、韓星 DPA 等協定的草擬。\n\n【加入進度】\n  - 2021/11：中國申請加入（首個非創始申請方）\n  - 2022/5：韓國申請加入；2024/2 加入議定書簽署、2024/8 對韓生效\n  - 2022/5：加拿大申請加入；工作小組 2023 成立\n  - 2022/8：哥斯大黎加申請加入；工作小組 2023 成立\n  - 2024：秘魯、阿聯（UAE）提出加入意向\n\n【特色議題】(1) 16 個模組涵蓋從傳統電商便捷化到 AI 治理、數位身分、政府開放資料、Fintech 沙盒等；(2) 模組 8「數位經濟創新合作」設立「實驗法規沙盒」機制；(3) 模組 7 為全球首個 FTA 級 AI 章節，奠定後續 ASEAN DEFA、英星 DEA AI 條款基礎。\n\n【意義】DEPA 為全球第一個專門的「數位 only」貿易協定，其模組化加入機制有效避開了傳統 FTA 全包式談判的政治阻力，被學界視為「下一代」數位通商規則制定的範本。',
      asOf: '2025-12', byTool: true,
    },
    indigo: {
      total: 0.64, raw: 18.0, max: 28, official: false,
      sourceNote: '本工具依 OECD INDIGO-t 方法論粗估；非 OECD 官方分數。模組化設計，E 類新興議題（AI、金融科技、數位身分）覆蓋完整。',
      domains: [
        { code: 'A', name: '促進電子商務', raw: 6.0, max: 7, score: 0.86 },
        { code: 'B', name: '開放性與電子商務', raw: 2.5, max: 5, score: 0.50 },
        { code: 'C', name: '信任與電子商務', raw: 5.5, max: 6, score: 0.92 },
        { code: 'D', name: '跨境資料流動與在地化', raw: 2.0, max: 2, score: 1.0 },
        { code: 'E', name: '廣義數位經濟議題', raw: 2.0, max: 8, score: 0.25, note: 'AI、金融科技、數位身分、數位包容等模組納入' },
      ],
      asOf: '2026-05',
    },
    sourceDocs: [
      { label: 'New Zealand MFAT — DEPA', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/free-trade-agreements-concluded-but-not-in-force/digital-economy-partnership-agreement-depa', lang: 'en' },
    ],
  },

  'asean-defa': {
    latestStatus: {
      summary:
        'ASEAN 數位經濟架構協定（DEFA）為全球首個區域性數位經濟協定，2023 年 9 月啟動談判。ASEAN 領袖於 2025 年 5 月第 46 屆東協高峰會宣布實質完成（substantial conclusion）談判，目標於 2025 年內簽署，預估可使東協數位經濟規模倍增。',
      detail:
        'DEFA 是 ASEAN 為因應數位經濟快速擴張、補足 RCEP 電子商務章節之不足而發起的區域協定，由東協 10 個成員國組成。\n\n【啟動】2023 年 9 月第 43 屆東協高峰會（雅加達）正式啟動談判，目標 2025 年完成。\n\n【實質完成】2025 年 5 月第 46 屆東協高峰會（吉隆坡）宣布實質完成（substantial conclusion），目標於 2025 年底前簽署。\n\n【涵蓋範圍】依公開草案，17 章涵蓋：\n- 基礎：數位貿易便捷化（無紙化貿易、電子發票、電子簽章）、跨境電子商務、電子支付\n- 信任：跨境資料流動與資料保護、網路安全、數位身分、線上消費者保護\n- 新興技術：人工智慧、新興主題（綠色數位、金融科技、政府資料等）\n- 包容：人才能力建構與數位技能、數位包容（中小企業、婦女、青年）\n- 制度：競爭政策、透明化與良好法規實務、機構規定、爭端解決、最終規定\n\n【經濟影響】麥肯錫等研究預估 DEFA 完整實施可使東協數位經濟規模由 1 兆美元成長至 2 兆美元（2030 年）。\n\n【意義】此為全球首個涵蓋此議題範圍的「區域級」數位經濟協定，較 DEPA 的「模組化加入」模式更接近傳統 FTA 的拘束力。',
      asOf: '2025-12', byTool: true,
    },
    indigo: {
      total: 0.66, raw: 18.5, max: 28, official: false,
      sourceNote: '本工具依 OECD INDIGO-t 方法論粗估（依公開草案章節結構）；非 OECD 官方分數',
      domains: [
        { code: 'A', name: '促進電子商務', raw: 6.0, max: 7, score: 0.86, note: '電子簽章、電子發票、無紙化貿易、電子支付完整納入' },
        { code: 'B', name: '開放性與電子商務', raw: 2.5, max: 5, score: 0.50 },
        { code: 'C', name: '信任與電子商務', raw: 5.5, max: 6, score: 0.92, note: '消費者保護、個資、網安、加密章節完整' },
        { code: 'D', name: '跨境資料流動與在地化', raw: 2.0, max: 2, score: 1.0 },
        { code: 'E', name: '廣義數位經濟議題', raw: 2.5, max: 8, score: 0.31, note: 'AI、數位身分、金融科技、數位包容、人才能力等新興議題模組' },
      ],
      asOf: '2025-12',
    },
    sourceDocs: [
      { label: 'ASEAN — DEFA', url: 'https://asean.org/our-communities/economic-community/', lang: 'en' },
    ],
  },

  // 子協定：CPTPP 擴員申請（屬 CPTPP 之延伸事項）
  'cptpp-expansion': {
    latestStatus: {
      summary:
        'CPTPP 擴員程序：英國加入議定書已於 2024 年 12 月 15 日生效。截至 2025 年底，已提出加入申請者包含中國、中華民國（臺灣）、烏拉圭、烏克蘭、哥斯大黎加；哥斯大黎加加入工作小組已於 2024 年成立並啟動審查程序。新成員加入須經全體現有 12 個締約方共識決。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'New Zealand MFAT — CPTPP accession', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/free-trade-agreements-in-force/cptpp/cptpp-accessions', lang: 'en' },
    ],
  },

  // 子協定：WT/GC/283 電子傳輸關稅暫免聯合聲明（JSI 內的臨時安排）
  'wt-gc-283-moratorium': {
    latestStatus: {
      summary:
        'WTO 第 14 屆部長會議（MC14，2026/3）未能完成電子傳輸關稅暫免（moratorium）的延續，該措施於 2026 年 3 月底依期失效。2026 年 4 月 1 日，包含我國在內 23 個 WTO 成員聯合提交《電子傳輸暫免課徵關稅聯合聲明》（WT/GC/283），以複邊臨時措施維持簽署成員間不對電子傳輸課徵關稅之做法，效期至下次總理事會會議召開為止。',
      asOf: '2026-04', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO Documents Online — WT/GC/283', url: 'https://docs.wto.org/', lang: 'en' },
    ],
  },

  // ── 多邊協定 / GATT-WTO 體系（最新狀態為 AI 整理，byTool）──
  'gatt-1947': {
    latestStatus: {
      summary:
        '《關稅暨貿易總協定》（GATT 1947）於 1947 年 10 月簽署、1948 年 1 月生效，主導戰後多邊貿易自由化達 47 年、共 8 個談判回合。1995 年世界貿易組織（WTO）成立後，GATT 1947 由「GATT 1994」併入 WTO 法律架構繼續適用，原臨時性的 GATT 組織則走入歷史。',
      detail:
        '《關稅暨貿易總協定》（General Agreement on Tariffs and Trade，GATT 1947）由 23 個原始締約方於 1947 年 10 月 30 日在日內瓦簽署，1948 年 1 月 1 日以「臨時適用議定書」方式生效。\n\n【背景】二戰結束後，國際社會原計畫建立「國際貿易組織」（ITO）作為布雷頓森林體系的三大支柱之一（與 IMF、世界銀行並列）。1948 年《哈瓦那憲章》雖簽署，但美國國會拒絕批准，ITO 胎死腹中；原本作為 ITO 一部分的關稅減讓談判結果，即 GATT 1947，遂以「臨時協定」方式運作，並逐步發展成事實上的多邊貿易組織。\n\n【主要原則】\n(1) 最惠國待遇（MFN，第 1 條）：對某一締約方之關稅優惠須一體適用於所有締約方\n(2) 國民待遇（NT，第 3 條）：進口品在內地稅與規制上不得受劣於國產品之待遇\n(3) 約束關稅（第 2 條）：締約方承諾不超過減讓表所列稅率\n(4) 數量限制之普遍禁止（第 11 條）\n(5) 例外：第 20 條（一般例外）、第 21 條（安全例外）、第 24 條（區域貿易協定例外）\n\n【八個談判回合】1947 日內瓦、1949 安錫、1951 托基、1956 日內瓦、1960–61 狄龍、1964–67 甘迺迪、1973–79 東京、1986–94 烏拉圭。前 5 回合以雙邊關稅減讓互換為主，第 6 回合起引入線性削減與規則談判。\n\n【締約方數變化】23（1948）→ 33（1960）→ 102（1986）→ 128（1994）。\n\n【併入 WTO】1995 年 WTO 成立，GATT 1947 之原則與條款以「GATT 1994」名義納入 WTO 附件 1A，繼續作為貨品貿易規則的基礎；原臨時性「締約方全體」（CONTRACTING PARTIES）機制走入歷史，由 WTO 部長會議與總理事會取代。\n\n【歷史意義】GATT 1947 與後來的 WTO 體系共同推動戰後全球工業品平均關稅由 1947 年約 22% 降至今日約 5% 以下，為二戰後全球經濟成長與貿易爆發性擴張的核心制度基礎。',
      asOf: '1995-01', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO — The GATT years: from Havana to Marrakesh', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact4_e.htm', lang: 'en' },
    ],
  },
  'kennedy-round': {
    latestStatus: {
      summary:
        'GATT 第 6 回合（甘迺迪回合，1964–1967）談判完成，工業國家關稅平均削減約三分之一，並首度通過《反傾銷協定》。其成果已永久併入後續 GATT/WTO 體系。',
      detail:
        'GATT 第 6 回合稱為「甘迺迪回合」（Kennedy Round），因美國總統甘迺迪 1962 年提議啟動而得名。1964 年 5 月正式於日內瓦展開，1967 年 6 月完成，歷時 3 年，共 66 個締約方參與。\n\n【背景】(1) EEC（歐洲經濟共同體）1957 年成立並於 1968 年完成關稅同盟，引發美國關切；(2) 美國通過《1962 年貿易擴展法》（Trade Expansion Act），授權總統大幅降稅以「線性削減」方式回應；(3) 國際社會對突破前 5 回合「項目對項目」談判方式形成共識。\n\n【主要成果】\n(1) 工業品關稅平均削減 35%（按品項數加權）；\n(2) 共削減關稅約 400 億美元商品（當時規模）；\n(3) 首度通過《反傾銷協定》（Anti-Dumping Code）— GATT 體系下首份「規約」（Code）；\n(4) 通過《化學品協定》、《美國銷售價格制度》（American Selling Price, ASP）廢除；\n(5) 確認「最不發達國家特殊待遇」原則。\n\n【限制】(1) 農業議題僅有有限成果，主要受 EEC 共同農業政策（CAP）阻礙；(2) 服務、智財、投資等新興議題未納入；(3) 非關稅障礙處理有限。\n\n【歷史意義】甘迺迪回合為「線性削減」首例，成為後續東京、烏拉圭回合的範本；其首部「規約」格式（締約方自願加入的子協定）為烏拉圭回合「複邊協定」與後來 JSI 鋪路。',
      asOf: '1967-06', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO — Understanding the WTO: The GATT years', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact4_e.htm', lang: 'en' },
    ],
  },
  'tokyo-round': {
    latestStatus: {
      summary:
        'GATT 第 7 回合（東京回合，1973–1979）談判完成，首次系統性處理非關稅障礙，通過補貼、技術性貿易障礙、政府採購等多項「規約」（Codes）。成果延續於 WTO 多邊規則中。',
      detail:
        'GATT 第 7 回合「東京回合」（Tokyo Round）於 1973 年 9 月東京部長會議啟動，1979 年 11 月日內瓦完成，歷時 6 年，共 102 個締約方參與，是甘迺迪回合後規模更大、議題更複雜的回合。\n\n【背景】(1) 1971 年布雷頓森林體系崩潰、1973 年石油危機，自由貿易體系面臨壓力；(2) 美方《1974 年貿易法》提供新一輪降稅授權；(3) 非關稅障礙日益取代關稅成為主要貿易障礙；(4) 開發中國家在 GATT 中聲量提升，要求「特殊與差別待遇」（S&D）。\n\n【主要成果】\n(1) 工業品關稅再削減約三分之一（涉約 1,250 億美元商品）；\n(2) 通過 9 個「規約」（Codes）：補貼與平衡稅、技術性貿易障礙（TBT）、反傾銷、政府採購、海關估價、輸入許可程序、肉類、乳製品、民用航空器；\n(3) 通過「授權條款」（Enabling Clause）：賦予開發中國家「特殊與差別待遇」（如 GSP）法律基礎；\n(4) 確認「逐步演進」型補貼定義與救濟機制。\n\n【規約限制】(1) 規約採「選擇性加入」（plurilateral），開發中國家多未加入，造成「兩層 GATT」現象；(2) 此「片段化」結構於烏拉圭回合改為「單一承諾」（single undertaking）統合解決，但其精神在 WTO 體系外亦被當代 JSI 復現。\n\n【歷史意義】東京回合首度全面處理非關稅障礙，奠定當代 WTO 規則體系的雛形；「規約」模式雖被「單一承諾」取代，但其複邊化精神後在 ITA、WTO 政府採購協定（GPA）、近年 JSI 復現，影響當代 WTO 體系演進。',
      asOf: '1979-11', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO — The GATT years', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact4_e.htm', lang: 'en' },
    ],
  },
  'uruguay-round': {
    latestStatus: {
      summary:
        'GATT 第 8 回合（烏拉圭回合，1986–1994）是規模最大的多邊貿易談判，1994 年 4 月於馬拉喀什簽署最終文件，催生世界貿易組織（WTO），並將服務貿易（GATS）、智慧財產權（TRIPS）納入體系、建立具拘束力的爭端解決機制。1995 年 1 月 1 日 WTO 正式運作。',
      detail:
        '烏拉圭回合（Uruguay Round）於 1986 年 9 月在烏拉圭東岬城（Punta del Este）啟動，原訂 4 年完成，因農業補貼、智財權、服務業等議題複雜化而延至 1994 年。\n\n【主要成果】\n(1) 創立世界貿易組織（WTO）：取代僅為「臨時協定」的 GATT 秘書處，成為具國際法人地位的正式國際組織。\n(2) GATT 1994：在原 GATT 1947 基礎上更新，併入 WTO 法律架構。\n(3) 服務貿易總協定（GATS）：首度建立服務業多邊規則，涵蓋金融、電信、海運、專業服務等。\n(4) 與貿易有關之智慧財產權協定（TRIPS）：建立全球最低智財保護標準（專利、商標、著作權、地理標示）。\n(5) 具拘束力的爭端解決機制（DSU）：取代過去的共識決機制，建立 WTO 爭端解決小組與上訴機構。\n(6) 農業協定：首度將農業補貼納入規範。\n(7) 紡織品與成衣協定（ATC）：將紡織品配額制度（MFA）於 10 年內逐步取消。\n\n【部長宣言與簽署】1994 年 4 月 15 日，125 個參與方於摩洛哥馬拉喀什簽署最終文件（Final Act），共 28 個協定與超過 25,000 頁減讓表。\n\n【歷史地位】是 GATT 體系最後一回合，亦是 WTO 成立的法律基礎；其後啟動的杜哈回合（2001）未能完成，烏拉圭回合至今仍是多邊貿易體系最後一次「完整」回合。',
      asOf: '1995-01', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO — The Uruguay Round', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact5_e.htm', lang: 'en' },
    ],
  },
  'wto': {
    latestStatus: {
      summary:
        '世界貿易組織（WTO）自 1995 年運作至今，為全球多邊貿易體系核心。近年面臨改革壓力：上訴機構（Appellate Body）因美國自 2019 年起阻擋法官任命而停擺，爭端解決上訴功能癱瘓；第 13 屆部長會議（MC13，2024 年 2 月於阿布達比）就漁業補貼、電子商務等議題進展有限。第 14 屆部長會議（MC14，2026 年 3 月於喀麥隆雅溫德）亦未能完成電子傳輸關稅暫免之延續。',
      detail:
        'WTO 由烏拉圭回合於 1995 年 1 月 1 日成立，管理 GATT（貨品）、GATS（服務）、TRIPS（智財）三大支柱並提供爭端解決機制，現有逾 160 個會員。\n\n【爭端解決危機】上訴機構自 2019 年 12 月起因美國持續阻擋新法官任命而無法運作，導致「上訴入虛空」（appeal into the void）問題；部分會員以「多方臨時上訴仲裁安排」（MPIA）作為替代。\n\n【部長會議】MC12（2022）達成漁業補貼協定等成果；MC13（2024 阿布達比）延續電子傳輸關稅暫免至 MC14；MC14（2026 雅溫德）未能完成 moratorium 延續，該措施於 2026 年 3 月底依期失效，惟同會議通過《電子商務協定過渡性安排宣言》。\n\n【我國地位】我國以「臺灣、澎湖、金門及馬祖個別關稅領域」名義於 2002 年 1 月 1 日成為 WTO 會員。',
      asOf: '2026-04', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO 官方網站', url: 'https://www.wto.org/', lang: 'en' },
      { label: '經濟部國際貿易署 — WTO', url: 'https://www.trade.gov.tw/', lang: 'zh' },
    ],
  },
  'china-wto': {
    latestStatus: {
      summary:
        '中國於 2001 年 12 月 11 日正式加入 WTO，為全球貿易格局帶來結構性影響。其加入議定書中部分「非市場經濟」條款與履約爭議至今仍是美中及歐中貿易摩擦的焦點，相關過渡條款多已屆期。',
      detail:
        '中國於 1986 年 7 月正式申請恢復 GATT 締約方地位，經 15 年談判，2001 年 11 月 11 日於杜哈第 4 屆部長會議獲准入會，同年 12 月 11 日正式成為 WTO 第 143 個會員。\n\n【主要承諾】\n(1) 工業品平均關稅由 24.6% 降至 9.4%（2010 完成）；\n(2) 農產品平均關稅由 31% 降至 15%；\n(3) 服務業開放 9 大類 100 個子部門，涵蓋電信、金融、保險、分銷、專業服務；\n(4) 取消所有出口補貼（FIE 外資企業除外的過渡安排）；\n(5) 開放外貿經營權；\n(6) 加強智財權保護（TRIPS-plus 承諾）；\n(7) 接受「過渡性審查機制」（TRM），WTO 每年檢視其履約。\n\n【「非市場經濟」條款】加入議定書第 15 條規定，其他 WTO 會員於對中國反傾銷案中得使用「替代國」價格計算，此條款 15 年期屆滿於 2016 年 12 月 11 日。中國主張其後自動取得「市場經濟地位」（MES），美、歐、日均不承認，引發 2016–2019 年 WTO 訴訟（DS515、DS516），中國於 2019 年自行撤回訴訟。\n\n【影響與爭議】\n(1) 中國成為「世界工廠」，2009 年取代德國成為全球最大貨品出口國；\n(2) 美國「中國衝擊」（China Shock）研究估計約 240 萬美國製造業職位流失；\n(3) 美歐持續批評中國未充分履行國有企業、強迫技轉、補貼透明化等承諾；\n(4) 2018–2020 年川普關稅戰、2024–2025 年 IRA 補貼戰、CBAM 碳邊境機制，被視為對中國 WTO 承諾未完全落實的單邊回應。\n\n【我國加入順序】中國加入後一天，2002 年 1 月 1 日，我國以「臺灣、澎湖、金門及馬祖個別關稅領域」（TPKM）名義成為 WTO 第 144 個會員。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO — China and the WTO', url: 'https://www.wto.org/english/thewto_e/countries_e/china_e.htm', lang: 'en' },
    ],
  },
  'doha-round': {
    latestStatus: {
      summary:
        '杜哈發展議程（Doha Round）於 2001 年啟動，原以開發中國家發展為核心，但因農業補貼、市場開放等南北分歧長期僵持，自 2008 年談判破裂後實質停滯。WTO 已轉向以複邊（plurilateral）與議題式倡議（如電子商務 JSI）推進，整體單一回合模式被視為已難重啟。',
      detail:
        '杜哈發展議程（Doha Development Agenda, DDA）於 2001 年 11 月卡達杜哈第 4 屆部長會議啟動，是 WTO 體系下唯一回合談判。原訂 2005 年完成，主題涵蓋農業、非農業市場進入（NAMA）、服務、TRIPS、貿易便捷化、爭端解決規則、開發中國家特殊待遇等。\n\n【主要分歧】美歐要求開發中國家開放工業品與服務市場、降低關稅、強化智財；以印度、巴西、南非為首的開發中國家陣營堅持先處理美歐農業補貼與棉花議題（西非「棉花四國」要求美方取消棉花補貼）。\n\n【關鍵失敗】\n  - 2003/9 坎昆部長會議破裂\n  - 2008/7 日內瓦小型部長會議「迷你套案」失敗\n  - 2011 第 8 屆部長會議僅就「最不發達國家」議題達成有限共識\n\n【碎片化收割】DDA 整體無法完成，但部分子議題單獨成功：\n  - 2013 峇里部長會議：通過《貿易便捷化協定》（TFA），2017 年生效，是 WTO 自成立以來首個多邊新協定\n  - 2015 奈洛比部長會議：通過廢除農業出口補貼\n  - 2022 第 12 屆部長會議：通過《漁業補貼協定》（部分）\n  - 2024 第 13 屆部長會議：通過「服務貿易國內規章」協定（複邊 JSI）\n\n【模式轉變】DDA 困局促使 WTO 走向「複邊」（plurilateral）與「議題式聯合聲明倡議」（JSI）：電子商務 JSI、投資便捷化 JSI、服務國內規章 JSI、性別與貿易非正式工作小組。實質上意味著「單一承諾」（single undertaking）回合模式已被放棄。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'WTO — The Doha Round', url: 'https://www.wto.org/english/tratop_e/dda_e/dda_e.htm', lang: 'en' },
    ],
  },
  'apec-1989': {
    latestStatus: {
      summary:
        '亞太經濟合作會議（APEC）為 21 個環太平洋經濟體組成的論壇型組織，以非拘束性方式推動區域貿易與投資自由化。1994 年「茂物目標」屆期後，2020 年通過「布特拉加亞願景 2040」（Putrajaya Vision 2040），持續以年度領袖會議與部長會議運作。我國以「中華臺北」名義參與。',
      detail:
        'APEC（Asia-Pacific Economic Cooperation）由澳洲總理 Bob Hawke 倡議，於 1989 年 11 月在坎培拉首次部長會議成立，原為 12 個經濟體（含我國 1991 年以「中華臺北」名義入會），現為 21 個經濟體，涵蓋全球約 60% GDP、48% 貿易量、38% 人口。\n\n【特殊性】(1) 採用「經濟體」（economy）而非「國家」用語，使我國得與中、港共同參與；(2) 決議採共識決（consensus）且為「非拘束性」（non-binding）；(3) 不設常設機構，僅在新加坡設秘書處（1993 起）。\n\n【目標演進】\n  - 1994 茂物宣言（Bogor Goals）：已開發成員於 2010、開發中成員於 2020 達成貿易投資自由化\n  - 2020 11/20 馬來西亞線上峰會通過「布特拉加亞願景 2040」（Putrajaya Vision 2040），三大支柱：貿易投資、創新與數位化、強韌且永續的成長\n  - 2021 起依《奧克蘭行動計畫》（Aotearoa Plan of Action）落實\n\n【近年峰會】\n  - 2022 曼谷（曼谷目標：BCG 經濟）\n  - 2023 舊金山（拜登與習近平會面）\n  - 2024 利馬（秘魯主辦）\n  - 2025 慶州（韓國主辦）\n  - 2026 中國主辦\n\n【我國參與】每年由總統指派代表出席領袖非正式會議，APEC 是我國少數能與美中等大國領袖代表同桌的高層級多邊平台。我國亦深度參與 APEC 工作小組（如 SCSC 標準合作、ECSG 電子商務）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'APEC 官方網站', url: 'https://www.apec.org/', lang: 'en' },
      { label: '外交部 — APEC', url: 'https://www.mofa.gov.tw/', lang: 'zh' },
    ],
  },
  'lome-convention': {
    latestStatus: {
      summary:
        '《洛梅公約》（1975–2000）為歐洲共同體與非洲、加勒比海及太平洋（ACP）國家間的發展與貿易合作架構，提供 ACP 產品單向優惠進入歐洲市場。2000 年由《科托努協定》取代。',
      detail:
        '《洛梅公約》（Lomé Convention）首版於 1975 年 2 月 28 日在多哥首都洛梅市簽署，原由歐洲共同體 9 國與 46 個 ACP（非洲、加勒比、太平洋）國家共同簽署，至公約終結時擴展至 71 個 ACP 國家。\n\n【公約版本】\n  - 洛梅 I（1975–1980）\n  - 洛梅 II（1980–1985）\n  - 洛梅 III（1985–1990）\n  - 洛梅 IV（1990–2000）：含 1995 年於模里西斯簽署的中期修訂\n\n【主要內容】(1) 貿易：ACP 產品（不含農業共同政策 CAP 產品）單向、不對等地免關稅進入歐洲共同體市場；CAP 產品另設特殊安排；(2) 商品穩定基金（STABEX）：協助 ACP 國家因應出口商品價格波動的衝擊；(3) 礦產業基金（SYSMIN）：穩定 ACP 礦產出口；(4) 歐洲發展基金（EDF）：援助 ACP 經社發展；(5) 政治對話：洛梅 IV 起新增人權、民主、法治條件。\n\n【為何被取代】WTO 1995 年成立後，洛梅式單向優惠被認為違反 GATT MFN 原則（雖獲 WTO「豁免」直到 2008 年）。歐盟與 ACP 同意改為對等的《經濟夥伴協定》（EPA）安排，因而催生 2000 年《科托努協定》。\n\n【歷史地位】洛梅公約是 20 世紀後半最大的南北合作架構，影響了「殖民後北方對南方援助」的模式設計；其對 ACP 國家的偏好制度也曾因「香蕉戰爭」（1993–2009 WTO 爭端）等案例成為國際貿易法重要判例素材。',
      asOf: '2000-06', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — ACP', url: 'https://international-partnerships.ec.europa.eu/countries/african-caribbean-and-pacific-countries_en', lang: 'en' },
    ],
  },
  'cotonou': {
    latestStatus: {
      summary:
        '《科托努協定》（Cotonou Agreement，2000 年簽署）為歐盟與 ACP 國家的全面夥伴協定，涵蓋發展合作、政治對話與貿易。協定於 2020 年到期後歷經多次延展，已由 2023 年簽署的《薩摩亞協定》接續取代。',
      detail:
        '《科托努協定》（Cotonou Agreement）於 2000 年 6 月 23 日在貝南科托努市簽署、2003 年 4 月生效，原為 20 年期協定（至 2020 年），其後因新協定談判延宕而延展至 2023 年。\n\n【三大支柱】(1) 政治對話：人權、民主、法治、良好治理（含「重要要素條款」第 9 條：嚴重違反可暫停合作）；(2) 發展合作：透過歐洲發展基金（EDF）支援經社發展；(3) 貿易：取代洛梅公約之單向優惠，改採對等的「經濟夥伴協定」（EPA）模式以符合 WTO 規範。\n\n【EPA 談判】2002 年起，歐盟與 ACP 國家以區域分組談判 7 個 EPA（西非、中非、東非、南部非洲、加勒比、太平洋等）。截至 2025 年：\n  - 已生效：CARIFORUM-EU EPA（2008）、東部與南部非洲（ESA）EPA、太平洋 EPA、加納/象牙海岸臨時 EPA 等\n  - 部分簽署但未完全生效：西非 EPA、南部非洲發展共同體（SADC）EPA\n  - 未完成：中非 EPA、東非共同體（EAC）EPA\n\n【繼承】因新協定談判（後稱「後科托努」）延宕，協定先後延展至 2021 年 11 月與 2023 年 6 月；2023 年 11 月 15 日在薩摩亞簽署的《薩摩亞協定》自 2024 年 1 月起暫時適用，正式接續科托努協定。\n\n【歷史意義】科托努協定為歐盟與 ACP（非洲、加勒比、太平洋 79 國）長達 23 年的關係制度基礎，並標誌著歐盟對 ACP 援助由單向優惠轉向「互惠、政治條件」的歷史轉折。',
      asOf: '2023-11', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — Post-Cotonou', url: 'https://international-partnerships.ec.europa.eu/policies/post-cotonou_en', lang: 'en' },
    ],
  },
  'samoa-agreement': {
    latestStatus: {
      summary:
        '《薩摩亞協定》（Samoa Agreement）為歐盟與非加太（OACPS）79 國的新夥伴架構，2023 年 11 月 15 日於薩摩亞簽署，2024 年 1 月 1 日起暫時適用，取代《科托努協定》。涵蓋永續發展、人權、和平安全、移民與貿易投資等六大優先領域。',
      detail:
        '《薩摩亞協定》正式名稱為《歐盟與其成員國、與 OACPS 國家組織之間之夥伴協定》（2023/11/15 於薩摩亞 Apia 簽署），是科托努協定的繼承文件，涵蓋歐盟 27 國與 OACPS（非加太國家組織）79 個成員國共 106 國、約 17 億人口，是全球最大的政治經濟夥伴架構。\n\n【架構創新】採「Common Foundation（共同基礎）+ 三份區域議定書」的階層化架構：\n  - 共同基礎：適用所有 106 國的價值與通則（人權、民主、永續發展、移民、和平安全）\n  - 非洲議定書：與非洲聯盟（AU）議程接軌\n  - 加勒比議定書：與 CARIFORUM/CARICOM 整合\n  - 太平洋議定書：與太平洋島國論壇（PIF）整合\n\n【6 大優先領域】(1) 人權、民主、治理；(2) 和平、安全、司法；(3) 人類與社會發展；(4) 包容性永續經濟成長與發展；(5) 環境永續與氣候變遷；(6) 移民與流動。\n\n【貿易條款】不直接規範雙邊貿易（這部分由各 EPA 處理），而是提供合作架構支持 EPA 實施。\n\n【批准進度】2023/11 簽署後採暫時適用（從 2024/1/1 起）。完全生效須經歐洲議會、OACPS 多數成員國國會批准。\n\n【匈牙利爭議】簽署當時匈牙利反對因移民條款而未在歐盟理事會表態，但歐盟採「分階段」處理，使協定得暫時適用；匈方反對至 2025 年仍未解除。',
      asOf: '2024-01', byTool: true,
    },
    sourceDocs: [
      { label: 'European Council — Samoa Agreement', url: 'https://www.consilium.europa.eu/en/policies/eu-acp-partnership-agreement/', lang: 'en' },
    ],
  },

  // ── 中國系雙邊 FTA（最新狀態為 AI 整理，byTool）──
  'china-asean': {
    latestStatus: {
      summary:
        '中國—東協自由貿易區（CAFTA）自 2010 年全面生效，是中國最早、規模最大的 FTA 之一。雙方「3.0 版」升級談判已於 2024 年實質完成，新增數位經濟、綠色經濟、供應鏈互聯等章節，並於 2025 年簽署升級議定書。',
      detail:
        '中國—東協自由貿易區（China-ASEAN FTA, CAFTA）是中國最早、規模最大的 FTA，分階段建構：\n  - 2002/11：簽署《全面經濟合作架構協定》\n  - 2004/11：《貨品貿易協定》簽署，2005/7 生效（先行降稅）\n  - 2007/1：《服務貿易協定》簽署，2007/7 生效\n  - 2009/8：《投資協定》簽署，2010/2 生效\n  - 2010/1/1：對東協 6 國（汶、印尼、馬、菲、新、泰）全面降稅至零；2015 對柬、寮、緬、越全面降稅\n  - 2015/11：「2.0 版」升級議定書簽署，2019 對全體成員生效\n  - 2022/11：啟動「3.0 版」升級談判\n  - 2024/10：3.0 版實質完成\n  - 2025/5：簽署 3.0 版升級議定書\n\n【3.0 版重點】新增 9 個領域章節：數位經濟（含跨境資料、電子發票、AI）、綠色經濟（再生能源、碳市場）、供應鏈互聯（無紙化通關、互通互聯）、競爭、消費者保護、中小企業、海關程序簡化、衛生與植物防疫，以及標準與符合性評鑑升級。\n\n【規模】CAFTA 涵蓋約 21 億人口、合計 GDP 約 24 兆美元，是全球最大的開發中國家 FTA。2024 年雙邊貿易達 9,824 億美元，中國連續 16 年為東協最大貿易夥伴，東協自 2020 年起為中國最大貿易夥伴。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'ASEAN — ASEAN-China FTA', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' },
    ],
  },
  'china-chile': {
    latestStatus: {
      summary:
        '中國—智利自由貿易協定 2006 年生效，是中國與拉美國家的首個 FTA；其後陸續完成服務貿易、投資補充協定，並於 2019 年再升級，協定持續運作。',
      detail:
        '中智 FTA 由 4 個階段建構：\n  - 主協定（貨品貿易）：2005 年 11 月 18 日於釜山 APEC 會議簽署、2006 年 10 月 1 日生效\n  - 《服務貿易補充協定》：2008 年 4 月簽署、2010 年 8 月生效\n  - 《投資補充協定》：2012 年 9 月簽署、2014 年 2 月生效\n  - 升級議定書：2017 年 11 月簽署、2019 年 3 月生效（新增電子商務、競爭、環境章節）\n\n【主要承諾】(1) 雙方對 97% 工業品 10 年內降至零；(2) 智利對中方逾 90% 農產品零關稅；(3) 服務開放：智方對中方教育、運輸、營造、醫療擴大開放，中方對智方法律、會計、銀行業擴大開放；(4) 投資保護含 ISDS。\n\n【經濟成果】2005 年雙邊貿易約 80 億美元，2024 年達 660 億美元（約 8 倍）；中國連續多年為智利最大貿易夥伴；智利對中方銅、農產（櫻桃、葡萄酒、海產）、漿紙出口大幅成長；中方對智方車輛、機械、紡織為主。\n\n【意義】(1) 中國首個與拉美國家的 FTA，為後續中-秘魯（2010）、中-哥斯大黎加（2011）、中-厄瓜多（2024）FTA 鋪路；(2) 智利透過此協定鞏固「拉美全球化樞紐」地位，與美、歐、CPTPP 並列。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'China FTA Network（中國自由貿易區服務網）', url: 'http://fta.mofcom.gov.cn/', lang: 'zh' },
    ],
  },
  'china-pakistan': {
    latestStatus: {
      summary:
        '中國—巴基斯坦自由貿易協定 2007 年生效，是中巴經濟走廊（CPEC）的重要制度基礎。第二階段議定書於 2019 年簽署、2020 年生效，進一步擴大零關稅產品範圍，協定持續運作。',
      detail:
        '中國—巴基斯坦自由貿易協定（China-Pakistan FTA）由兩階段組成：\n  - 第一階段（CPFTA-I）：2006 年 11 月簽署、2007 年 7 月 1 日生效\n  - 第二階段（CPFTA-II）：2019 年 4 月簽署、2020 年 1 月 1 日生效\n\n【主要承諾】\n  - CPFTA-I：雙方對 36% 工業品立即降至零、其餘分階段降稅；服務、投資另立補充協定（2009 簽）\n  - CPFTA-II：擴大零關稅產品範圍至 75%；簡化原產地規則；新增貿易救濟、海關合作；強化巴方安全防衛條款\n\n【與中巴經濟走廊（CPEC）的關係】\n  - CPEC 是「一帶一路」旗艦計畫，2015 年啟動，總投資承諾約 620 億美元，涵蓋瓜達爾港、能源、交通基礎建設\n  - CPFTA 為 CPEC 商品、服務、投資的制度基礎；中方對巴方投資與承包工程多透過 CPFTA-II 享受優惠關稅\n  - 巴方原料、紡織、農產品則經 CPFTA-II 進入中方市場\n\n【經濟成果】2007 雙邊貿易約 70 億美元，2024 年達 200 億美元，但雙邊貿易嚴重不平衡（中方順差約 145 億美元），巴方因外匯短缺對深化 FTA 有所保留。\n\n【挑戰】(1) 巴方安全狀況（俾路支斯坦攻擊事件）影響 CPEC 進度；(2) 巴方 IMF 紓困要求調整對中方債務償還條件；(3) CPFTA-III 談判 2022 啟動但因雙邊貿易不平衡與安全議題拖延。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'China FTA Network', url: 'http://fta.mofcom.gov.cn/', lang: 'zh' },
    ],
  },
  'china-nz': {
    latestStatus: {
      summary:
        '中國—紐西蘭自由貿易協定 2008 年生效，是中國與已開發國家的首個 FTA。升級議定書於 2021 年簽署、2022 年生效，擴大木材、乳製品等市場開放並納入電子商務、環境條款，協定持續運作。',
      detail:
        '中紐 FTA 於 2008 年 4 月 7 日簽署、同年 10 月 1 日生效，創下三項「第一」：(1) 中國與已開發國家的第一個 FTA；(2) 紐西蘭與亞洲國家的第一個 FTA；(3) 中國第一個全面性 FTA（涵蓋貨品、服務、投資）。\n\n【主要承諾】\n  - 中方：對紐方逾 96% 工業品 13 年內降至零；乳製品設過渡期至 2024 年（後完成）；\n  - 紐方：對中方所有貨品 1 日內降至零；\n  - 服務：紐方對中方開放教育、養老等領域；\n  - 投資：互設「投資人對地主國爭端解決」（ISDS）；\n  - 自然人移動：紐方對中方廚師、武術師、中醫師、中文教師等開放工作簽證。\n\n【升級議定書（2022/4 生效）】\n  - 新增章節：電子商務、政府採購、競爭、環境；\n  - 木材、紙製品自 2023 年起逐步降至零；\n  - 強化海關程序、原產地規則電子化；\n  - 升級服務貿易承諾。\n\n【經濟成果】2008 年雙邊貿易約 60 億紐元，2024 年達約 380 億紐元（6 倍以上）。中國連續多年為紐西蘭最大貿易夥伴；紐方乳製品（特別是嬰幼兒奶粉）、肉類、葡萄酒、教育、觀光主要受惠。\n\n【近年挑戰】(1) 2020–2021 紐方對華貿易高度依賴引發「過度集中」討論；(2) 紐西蘭工黨 Hipkins、國家黨 Luxon 兩屆政府均維持中紐 FTA 但加強「印太多元化」（CPTPP 升級、英紐 FTA、印紐談判）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'New Zealand MFAT — China FTA', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/free-trade-agreements-in-force/china-china-fta', lang: 'en' },
    ],
  },
  'china-korea': {
    latestStatus: {
      summary:
        '中國—韓國自由貿易協定 2015 年 12 月生效，為兩大東亞經濟體間的重要協定。第二階段（服務貿易與投資）談判持續進行中，目標進一步開放服務市場。',
      detail:
        '中韓 FTA 自 2012 年 5 月啟動談判，歷經 14 輪會談，2015 年 6 月 1 日簽署、同年 12 月 20 日生效。\n\n【第一階段內容】涵蓋貨品、服務、投資等 22 章。雙方承諾於 20 年內逐步消除約 90% 貨品關稅；服務業則以「正面表列」方式開放部分次部門。中方對韓國汽車、家電、化工品降稅；韓方對中國農產品、紡織品開放有限。\n\n【第二階段（服務與投資）】2018 年 3 月啟動第二階段服務貿易與投資負面表列談判，至 2023 年因雙方在金融、文化、視聽、雲端等敏感領域分歧而進度緩慢。2024 年雙邊重啟高層級磋商，韓方積極推動以負面表列方式擴大服務開放。\n\n【經濟成果】2024 年雙邊貿易額約 3,280 億美元，中國連續多年為韓國最大貿易夥伴；雙邊貿易自 2015 年生效以來平均年增約 5%。\n\n【地緣政治複雜性】中韓 FTA 受 THAAD 部署（2017）、半導體供應鏈重組（2022 起）、美韓晶片同盟等影響，第二階段談判進度與雙邊政治氛圍高度連動。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'China FTA Network', url: 'http://fta.mofcom.gov.cn/', lang: 'zh' },
    ],
  },
  'china-australia': {
    latestStatus: {
      summary:
        '中澳自由貿易協定（ChAFTA）2015 年 12 月生效。雖然 2020–2023 年間雙邊一度因政治緊張陷入貿易摩擦（中國對澳洲大麥、葡萄酒、煤炭等加徵關稅或設限），相關措施已於 2023–2024 年陸續解除，協定本身持續有效運作。',
      detail:
        '中澳自由貿易協定（ChAFTA）自 2005 年啟動談判，歷經 10 年、21 輪會談，2015 年 6 月 17 日簽署、12 月 20 日生效。\n\n【主要承諾】中方對澳洲約 95% 貨品最終達零關稅（5 年過渡期），含農產品（牛肉、乳製品、葡萄酒、海產）、礦業；澳方對中方所有貨品最終達零關稅。服務業以「正面表列」開放，含法律、金融、教育、醫療、觀光、運輸。投資設「投資人對地主國爭端解決」（ISDS）機制。\n\n【貿易摩擦（2020–2023）】2020 年澳洲總理 Morrison 呼籲調查 COVID-19 起源後，中國對澳洲產品展開一系列限制：\n  - 2020/5：大麥反傾銷加徵 73.6%、平衡稅 6.9%\n  - 2020/8：葡萄酒反傾銷加徵 116.2%–212.1%\n  - 2020/11：龍蝦、原木、銅礦、棉花暫停進口\n  - 2020/12：動力煤暫停\n  - 2021–2022：紅肉、糖、橙、奶粉等多項農畜產品實質限制\n澳方提交 WTO 爭端：DS598（大麥）、DS602（葡萄酒），勝訴或達成和解。\n\n【回溫（2023–2024）】澳洲工黨 Albanese 2022 上任後改善關係：\n  - 2023/4 中方解除動力煤限制\n  - 2023/8 大麥關稅取消（澳方撤回 WTO 訴訟）\n  - 2024/3 葡萄酒關稅取消\n  - 2024/12 龍蝦進口恢復\n  - 2024–2025 雙邊貿易回升至 1,890 億美元水準（疫情前峰值）\n\n【意義】ChAFTA 為中國與已開發國家簽署最完整 FTA 之一，2020–2023 摩擦顯示「FTA 在地緣政治壓力下韌性的限制」；惟最終仍未撤銷協定本身，反映雙方均不願完全脫鉤。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'Australia DFAT — ChAFTA', url: 'https://www.dfat.gov.au/trade/agreements/in-force/chafta', lang: 'en' },
    ],
  },
  'eu-china-cai': {
    latestStatus: {
      summary:
        '歐盟—中國《全面投資協定》（CAI）於 2020 年 12 月完成原則性談判，但因 2021 年雙方相互制裁（涉新疆人權），歐洲議會凍結批准程序，協定迄今停滯、未生效，前景高度不確定。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-China CAI', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/china/eu-china-agreement_en', lang: 'en' },
    ],
  },

  // ── 美國系雙邊 FTA（最新狀態為 AI 整理，byTool）──
  'us-singapore': {
    latestStatus: {
      summary:
        '美國—新加坡自由貿易協定 2004 年生效，是美國與亞洲國家的首個 FTA，涵蓋貨品、服務、投資與電子商務，協定持續運作。',
      detail:
        'USSFTA 於 2003 年 5 月簽署、2004 年 1 月 1 日生效，是美國繼以色列（1985）、NAFTA（1994）、約旦（2001）、智利（2004）後的第 5 個 FTA，也是美國與亞太國家的首個 FTA。\n\n【內容】涵蓋貨品（即時 100% 免關稅）、服務（負面表列）、投資、電子商務、政府採購、智財、競爭、勞動、環境等 21 章。為美國後續 FTA 範本，特別是電子商務章節（USSFTA 第 14 章）為全球最早將「電子傳輸禁徵關稅」與「資料自由流動」入約的 FTA 之一。\n\n【特色】納入金融服務專章與「跨境資料流動」承諾，反映新加坡作為金融與數位樞紐之需求；亦設「人員整合工作小組」（IPI）處理專業人員流動。\n\n【經濟成果】2004 年生效以來，美新雙邊貿易由 380 億美元成長至 1,200 億美元（2024），美國長期享有對新加坡的貨品貿易順差，是美方少數正向 FTA。\n\n【後續】USSFTA 與美日 DTA、美—中美洲 CAFTA-DR 共同形成美國 FTA 的「2000 年代」第一波，並影響其後 KORUS、TPP/CPTPP 的數位章節設計。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — Singapore FTA', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/singapore-fta', lang: 'en' },
    ],
  },
  'us-chile': {
    latestStatus: {
      summary:
        '美國—智利自由貿易協定 2004 年生效，雙邊貨品關稅已全面消除，協定持續運作，並為後續美國 FTA 範本之一。',
      detail:
        '美智 FTA 於 2003 年 6 月 6 日簽署、2004 年 1 月 1 日生效，是美方在拉美地區的第一個 FTA（與 NAFTA 並列），亦為美方數位章節之早期範本。\n\n【主要承諾】(1) 12 年內消除全部雙邊關稅，現已全面零關稅；(2) 服務貿易：採負面表列；(3) 投資：含 ISDS；(4) 智財：美式高標準；(5) 政府採購：超越 WTO GPA；(6) 電子商務：當時最先進章節（早於 KORUS、AUSFTA），含關稅豁免、數位產品非歧視。\n\n【特殊條款】(1) 「資本管制」例外（capital control safe harbor）：智利成功爭取對短期資本流入課徵管制的權利（其後在 2008–2009 金融危機後曾援用）；(2) 永續發展：含勞動與環境邊章協定；(3) 智利為美方 FTA 體系中關稅減讓速度最快者之一。\n\n【經濟成果】生效以來，雙邊貨品貿易由 60 億美元成長至約 360 億美元（2024，6 倍）；智利對美銅、農產（葡萄酒、水果、海產）出口大幅成長；美國對智製造業產品為主。智利由美方 FTA 體系受益最為顯著的開發中夥伴之一。\n\n【後續】智利後續陸續與美方所有 CPTPP 成員、歐盟、中國等簽 FTA，自詡「全球 FTA 樞紐」（超過 30 個 FTA、涵蓋全球約 85% GDP）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — Chile FTA', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/chile-fta', lang: 'en' },
    ],
  },
  'us-australia': {
    latestStatus: {
      summary:
        '美國—澳洲自由貿易協定（AUSFTA）2005 年生效，涵蓋貨品、服務、投資與政府採購，協定持續運作。',
      detail:
        '美澳自由貿易協定（AUSFTA）於 2004 年 5 月 18 日簽署、2005 年 1 月 1 日生效，是美方第 5 個 FTA、亦為當時美方第二大 FTA 夥伴。\n\n【主要承諾】(1) 雙方對 99% 工業品即時零關稅；(2) 農業：美方對澳牛肉設 18 年配額過渡（後 2023 完成）、糖被排除；澳方對美乳製品設長配額過渡；(3) 服務：互開金融、電信、教育、專業服務；(4) 投資：未含 ISDS（澳方堅決反對；首個取消 ISDS 的美式 FTA，影響後續國際趨勢）；(5) 智財：採美式高標準（含著作權保護期延長至作者死後 70 年）；(6) 醫藥定價：對澳方 PBS（藥品給付制度）造成美藥廠進入便利，引發爭議。\n\n【特殊安排】(1) 政府採購：澳方接受 WTO GPA 級開放；(2) 影視文化：澳方保留「本地內容」配額（25% 本地電視節目）；(3) 醫藥透明化：澳方設立藥品給付獨立檢視機制。\n\n【經濟成果】生效以來，雙邊貨品貿易由 280 億美元成長至約 660 億美元（2024）；澳方對美牛肉、葡萄酒、原料藥出口大幅成長；美方對澳機械、車輛、農產品為主要受惠。\n\n【近年動態】川普 2018 年 232 條款對鋼鐵與鋁加徵關稅時，澳洲為極少數獲得永久豁免的盟邦之一；2025 年第二任川普政府對所有貿易夥伴加徵 10% 基準關稅，澳方亦受影響，但因 AUSFTA 結構雙邊貿易未根本動搖。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — Australia FTA', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/australian-fta', lang: 'en' },
    ],
  },
  'cafta-dr': {
    latestStatus: {
      summary:
        '美國—中美洲—多明尼加自由貿易協定（CAFTA-DR）涵蓋美國與中美洲五國及多明尼加，自 2006 年起分批生效，是美國深化與中美洲經貿與供應鏈整合的核心協定，持續運作。',
      detail:
        'CAFTA-DR（Dominican Republic-Central America-United States FTA）於 2004 年 8 月簽署、2005 年 7 月美國國會批准（眾議院僅以 2 票之差通過），自 2006 年起對各國分批生效：薩爾瓦多（2006/3）、宏都拉斯與尼加拉瓜（2006/4）、瓜地馬拉（2006/7）、多明尼加（2007/3）、哥斯大黎加（2009/1）。\n\n【涵蓋】美國 + 哥斯大黎加、薩爾瓦多、瓜地馬拉、宏都拉斯、尼加拉瓜、多明尼加共 7 國，總計近 5,000 萬人口。\n\n【內容】涵蓋貨品（10 年內近全面零關稅）、服務、投資（含 ISDS）、政府採購、智財、勞動、環境、爭端解決等 22 章。第 16 章「勞動」是其後美國 FTA 強化勞動標準之雛形（瓜地馬拉勞動案例 2010-2017 為里程碑）。\n\n【經濟成果】2024 年雙邊貿易超過 600 億美元；對美國而言，CAFTA-DR 國家為紡織、成衣、糖、咖啡、香蕉的主要進口來源；中美洲國家對美出口紡織與成衣大幅成長，是區域 maquila（加工出口）產業關鍵制度。\n\n【近期動態】2024–2025 川普政府上任後，雖未對 CAFTA-DR 國家加徵特別關稅，但對該區的移民壓力（特別是宏都拉斯、薩爾瓦多）與毒品管制成為談判槓桿；CAFTA-DR 國家擔憂未來檢視時可能面臨「USMCA 化」（汽車原產地、勞動 RRM）的壓力。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — CAFTA-DR', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/cafta-dr-dominican-republic-central-america-fta', lang: 'en' },
    ],
  },
  'us-korea': {
    latestStatus: {
      summary:
        '美韓自由貿易協定（KORUS）2012 年生效，是美國與亞洲規模最大的 FTA 之一。經川普政府要求重啟談判後，修訂版於 2018 年簽署、2019 年 1 月生效（調整汽車與鋼鐵條款），協定持續運作。',
      detail:
        'KORUS FTA 於 2007 年 6 月簽署、2010 年 12 月修訂、2011 年 11 月美國國會批准、2012 年 3 月 15 日生效，是美國當時與亞洲簽署的最大 FTA，也是韓國對外最大規模 FTA 之一。\n\n【再談判】川普政府於 2017 年要求重啟談判（指控雙邊貿易逆差過大），2018 年 9 月達成修訂議定書、2019 年 1 月 1 日生效。主要變動：\n(1) 美方原於 2021 年起對韓汽車取消 25% 卡車進口關稅—延長至 2041 年；\n(2) 韓國對美汽車安全標準豁免額由每車廠 2.5 萬輛提高至 5 萬輛；\n(3) 鋼鐵：韓國同意配額制（每年 263 萬公噸，約為基準期 70%）以換取免於川普 232 條款加徵關稅。\n\n【經濟成果】2012 生效以來，雙邊貿易由 1,015 億美元（2011）成長至 1,860 億美元（2023）；韓國對美汽車與半導體出口大幅成長。雙方均無重大爭端訴諸 KORUS 爭端解決機制。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — KORUS FTA', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/korus-fta', lang: 'en' },
    ],
  },
  'us-japan-phase1': {
    latestStatus: {
      summary:
        '美日第一階段貿易協定 2020 年 1 月生效，為有限範圍的早期收穫協定，日本降低美國農產品關稅、美國調降部分工業品關稅。與其同步簽署的《美日數位貿易協定》另立專章。後續更全面的第二階段談判並未實質推進。',
      detail:
        '美日《第一階段貿易協定》（U.S.-Japan Trade Agreement, USJTA）為川普政府退出 TPP 後與日本另起爐灶的雙邊安排，於 2019 年 10 月 7 日簽署、2020 年 1 月 1 日與《美日數位貿易協定》（USJDTA）同步生效。\n\n【動機】(1) 美方因退出 TPP 失去日本農產品市場優惠；(2) 日方擔憂川普依《232 條款》對日本汽車加徵關稅（25%），希望以有限早期收穫換取美方暫不加徵；(3) 故協定刻意設計為「不需國會批准」（非完整 FTA），以行政協定形式快速完成。\n\n【主要承諾】\n  - 日方對美方：降低牛肉、豬肉、乳製品、葡萄酒、堅果等農產品關稅至 CPTPP 水準（即等同恢復美方原 TPP 待遇）\n  - 美方對日方：調降工業機械、樂器、單車、化學品等少量工業品關稅；對汽車與汽車零件未進一步降稅，但美方承諾不依 232 條款對日方汽車加徵關稅\n\n【限制】(1) 不涵蓋完整 FTA 應有的服務貿易、政府採購、智財、爭端解決；(2) 美方對日方汽車（日本對美最大出口品）關稅維持 2.5% 未變動；(3) 雙方曾承諾後續啟動「第二階段」談判處理服務與汽車等議題，但實質未推進。\n\n【後續】(1) 2021 拜登政府上台後重心轉向 IPEF，未推進 USJTA 第二階段；(2) 2025 年川普第二任期對日本鋼鋁、汽車課徵新關稅，USJTA 對「免於 232 加稅」之承諾事實上失效；(3) 日方對美國「政策斷續性」的疑慮再起，加速透過 CPTPP、RCEP 多元化避險。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — US-Japan Trade Agreement', url: 'https://ustr.gov/countries-regions/japan-korea-apec/japan/us-japan-trade-agreement-negotiations', lang: 'en' },
    ],
  },

  // ── 歐盟系 FTA（最新狀態為 AI 整理，byTool）──
  'eu-korea': {
    latestStatus: {
      summary:
        '歐盟—韓國自由貿易協定 2011 年起暫時適用、2015 年 12 月全面生效，是歐盟與亞洲國家的首個 FTA，幾乎消除雙邊全部工業品關稅，協定持續運作。',
      detail:
        '歐韓 FTA 自 2007 年 5 月啟動談判，2010 年 10 月簽署，2011 年 7 月起暫時適用，2015 年 12 月 13 日全面生效（待全體歐盟成員國批准）。\n\n【規模】涵蓋約 26% 全球 GDP、約 1,200 億歐元雙邊貿易（2024 年），是歐盟與亞洲規模最大的 FTA 之一。\n\n【關稅減讓】(1) 5 年內消除約 99% 雙邊工業品關稅；(2) 農業：歐盟對韓國敏感農產品設配額（米、牛肉、乳製品保留長過渡期）；(3) 服務：韓方開放電信、金融、會計、法律、運輸等 9 大類；(4) 政府採購：擴大於 WTO GPA 之上。\n\n【新世代特色】(1) 永續發展專章（首度納入勞動、環境義務）；(2) 反傾銷與防衛條款設「比例原則」；(3) 知識財產相互承認（含 162 項地理標示）；(4) 設有「貿易救濟雙邊防衛條款」（汽車類）。\n\n【經濟成果】2011 年生效以來，雙邊貿易由 700 億歐元增至 1,200 億歐元（2024），韓國對歐汽車、半導體出口大幅成長；歐盟對韓農產品、酒類、化妝品、機械成為主要受惠項目。\n\n【爭議】2018–2019 年歐盟控告韓國未充分執行勞動章節（工會權利、結社自由），是 EU FTA 首件就「永續發展」章節提出的爭端解決案，2020 年仲裁小組裁定韓國部分違反；韓國 2021 年修法回應。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-South Korea', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/south-korea/eu-south-korea-agreement_en', lang: 'en' },
    ],
  },
  'eu-canada-ceta': {
    latestStatus: {
      summary:
        '歐盟—加拿大《全面經濟貿易協定》（CETA）自 2017 年 9 月起暫時適用，已消除約 98% 關稅。惟涉及投資法院（ICS）等章節須經全體歐盟成員國批准方能完全生效；部分成員國國會尚未完成批准，故目前仍屬「暫時適用」狀態。',
      detail:
        'CETA 於 2016 年 10 月 30 日簽署、2017 年 2 月歐洲議會通過、9 月 21 日起暫時適用。是歐盟首個與 G7 成員國簽訂的大型 FTA。\n\n【暫時適用 vs 完全生效】CETA 屬「混合協定」（mixed agreement），涉及歐盟與成員國共享權限的條款（主要是投資保護與爭端解決）須經全體 27 個成員國國會批准方能完全生效；其餘屬歐盟專屬權限的部分自 2017 年起暫時適用。\n\n【批准進度】截至 2025 年底，已有 17 國批准。法國於 2024 年 3 月參議院否決批准案，賽普勒斯亦未通過；如最終仍有國家拒絕批准，歐盟理事會須決定是否終止暫時適用。\n\n【投資法院制度（ICS）】CETA 創新地以「常設投資法院」取代傳統 ISDS 仲裁，由公開遴選的法官審理投資爭端，並設上訴機制。此設計後來成為歐盟對外協定的標準範本。在完全生效前，投資爭端解決機制處於凍結狀態。\n\n【經濟成果】2017 年暫時適用以來，雙邊貿易增長逾 30%；加方對歐出口農產品、礦產與服務顯著增加；歐方對加汽車、工業設備、酒類受惠。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — CETA', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/canada/eu-canada-agreement_en', lang: 'en' },
    ],
  },
  'eu-singapore': {
    latestStatus: {
      summary:
        '歐盟—新加坡自由貿易協定（EUSFTA）2019 年 11 月生效，是歐盟與東協國家的首個 FTA。與其並行的投資保護協定（EUSIPA）仍待歐盟成員國完成批准。',
      detail:
        '歐盟與新加坡的協定談判自 2010 年啟動，2014 年 10 月完成主要談判文本，因投資保護章節歸屬權限爭議（歐盟 vs 成員國共享）延至 2018 年 10 月才簽署。\n\n【拆分為兩份協定】因應 2017 年歐盟法院關於 EUSFTA 性質的 Opinion 2/15 裁決，協定拆為兩份：\n(1) 《歐盟—新加坡自由貿易協定》（EUSFTA）：屬歐盟專屬權限，僅需歐盟理事會與歐洲議會通過。2019 年 11 月 21 日生效。\n(2) 《歐盟—新加坡投資保護協定》（EUSIPA）：屬「混合協定」，須全體成員國國會批准。截至 2025 年仍未完成全部批准。\n\n【FTA 內容】消除約 84% 新加坡對歐盟工業品關稅（即時），其餘 5 年內降至零；新加坡側多已為零關稅，主要承諾為服務與政府採購開放。涵蓋 17 章，含電子商務、永續發展（含《巴黎協定》條款）、地理標示相互承認、競爭、智財。\n\n【意義】(1) 歐盟與東協國家的首個 FTA，奠定後續歐越 EVFTA、歐印尼 CEPA 之先例；(2) Opinion 2/15 形成的「拆分」模式，後成為歐盟所有大型新世代 FTA 的標準做法（CETA、墨西哥現代化、Mercosur 均比照）。\n\n【經濟成果】2019 生效以來，雙邊貿易年均成長 7%，2024 年達 1,000 億歐元；新加坡為歐盟在東協最大貿易夥伴，亦為歐企進入區域的樞紐。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Singapore', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/singapore/eu-singapore-agreement_en', lang: 'en' },
    ],
  },
  'eu-vietnam': {
    latestStatus: {
      summary:
        '歐盟—越南自由貿易協定（EVFTA）2020 年 8 月生效，將在 10 年內消除雙邊逾 99% 關稅。與其並行的投資保護協定（EVIPA）仍待歐盟成員國完成批准。',
      detail:
        '歐越 FTA 自 2012 年 6 月啟動談判、2015 年 12 月達成共識、2018 年 10 月於 Opinion 2/15 後改分拆為 EVFTA + EVIPA、2019 年 6 月簽署，2020 年 8 月 1 日 EVFTA 生效。\n\n【規模】涵蓋約 6.5 億人口（含歐盟 4.5 億 + 越南 1 億）、總 GDP 約 17 兆美元。\n\n【關稅減讓】(1) 越方對歐盟貨品分階段降稅，10 年內消除 99% 關稅；(2) 歐盟對越南貨品 7 年內消除 99% 關稅（紡織、鞋類有 5–7 年過渡期）；(3) 服務開放涵蓋金融、電信、運輸、配銷、環境等。\n\n【新世代規範】(1) 公開承諾遵守《巴黎協定》（首個於 EU FTA 列入正式條款）；(2) 勞動：要求批准 8 項 ILO 核心公約（越南於 2019 年批准第 98 號公約，承諾 2023 年批准強迫勞動公約）；(3) 永續發展與漁業：要求遵守 IUU（非法、未報告、未受規範漁業）國際規範；(4) 地理標示：歐盟 169 項與越南 39 項相互承認。\n\n【EVIPA】投資保護協定獨立分拆，建立投資法院制度（ICS）取代傳統 ISDS；仍待 27 個歐盟成員國全體批准方能生效，截至 2025 年仍未完成。\n\n【經濟成果】2024 年雙邊貿易達 670 億歐元（生效時 480 億歐元），越南對歐紡織、鞋類、農產品、電子零件出口大幅成長；歐盟對越南機械、汽車、藥品、酒類受惠。越南於 2024 年取代菲律賓成為歐盟在東協第二大貿易夥伴（僅次新加坡）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Vietnam', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/vietnam/eu-vietnam-agreement_en', lang: 'en' },
    ],
  },
  'eu-chile-modern': {
    latestStatus: {
      summary:
        '歐盟—智利現代化協定包含《先進框架協定》（AFA）與《臨時貿易協定》（ITA）。雙方於 2023 年 12 月簽署，臨時貿易協定已於 2025 年 2 月 1 日生效，更新原 2003 年協定並強化關鍵礦產、數位貿易與永續發展條款。',
      detail:
        '歐智現代化協定取代 2003 年生效的舊歐智聯繫協定（Association Agreement）。談判自 2017 年啟動，2022 年 12 月達成原則協議，2023 年 12 月 13 日於布魯塞爾簽署。\n\n【兩份文件】(1) 《先進框架協定》（Advanced Framework Agreement, AFA）：涵蓋政治對話、合作、貿易全部範圍；屬「混合協定」，須全體歐盟成員國國會批准方能完全生效；(2) 《臨時貿易協定》（Interim Trade Agreement, ITA）：僅涵蓋歐盟專屬權限部分（貨品、服務、政府採購、投資自由化），可先暫時適用，避免延宕。\n\n【生效】ITA 已於 2025 年 2 月 1 日生效；AFA 因仍待 27 成員國批准，預計 2026–2028 年完全生效。\n\n【主要升級】(1) 關鍵礦產：智利為全球最大鋰生產國之一，協定建立永續取得關鍵礦產合作機制（呼應歐盟《關鍵原料法》CRMA）；(2) 數位貿易：高標準章節，含跨境資料、禁資料在地化、消費者保護；(3) 永續發展：含《巴黎協定》、ILO 核心公約承諾，並設「貿易與永續發展」（TSD）執法強化機制；(4) 政府採購：擴大互開市場；(5) 中小企業專章；(6) 性別與貿易專章。\n\n【意義】(1) 是歐盟近年「現代化」聯繫協定的典範；(2) 鎖定歐方對拉美關鍵礦產供應鏈（鋰、銅）的戰略佈局；(3) 為後續 EU-Mercosur、EU-Mexico 現代化提供範本。',
      asOf: '2025-02', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Chile', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/chile/eu-chile-agreement_en', lang: 'en' },
    ],
  },
  'eu-mexico-modern': {
    latestStatus: {
      summary:
        '歐盟—墨西哥《全球協定》現代化版於 2020 年完成主要談判，並於 2025 年 1 月達成最終共識（agreement in principle），更新貿易、投資、政府採購與永續條款，後續待法律整理與雙方批准後簽署生效。',
      detail:
        '歐墨《全球協定》原版於 1997 年簽署、2000 年生效，是歐盟在拉美的第一個 FTA。現代化談判於 2016 年啟動，2018 年達成原則協議、2020 年完成主要文本，但因投資保護章節歸屬權限分歧而延宕；2025 年 1 月 17 日於墨西哥城宣布達成「最終共識」（agreement in principle），預計 2025–2026 完成法律整理、簽署與批准。\n\n【主要新增/升級內容】\n(1) 關稅升級：消除絕大多數雙邊關稅（含農產品、酒類、化妝品）；\n(2) 服務貿易與政府採購：擴大互開市場；\n(3) 投資保護：建立投資法院制度（ICS），取代傳統 ISDS；\n(4) 永續發展：納入《巴黎協定》、ILO 核心公約承諾；\n(5) 反貪腐專章；\n(6) 中小企業章節；\n(7) 數位貿易條款。\n\n【意義】(1) 是歐盟在拉美最重要的 FTA 之一；(2) 與 2024 年 12 月達成的 EU-Mercosur 協定共同形成歐盟在拉美的「兩翼」；(3) 墨西哥透過此協定強化「友岸外包」（friend-shoring）戰略地位，於 USMCA 與 EU 體系間取得平衡。\n\n【批准程序】因含投資保護與政治對話條款，被歸類為「混合協定」（mixed agreement），須經 27 個歐盟成員國國會批准方能完全生效；屬歐盟專屬權限的部分可先暫時適用。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Mexico', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/mexico/eu-mexico-agreement_en', lang: 'en' },
    ],
  },
  'eu-australia-fta': {
    latestStatus: {
      summary:
        '歐盟—澳洲自由貿易協定談判於 2023 年 10 月因農產品市場開放（牛肉、羊肉、糖等）及地理標示（GI）爭議破裂而中止。雙方雖未正式終止，但短期內重啟談判前景不明。',
      detail:
        '歐澳 FTA 談判於 2018 年 6 月啟動，歷經 15 輪正式會談、原訂 2023 年達成共識。\n\n【談判破裂時序】\n  - 2023/7：第 14 輪大阪會議無突破\n  - 2023/10/27：澳洲貿易部長 Don Farrell 飛赴日本大阪參加最後談判，因雙方在農產品配額、GI 等議題分歧過大，宣布談判中止\n  - 2023/11：雙方均表態「不關門」，但無具體重啟日程\n\n【主要分歧】\n(1) 牛肉、羊肉、糖：歐方僅願提供有限配額（如牛肉 20,000 噸/年），澳方要求大幅擴大；\n(2) 地理標示（GI）：歐方要求約 200 項 GI（如 Prosecco、Parmesan）獲澳方保護，澳方擔憂衝擊國內食品產業；\n(3) 永續發展：澳方對歐方要求的氣候條款、ILO 公約有所保留；\n(4) 政府採購：歐方要求澳方各州政府開放，澳方聯邦憲法限制。\n\n【後續走向】(1) 2025 年澳工黨 Albanese 政府連任，重啟談判意願有限；(2) 歐方執委會 von der Leyen 第二任期（2024–2029）將重心轉向 EU-Mercosur 與 EU-Indonesia；(3) 雙方在關鍵礦產（鋰、稀土）合作另闢《關鍵原料夥伴關係》（2024 簽署），補強無 FTA 缺口。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Australia', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/australia/eu-australia-agreement_en', lang: 'en' },
    ],
  },
  'eu-india-fta': {
    latestStatus: {
      summary:
        '歐盟—印度自由貿易協定談判於 2022 年重啟，雙方設定 2025 年底前完成的政治目標，涵蓋貨品、服務、投資與永續發展。關稅（汽車、酒類、農產品）與資料保護、永續條款仍為主要分歧。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-India', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/india/eu-india-agreement_en', lang: 'en' },
    ],
  },
  'eu-indonesia': {
    latestStatus: {
      summary:
        '歐盟—印尼《全面經濟夥伴協定》（CEPA）歷經多年談判，雙方於 2025 年宣布完成政治性談判，將開啟歐盟與東南亞最大經濟體間的市場開放，後續待法律整理與批准。',
      detail:
        '歐盟—印尼《全面經濟夥伴協定》（EU-Indonesia CEPA）自 2016 年啟動談判，歷經 19 輪實質會談，2025 年 7 月雙方宣布完成政治性談判，預計 2026 年完成法律整理並正式簽署。\n\n【規模】印尼為東南亞最大經濟體（人口 2.8 億、GDP 約 1.5 兆美元），加歐盟 27 國合計約 5.7 億人口、20 兆美元 GDP；2024 雙邊貿易約 300 億歐元。\n\n【主要爭議與解決】(1) 棕櫚油：歐盟 2018 年《再生能源指令》（RED II）將棕櫚油列為「高間接土地利用變遷風險」（high ILUC），印尼將此視為歧視性貿易障礙，曾於 2021 年向 WTO 提告（DS593）；CEPA 安排對棕櫚油副產品（如 PFAD）給予特定關稅優惠並承諾與《歐盟反森林砍伐法》（EUDR）合作執行；(2) 鎳礦出口禁令：印尼於 2020 年禁止鎳礦出口，違反 WTO，並引發歐方訴訟（DS592，歐方 2022 勝訴）；CEPA 安排印方逐步調整出口管制；(3) 鋼鐵：歐盟對印尼不鏽鋼反傾銷與平衡稅。\n\n【涵蓋章節】(1) 關稅減讓；(2) 永續發展（含《巴黎協定》與《歐盟反森林砍伐法》合作）；(3) 投資保護（採 ICS）；(4) 政府採購；(5) 數位貿易；(6) 智財；(7) 中小企業；(8) 性別與貿易（首部歐盟 FTA 級專章）。\n\n【意義】是歐盟在東南亞繼新加坡、越南後第三個全面性 FTA，亦是印尼最大型 FTA 之一；佈局歐盟「印太戰略」與印尼「2045 黃金願景」交集。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Indonesia', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/indonesia/eu-indonesia-agreement_en', lang: 'en' },
    ],
  },
  'eu-turkey-customs': {
    latestStatus: {
      summary:
        '歐盟—土耳其關稅同盟自 1995 年運作，使工業品在雙方間免關稅流通，但不涵蓋農業、服務與政府採購。關稅同盟現代化談判長期因雙邊政治關係而停滯。',
      detail:
        '歐土關稅同盟由 1963 年《安卡拉協定》設想，1995 年 12 月經歐盟-土耳其聯合委員會（CCA）第 1/95 號決定實施，1996 年 1 月 1 日生效。土耳其為非歐盟成員國中唯一深度參與歐盟單一市場（工業品部分）的國家。\n\n【涵蓋】(1) 工業品（含加工農產品）：雙方間零關稅、共同對外關稅；(2) 不含：未加工農產品、服務、政府採購；(3) 土方接受歐盟工業品相關法規（產品標準、競爭、智財）。\n\n【規模】2024 年雙邊貿易約 2,000 億歐元，歐盟為土耳其最大貿易夥伴、土方為歐盟第 5 大貿易夥伴。\n\n【現代化談判】2014 年起雙方啟動關稅同盟現代化談判，目標納入：(1) 農產品；(2) 服務貿易；(3) 政府採購；(4) 強化爭端解決。但因 2016 年土耳其政變後人權狀況惡化、難民議題、土耳其入歐盟申請凍結等政治因素，談判實質停滯。\n\n【近年動向】(1) 2024–2025 雙方在貿易便捷化、海關現代化等技術層面有小幅進展；(2) 土耳其新冠與烏俄戰爭後的經濟困境（高通膨、里拉貶值）使現代化重要性提升；(3) 然政治氣氛仍不利全面突破，預計短期內維持現狀。\n\n【特殊安排】土耳其雖為關稅同盟成員，但**不參與**歐盟對外 FTA 談判，且**自動**受歐盟對外 FTA 約束（接受第三國享受歐盟市場進入、但無對等談判地位），長期被批評為「不對稱」。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Türkiye', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/turkiye_en', lang: 'en' },
    ],
  },
  'eea': {
    latestStatus: {
      summary:
        '《歐洲經濟區協定》（EEA）1994 年生效，將歐盟單一市場延伸至冰島、列支敦斯登、挪威，使其在貨品、服務、人員與資本「四大自由」上幾近全面參與歐盟內部市場，協定持續運作並隨歐盟法規動態更新。',
      detail:
        '《歐洲經濟區協定》（Agreement on the European Economic Area, EEA）於 1992 年 5 月 2 日在葡萄牙波多簽署，1994 年 1 月 1 日生效，將當時的歐洲共同體（EC）單一市場延伸至 EFTA 國家。\n\n【歷史】原本所有 7 個 EFTA 國家均參與，但瑞士於 1992 年 12 月公投否決加入；奧地利、芬蘭、瑞典於 1995 年加入歐盟而離開 EFTA-EEA 集團；現由 3 個 EFTA 國家參與：冰島、列支敦斯登、挪威（被稱為「EEA-EFTA」國家）。\n\n【涵蓋】將歐盟單一市場「四大自由」延伸至 EEA-EFTA：(1) 貨品自由流通（不含 CAP 農產品與漁業）；(2) 服務自由流通；(3) 人員自由移動（含工作權）；(4) 資本自由移動。亦涵蓋競爭、消費者保護、社會政策、環境、研究、教育等橫向領域。\n\n【EEA-EFTA 三國地位】(1) 不在歐盟關稅同盟內，可獨立簽署對外 FTA；(2) 不參與歐盟農業/漁業共同政策；(3) 不參與歐盟外交、安全、稅務政策；(4) 必須採納歐盟單一市場相關法規（含後續修訂，每年約 200–300 件），但無投票權—被批評為「按法律但不立法」。\n\n【動態整合機制】EEA 聯合委員會每月開會，將歐盟新法規納入 EEA 附件；爭端解決由 EFTA 監督機構（ESA）與 EFTA 法院處理 EFTA 側、由歐盟執委會與歐洲法院處理歐盟側。\n\n【特殊安排】EEA 第 112–113 條「保障條款」允許單方暫時偏離特定義務（如重大社會、經濟、環境困難時）；列支敦斯登曾援引限制移工。\n\n【規模】涵蓋 30 國（EU 27 + EFTA 3）約 4.5 億人口，是全球最大、最深度整合的單一市場。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'EFTA — The EEA Agreement', url: 'https://www.efta.int/eea/eea-agreement', lang: 'en' },
    ],
  },

  // ── 英國系（後脫歐 FTA，byTool）──
  'uk-australia': {
    latestStatus: {
      summary: '英澳自由貿易協定 2021 年 12 月簽署、2023 年 5 月 31 日生效，是英國脫歐後首個「從零談起」的全新 FTA，將在多年內消除幾乎所有雙邊關稅。',
      detail:
        '英澳自由貿易協定（UK-Australia FTA）談判自 2020 年 6 月啟動，2021 年 6 月達成原則性協議，12 月 17 日於倫敦正式簽署，2023 年 5 月 31 日同時與英紐 FTA 生效。\n\n【意義】是英國脫歐後首個「從零談起」的全新 FTA（其他協定多為延續或複製原歐盟協定），亦是英方加入 CPTPP 的重要鋪墊。\n\n【主要承諾】\n(1) 即時：雙方消除 99% 雙邊關稅；\n(2) 過渡期：澳方對英方威士忌、汽車立即降至零；英方對澳牛肉設 15 年配額過渡（年配額由 35,000 噸成長至 110,000 噸，第 15 年完全自由化）；對羊肉、糖、稻米、雞肉設較短或較長配額過渡；\n(3) 服務：擴大專業人員流動，承認專業資格；\n(4) 投資：未含 ISDS（英方政策一致立場）；\n(5) 數位貿易：高標準章節，含跨境資料流動、禁止資料在地化；\n(6) 永續發展：含環境章節（包含《巴黎協定》條款）但農業團體批評澳方畜牧排放標準較低。\n\n【爭議】英國農業團體（特別是蘇格蘭羊肉與英格蘭牛肉農）強烈反對，認為澳方規模化、低成本生產將衝擊國內畜牧；英國國會貿易與農業委員會曾出具批評報告。\n\n【經濟影響】英政府估計年新增 GDP 約 23 億英鎊；澳方預期農業出口至英每年增加約 13 億澳元。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-Australia FTA', url: 'https://www.gov.uk/government/collections/uk-australia-free-trade-agreement', lang: 'en' }],
  },
  'uk-nz': {
    latestStatus: {
      summary: '英國—紐西蘭自由貿易協定 2022 年 2 月簽署、2023 年 5 月 31 日與英澳協定同日生效，逐步消除雙邊關稅並涵蓋服務、數位貿易與環境條款。',
      detail:
        '英紐自由貿易協定談判自 2020 年 6 月啟動，2021 年 10 月達成原則性協議、2022 年 2 月 28 日簽署，2023 年 5 月 31 日（與英澳同日）生效。\n\n【規模】較英澳協定小（紐西蘭人口僅約 510 萬），但被視為英方建構印太貿易網絡的拼圖之一，並為加入 CPTPP 鋪路。\n\n【主要承諾】\n(1) 雙方關稅即時消除 97%（紐方）/ 96.4%（英方）；\n(2) 紐方對英汽車、威士忌、服飾立即零關稅；英方對紐牛羊肉設長期配額過渡（牛肉 10 年、羊肉 15 年）；\n(3) 服務貿易：互開市場，包含「青年流動方案」（Youth Mobility Scheme）擴大至 35 歲；\n(4) 投資：未含 ISDS；\n(5) 數位貿易：高標準章節，與 DEPA、星澳 DEA 一致；\n(6) **環境章節**：全球首個 FTA 納入「化石燃料補貼改革」具體承諾、原住民貿易合作（與紐方毛利傳統商業文化承認結合）。\n\n【特色】(1) 紐方堅持下，環境章節成為「FTA + 永續發展」最高標準參考；(2) 原住民貿易合作章節（沿襲 ANZTEC 模式）；(3) 雙方亦同步啟動更廣泛的「英紐戰略夥伴」對話。\n\n【經濟影響】英政府估計年新增 GDP 約 8 億英鎊；對紐方為「規模有限但戰略重要」協定，紐英雙邊貿易由 27 億英鎊（2022）成長至約 34 億英鎊（2024）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-New Zealand FTA', url: 'https://www.gov.uk/government/collections/uk-new-zealand-free-trade-agreement', lang: 'en' }],
  },
  'uk-japan': {
    latestStatus: {
      summary: '英日《全面經濟夥伴協定》（CEPA）2020 年 10 月簽署、2021 年 1 月生效，是英國脫歐後首個重大貿易協定，大致延續原歐日 EPA 內容並強化數位貿易條款。英國其後並透過 CPTPP 進一步深化與日本經貿。',
      detail:
        '英日 CEPA 自 2020 年 6 月正式啟動談判，僅 4 個月即於 10 月 23 日簽署，2021 年 1 月 1 日生效（與脫歐過渡期結束同日），是英國脫歐後簽署的第一個全新主要 FTA。\n\n【談判加速原因】英國須在 2021 年 1 月 1 日前確保與日本貿易不出現法律真空（脫歐後英國自動脫離原歐日 EPA），雙方有強烈時程壓力；協定整體大致延續歐日 EPA 條款，但在數位貿易與部分敏感領域作出英方專屬調整。\n\n【與歐日 EPA 差異】\n(1) 數位貿易章節（第 8 章）大幅強化，新增禁止強制資料在地化、禁止強制揭露原始碼、跨境資料自由流動等高標準條款（向 USJDTA / CPTPP 第 14 章靠攏）；\n(2) 金融服務專章納入金融科技合作；\n(3) 對食品與酒類地理標示（GI）延續歐日 EPA 中英方相關項目，並新增「Yorkshire Wensleydale 起司」等英方 GI；\n(4) 部分關稅減讓快於歐日 EPA（如英國對日豬肉、起司）；\n(5) 雙方並承諾 6 年內檢視協定。\n\n【後續】英方於 2021 年 2 月即申請加入 CPTPP，2024 年 12 月正式加入，部分英日 CEPA 條款由 CPTPP 取代或補強。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-Japan CEPA', url: 'https://www.gov.uk/government/collections/uk-japan-comprehensive-economic-partnership-agreement', lang: 'en' }],
  },

  // ── 印度系（byTool）──
  'india-korea': {
    latestStatus: {
      summary: '印度—韓國《全面經濟夥伴協定》（CEPA）2010 年生效。雙方升級談判持續進行，盼擴大市場開放並調整原產地規則。',
      detail:
        '印韓《全面經濟夥伴協定》（India-Korea CEPA）自 2006 年啟動談判，2009 年 8 月 7 日簽署、2010 年 1 月 1 日生效。\n\n【主要承諾】(1) 韓方對印 75% 工業品 8 年內降至零；(2) 印方對韓 85% 工業品 8 年內降至零，但對汽車、鋼鐵等敏感品設較長過渡或排除；(3) 服務：韓方對印 70 個次部門開放、印方對韓 65 個次部門；含 IT 人才簽證便捷化條款；(4) 投資：含 ISDS。\n\n【升級談判】2016 年啟動 CEPA 升級談判，至 2025 年已舉行多輪會談，主要爭議：\n  - 印方對韓方鋼鐵、石化、汽車零組件出口造成國內衝擊\n  - 原產地規則被韓方利用以「轉口」中國產品至印度（印方關切）\n  - 服務貿易：印方要求擴大 IT 與專業人員流動\n  - 投資保護章節：印方 2017 年單方終止舊雙邊投資條約，要求重新談判\n\n升級協商因多項分歧進展緩慢，截至 2025 年仍未完成。\n\n【經濟成果】2010 年生效時雙邊貿易 170 億美元，2024 年達 290 億美元；韓對印出口主要為石化、鋼鐵、汽車零件、半導體；印對韓主要為石油產品、紡織、農產。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },
  'india-japan': {
    latestStatus: {
      summary: '印度—日本《全面經濟夥伴協定》（CEPA）2011 年生效。雙方就協定檢視與升級進行討論，以擴大製造業與供應鏈合作。',
      detail:
        '印日 CEPA 自 2007 年啟動談判、歷經 14 輪會談，2011 年 2 月 16 日簽署、同年 8 月 1 日生效。\n\n【主要承諾】(1) 10 年內消除約 94% 雙邊貿易品的關稅（按金額）；(2) 服務：互開金融、IT、運輸、零售；(3) 投資：含 ISDS；(4) 自然人移動：印方護理師、廚師赴日的便捷化安排；(5) 智財：採高標準。\n\n【特色】(1) 印度首個與東亞已開發國家的全面 FTA；(2) 是 RCEP 之前印方主要的亞洲 FTA；(3) 涵蓋從製造業（汽車、藥品、機械）到服務業（IT 服務）的廣度。\n\n【經濟成果】2011 年雙邊貿易約 145 億美元，2024 年約 220 億美元；日方對印汽車零件、機械、半導體、化學品出口為主；印方對日成衣、海產、藥品、IT 服務為主。\n\n【升級談判與供應鏈合作】2024–2025 雙方就 CEPA 升級、製造業合作（特別是半導體與電動車供應鏈）多次高層磋商；2024 年達成《關鍵礦產合作備忘錄》，2025 年啟動「印日供應鏈韌性倡議」工作小組。\n\n【背景】印度於 2019 年退出 RCEP 後，與日本（RCEP 成員）的雙邊 FTA 顯得更為關鍵；日方亦透過 Modi-岸田/石破政府的多次高峰會強化此關係，包括 2022 年「擴大全面戰略夥伴關係 5 年計畫」（USD 50B 投資承諾）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },
  'india-australia': {
    latestStatus: {
      summary: '印度—澳洲《經濟合作暨貿易協定》（ECTA）2022 年 12 月 29 日生效，為早期收穫協定；雙方正就更全面的《全面經濟合作協定》（CECA）持續談判。',
      detail:
        '印澳《經濟合作暨貿易協定》（India-Australia Economic Cooperation and Trade Agreement, ECTA）採「早期收穫」模式，先簽署涵蓋貨品與少量服務的協定，再續談更完整的 CECA。\n\n【簽署與生效】2022 年 4 月 2 日由澳貿易部長 Tehan 與印度商工部長 Goyal 視訊簽署，2022 年 12 月 29 日生效。\n\n【主要承諾（ECTA）】(1) 澳方對印 100% 工業品立即零關稅；(2) 印方對澳 70% 工業品立即零關稅、其餘 7 年內降稅，敏感品（汽車、酒類、農產）排除；(3) 服務：互開教育、醫療、IT、會計；澳方並提供印度學生「畢業後工作簽證」延長；(4) 自然人移動：擴大印度廚師、瑜珈師、IT 專業人員赴澳便捷化。\n\n【經濟成果】ECTA 生效 2 年內，雙邊貿易由 220 億美元（2021）成長至 320 億美元（2024）；澳方對印煤、鐵礦、教育服務出口大幅成長；印方對印染料、紡織、藥品為主。\n\n【CECA 全面談判】2023 年起雙方就 CECA（涵蓋投資、政府採購、智財、競爭、永續發展、數位貿易、原產地規則升級）持續談判。雙方原訂 2024 年完成，因投資保護章節與印方傳統雙邊投資條約模式（BIT）的差異延宕，目標延至 2025–2026。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Australia DFAT — India ECTA', url: 'https://www.dfat.gov.au/trade/agreements/in-force/aifta', lang: 'en' }],
  },
  'india-oman': {
    latestStatus: {
      summary: '印度—阿曼《全面經濟夥伴協定》（CEPA）談判已大致完成，將是印度在波斯灣地區繼印阿聯 CEPA 後的另一重要協定，待最終確認與簽署。',
      detail:
        '印度—阿曼《全面經濟夥伴協定》（India-Oman CEPA）談判自 2023 年 11 月啟動，是印度在繼 2022 年印阿聯 CEPA 後與波斯灣國家的第二個 FTA 談判。\n\n【談判進度】至 2025 年中已完成多輪實質會談，核心條款已達成共識，待文本最終整理與雙方批准。雙方原計畫於 2024 年初完成簽署，因部分敏感品項（特別是石化、塑膠）關稅減讓談判延長至 2025–2026 年。\n\n【主要規畫內容】(1) 雙方對絕大多數工業品 10 年內降至零關稅；(2) 阿曼對印 96% 商品給予降稅，重點受惠：印度成衣、藥品、寶石珠寶、農產品、機械；(3) 印度對阿曼 90% 商品降稅，重點受惠：阿曼石油產品、塑膠、化學品；(4) 服務貿易：印方專業人員（IT、醫療、教育）赴阿便捷化；(5) 投資保護機制。\n\n【經濟意義】(1) 印阿曼雙邊貿易約 130 億美元（2024），阿曼為印度在波斯灣的第 4 大貿易夥伴；(2) 印度透過 CEPA 強化阿曼港口（如 Duqm 港）作為其進入波斯灣與東非的物流樞紐；(3) 補強印度與海合會（GCC）整體關係（GCC 整體 FTA 談判 2024 年重啟）。\n\n【戰略背景】Modi 政府推動「西亞戰略夥伴關係」，繼印阿聯（2022 CEPA）、印沙投資承諾（2023）後，印阿曼 CEPA 為此戰略的重要拼圖。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },
  'india-nz': {
    latestStatus: {
      summary: '印度—紐西蘭自由貿易協定談判於 2025 年 3 月正式啟動，雙方設定加速完成的目標，乳製品市場開放為主要議題之一。',
      detail:
        '印度—紐西蘭自由貿易協定談判於 2025 年 3 月 16 日 Modi 印度與紐西蘭總理 Luxon 共同訪問新德里時宣布正式啟動，原計畫於 60 天內完成首輪實質會談。\n\n【談判背景】(1) 印紐曾於 2010 年啟動 FTA 談判，但因紐方對印開放乳製品（紐方優勢產業）市場關切而長期僵持、2015 年實質停滯；(2) 印度於 2019 年退出 RCEP 後，紐方需單獨與印度建立 FTA 關係；(3) 雙方各於 2024–2025 年完成新政府就任（紐方 Luxon 國家黨上台、印度 Modi 第三任期），形成新的談判動能。\n\n【核心爭議】\n(1) **乳製品**：紐方乳業（Fonterra）希望進入印度市場（印度為全球最大乳製品消費國，年值約 1,500 億美元）。但印度乳業關係 8,000 萬小農生計，是政治禁忌；歷年來印度對所有 FTA 夥伴均拒絕納入乳製品市場開放（含 RCEP）；\n(2) **農產品**：印度紅肉、葡萄酒、奇異果均有印方關注；\n(3) **服務貿易**：印方要求擴大專業人員（IT、會計、護理）赴紐簽證；\n(4) **數位貿易**：紐方要求高標準章節（與 DEPA 一致）。\n\n【規模】2024 年雙邊貿易僅約 19 億紐元，遠低於兩國潛力；FTA 完成預期可使雙邊貿易倍增。\n\n【近期動向】2025 年 3 月啟動後已完成 3 輪實質會談，主要在乳製品（紐方逐步妥協為「過渡期 + 配額」模式）、印方紅肉開放上取得進展，但雙方均期待 2025–2026 年內完成。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'New Zealand MFAT — India', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/agreements-under-negotiation/india', lang: 'en' }],
  },
  'india-canada-suspended': {
    latestStatus: {
      summary: '印度—加拿大《早期進展貿易協定》（EPTA）談判於 2023 年 9 月因兩國外交關係惡化（涉錫克教領袖 Nijjar 命案爭議）而暫停，迄今未恢復。',
      detail:
        '印加《早期進展貿易協定》（India-Canada Early Progress Trade Agreement, EPTA）談判自 2010 年啟動，原計畫處理為《全面經濟夥伴協定》（CEPA）之早期收穫部分。\n\n【談判中斷時序】\n  - 2010：印加 CEPA 談判啟動，歷經多輪後因印方傳統 BIT 模式分歧、加方對開放服務市場關切而拖延\n  - 2022/3：雙方宣布暫停 CEPA、改先談 EPTA\n  - 2023/4：雙方完成 EPTA 第 9 輪會談，宣布加速完成\n  - 2023/6/18：加拿大錫克教領袖 Hardeep Singh Nijjar 在卑詩省遭暗殺\n  - 2023/9/18：加總理 Trudeau 於國會指控印度政府涉案；印方強烈否認\n  - 2023/9/22：印方宣布暫停所有印加 EPTA 談判（包含原訂 9 月底的部長級會議）\n  - 2024/10：加方驅逐 6 名印度外交官；印方對等驅逐加方外交官；雙邊關係降至冰點\n  - 2025：Carney 政府上台後，雙方有低度技術接觸，但實質談判未恢復\n\n【EPTA 原規畫內容】(1) 印方對加 11–12 個產品類別降稅（含農產品、紙漿、機械）；(2) 加方對印 6–7 個類別降稅（含農產、IT 服務）；(3) 服務貿易部分章節；(4) 不含投資保護（另行談判）。\n\n【經濟影響】(1) 加印雙邊貿易約 100 億美元（2024），主要為加方鉀肥、紙漿、扁豆對印出口；印方紡織、藥品、IT 服務對加出口；(2) 政治緊張對既有貿易未造成大幅衝擊，但 EPTA 暫停使原本可預期的擴大效應消失。\n\n【前景】加方 Carney 政府（2025 上任）較為務實，雙邊溝通有改善跡象；但 Nijjar 案司法調查、印度國安局介入指控未解，預期短期內 EPTA 難實質重啟。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },

  // ── 東協對外 FTA（byTool）──
  'asean-india': {
    latestStatus: {
      summary: '東協—印度自由貿易協定（貨品部分 AITIGA 於 2010 年生效）。雙方自 2023 年起進行協定檢視與升級談判，目標於 2025 年完成。',
      detail:
        '東協-印度 FTA 由 3 個獨立協定組成：\n  - 《東協-印度貨品貿易協定》（AITIGA）：2009 年 8 月簽署、2010 年 1 月生效\n  - 《東協-印度服務貿易協定》：2014 年 11 月簽署、2015 年 7 月起分批生效\n  - 《東協-印度投資協定》：2014 年 11 月簽署、2015 年 7 月起生效\n\n【主要承諾】AITIGA 涵蓋約 74% 雙邊產品的關稅消除（含一般商品、敏感商品、高度敏感商品三類；CLMV 享長過渡期）。服務貿易採正面表列開放。\n\n【印方退出 RCEP 後的關鍵性】印度於 2019 年退出 RCEP 後，AITIGA 成為印度與東協最完整的貿易制度安排。雙邊貿易由 2010 年 530 億美元成長至 2024 年約 1,300 億美元。\n\n【升級檢視（2023+）】(1) 印方關切原產地規則被濫用、中國產品藉由東協轉口至印度；(2) 印方希望擴大農產品、藥品出口；(3) 東協方希望擴大製造品（紡織、電子）出口；(4) 雙方均同意新增電子商務、貿易便捷化、數位章節。談判進度緩慢，原定 2025 完成的目標可能延期。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — FTAs with Dialogue Partners', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'asean-aus-nz': {
    latestStatus: {
      summary: '東協—澳洲—紐西蘭自由貿易協定（AANZFTA）2010 年生效。升級議定書於 2023 年簽署、2024 年起陸續生效，新增電子商務、永續發展等章節。',
      detail:
        'AANZFTA（ASEAN-Australia-New Zealand FTA）於 2009 年 2 月 27 日簽署、2010 年 1 月 1 日對前 8 個成員生效，是東協以「整體」名義簽署的首個全面性 FTA（含貨品、服務、投資），亦是澳紐共同對外經貿戰略的里程碑。\n\n【規模】涵蓋 12 國（東協 10 + 澳紐）約 7 億人口、3.5 兆美元 GDP；2024 年區內貿易約 1,100 億美元。\n\n【主要承諾】(1) 14 年內逐步消除約 96% 區內關稅；(2) 服務貿易：採正面表列，含金融、電信、運輸、專業服務；(3) 投資：採「ISDS-lite」機制；(4) 自然人移動：技術勞工、商務人士便捷化。\n\n【升級議定書（2023/8 簽署，2024+ 生效）】\n  - 新增章節：中小企業（SME）、貿易與永續發展（含勞動、環境）\n  - 升級電子商務章節：強化數位貿易條款（與 DEFA、DEPA 趨同）\n  - 升級政府採購、原產地規則電子化\n  - 強化技術性貿易障礙、SPS 規範\n  - 2024/4 起對已批准成員陸續生效\n\n【意義】AANZFTA 後與其他東協對外 FTA（東協-中、東協-韓、東協-日）共同形成 RCEP 的基礎；其升級議定書與 RCEP 並行，避免規則競爭。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — AANZFTA', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'asean-korea': {
    latestStatus: {
      summary: '東協—韓國自由貿易協定 2007 年起分階段生效，涵蓋貨品、服務與投資，並透過 RCEP 進一步整合，協定持續運作。',
      detail:
        '東協-韓國 FTA（AKFTA）由 4 個獨立協定組成：\n  - 《貨品貿易協定》（2006 年 8 月簽署、2007 年 6 月生效）\n  - 《服務貿易協定》（2007 年 11 月簽署、2009 年 5 月生效）\n  - 《投資協定》（2009 年 6 月簽署、2009 年 9 月生效）\n  - 《爭端解決議定書》\n\n【主要承諾】(1) 韓方對東協 90% 工業品 10 年內降至零；(2) 東協對韓方分階段（CLMV 較長過渡）；(3) 服務貿易：採正面表列；(4) 投資：含 ISDS。\n\n【經濟成果】2007 年雙邊貿易 619 億美元，2024 年超過 2,000 億美元；韓對東協出口主要為半導體、石化、汽車；東協對韓出口主要為天然氣、煤、紡織、農產。\n\n【韓國新南方政策】2017 年文在寅政府提出「新南方政策」，將東協與印度提升至與美中日同等的戰略夥伴地位；2024 尹錫悅政府提出「韓-東協全面戰略夥伴關係」，AKFTA 升級談判持續進行。\n\n【RCEP 並行】RCEP 自 2022 起對韓國生效，部分關稅減讓速度超過 AKFTA；企業可選擇套用較優惠的協定。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — ASEAN-Korea FTA', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'asean-japan': {
    latestStatus: {
      summary: '東協—日本《全面經濟夥伴協定》（AJCEP）2008 年生效，其後補充服務與投資章節，並隨 RCEP 深化區域整合，協定持續運作。',
      detail:
        '東協-日本《全面經濟夥伴協定》（ASEAN-Japan CEP, AJCEP）於 2008 年 4 月簽署、2008/12 起對首批批准國分階段生效；至 2010 年覆蓋全部 11 方（東協 10 + 日本）。\n\n【獨特結構】(1) 採「混合架構」：原協定處理貨品貿易、原產地規則、海關程序、SPS、TBT；服務、投資、自然人移動透過後續議定書（First Protocol，2019 年生效）補充；(2) 並行於日方與東協個別國家簽訂的雙邊 EPA（日-星、日-馬、日-菲、日-越、日-泰、日-印尼、日-汶），形成「雙軌制」。\n\n【主要承諾】10 年內消除約 90% 區內關稅（按品項）；日方對東協開放金融、運輸；東協對日方開放電信、零售、工程設計。\n\n【RCEP 接軌】2022/1 RCEP 生效後，與 AJCEP、AANZFTA、東協-中、東協-韓 FTA 形成「東協 + 5」對外網絡。實務上，企業可依貨品類別、原產地規則選擇套用較有利的協定，因此 AJCEP 與 RCEP 並存而非取代。\n\n【經濟成果】2024 年東協與日本雙邊貿易約 2,400 億美元，東協自 2020 年起取代中國成為日本第二大貿易夥伴（僅次美國）。\n\n【近年動向】2023 年雙方啟動 AJCEP 升級談判，預期新增電子商務、永續發展章節，並參考 DEFA 規範。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — AJCEP', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'aec-2015': {
    latestStatus: {
      summary: '東協經濟共同體（AEC）於 2015 年底正式建立，致力打造單一市場與生產基地。「AEC 藍圖 2025」持續推進貨品、服務、投資、資金與技術勞工流通的深化整合。',
      detail:
        '東協經濟共同體（ASEAN Economic Community, AEC）於 2015 年 12 月 31 日正式建立，是東協三大共同體之一（與政治安全共同體 APSC、社會文化共同體 ASCC 並列），目標將東協打造為「單一市場與生產基地」。\n\n【五大特性】\n(1) 單一市場與生產基地：貨品、服務、投資、技術勞工的自由流通；資金較自由流動；\n(2) 高度競爭的經濟區域：競爭政策、消費者保護、智財、基礎建設、稅務、電子商務；\n(3) 平衡的經濟發展：中小企業發展、區內成員發展差距縮小；\n(4) 全面整合入全球經濟：透過 FTA、區域 EPA 連接亞太經濟；\n(5) 領導區域經濟整合（後納入「AEC 藍圖 2025」）。\n\n【AEC 藍圖 2025】2015 年通過，5 大支柱：(1) 高度整合且具凝聚力的經濟；(2) 競爭力、創新與動能；(3) 強化連結與部門合作；(4) 韌性、包容、人民導向與以人為本；(5) 全球東協。\n\n【後 2025 願景】2025/5 第 46 屆東協高峰會（吉隆坡）通過《ASEAN 共同體願景 2045》與《AEC 戰略計畫 2026–2030》，未來十年聚焦：數位轉型（含 DEFA）、永續經濟、強韌供應鏈、中小微企業發展、區域樞紐定位。\n\n【經濟規模】2024 年東協 GDP 約 4 兆美元（全球第 5 大經濟體），人口 6.8 億，中位年齡 30 歲。AEC 內部貿易約 8,500 億美元（佔總貿易 22%）；對外貿易約 3 兆美元。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — Economic Community', url: 'https://asean.org/our-communities/economic-community/', lang: 'en' }],
  },

  // ── EFTA / 其他現役（byTool）──
  'efta-mercosur': {
    latestStatus: {
      summary: 'EFTA（瑞士、挪威、冰島、列支敦斯登）與南方共同市場（Mercosur）於 2025 年宣布完成自由貿易協定談判，將形成跨大西洋的大型自貿關係，後續待法律整理與各方批准。',
      detail:
        'EFTA-Mercosur 自由貿易協定談判始於 2017 年，歷經多輪、因 Mercosur 內部分歧（特別是阿、巴對工業品開放疑慮）與 EFTA 對農業敏感性而拖延。2025 年 7 月雙方宣布完成談判文本，預計 2026 年正式簽署。\n\n【規模】EFTA 4 國（瑞、挪、冰、列）+ Mercosur 5 國（阿、巴、巴拉圭、烏、玻）約 3.4 億人口、合計 GDP 約 4 兆美元。\n\n【主要內容】(1) 消除約 95% 雙邊關稅（過渡期 10–15 年）；(2) 服務貿易：互開金融、運輸、專業服務；(3) 投資：含「投資調解」機制（取代傳統 ISDS）；(4) 永續發展：含勞動、環境、《巴黎協定》、亞馬遜雨林保護條款；(5) 政府採購、智財、競爭、爭端解決等完整章節。\n\n【意義】(1) 與 EU-Mercosur（2024/12 政治協議）形成「歐洲對 Mercosur 雙協定」格局；(2) EFTA 維持「對外多元 FTA」戰略——已與全球約 40 國/區域簽 FTA；(3) Mercosur 此舉表明南向歐洲多元化以對抗中國依賴。\n\n【批准進度】各 EFTA 國家須經國會批准（瑞士可能舉行公投），Mercosur 各國亦須國內批准；估計最早 2027–2028 年生效。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'EFTA — Mercosur', url: 'https://www.efta.int/free-trade/free-trade-agreements/mercosur', lang: 'en' }],
  },
  'mercosur-singapore': {
    latestStatus: {
      summary: '南方共同市場—新加坡自由貿易協定（MCSFTA）2023 年 12 月簽署，是 Mercosur 與亞洲國家的首個 FTA，待各成員國完成批准後生效。',
      detail:
        'Mercosur-Singapore FTA（MCSFTA）自 2018 年啟動談判，2022 年 7 月達成原則協議，2023 年 12 月 7 日於巴西里約熱內盧 Mercosur 高峰會正式簽署。\n\n【意義】(1) 是 Mercosur 與亞洲國家的第一個 FTA；(2) 也是新加坡與南美洲集團的第一個 FTA；(3) 新加坡接續成為 Mercosur 在亞洲的「樞紐」夥伴。\n\n【主要內容】(1) 雙方對 95% 雙邊商品最終達零關稅（15 年過渡期）；(2) 服務貿易：採負面表列；(3) 投資：採「投資便捷化」（無 ISDS）；(4) 高標準數位貿易章節（含跨境資料流動、禁止資料在地化、原始碼保護）；(5) 政府採購；(6) 中小企業；(7) 性別與貿易；(8) 永續發展。\n\n【批准進度】新加坡於 2024/4 完成國內批准；Mercosur 4 個創始國各自進行國會批准。截至 2025 年底巴拉圭、烏拉圭已批准，阿根廷與巴西仍在進行中，預計 2026 年正式生效。\n\n【經濟意義】(1) 新加坡為 Mercosur 在亞洲第二大投資來源；(2) 新加坡企業透過協定進入 Mercosur 服務、金融、運輸市場；(3) Mercosur 對新出口主要為農產品、礦產、加工食品；(4) 為後續 Mercosur-韓國、Mercosur-日本、Mercosur-中國談判鋪路。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Singapore MTI — Mercosur-Singapore FTA', url: 'https://www.mti.gov.sg/Trade/Free-Trade-Agreements', lang: 'en' }],
  },
  'us-uk-fta': {
    latestStatus: {
      summary: '美英於 2025 年 5 月 8 日宣布「經濟繁榮協議」（Economic Prosperity Deal），屬範圍有限的關稅安排（涉汽車、鋼鋁、牛肉、乙醇等），而非全面性 FTA；後續細節與實施仍在推進。',
      detail:
        '美英《經濟繁榮協議》（U.S.-U.K. Economic Prosperity Deal, EPD）由川普政府於 2025 年 5 月 8 日宣布，是川普第二任期推動的首份雙邊貿易安排，亦是英國脫歐後與美方達成的首份貿易協定。\n\n【背景】川普 2025 年 4 月對全球大多數國家加徵 10% 基準關稅後，多國尋求談判降低關稅。英相 Starmer 政府透過快速磋商，與川普政府達成有限範圍的關稅互讓。\n\n【主要內容】\n(1) **汽車**：美方對英方汽車進口（原 27.5% 戰時關稅）保留 10% 基準關稅，年配額 100,000 輛（大致對應英方對美出口規模）；超過配額部分回到 27.5%；\n(2) **鋼鐵與鋁**：美方對英方鋼鋁加徵的 25% 232 條款關稅取消（須符合「英方在英國熔煉」要求）；\n(3) **牛肉**：英方擴大對美牛肉的配額（13,000 噸），美方對等對英牛肉開放配額；\n(4) **乙醇**：英方撤除對美乙醇的進口關稅；\n(5) **航空**：勞斯萊斯引擎、波音零件免關稅；\n(6) **製藥**：未達成共識，留待後續。\n\n【法律性質】非完整 FTA，未涉服務、投資、智財、政府採購等傳統 FTA 章節；屬「行政安排」，不需英國國會批准，不依 USMCA 模式設立爭端解決機制。\n\n【後續】(1) 雙方承諾持續就科技、AI、關鍵礦產合作擴大協議；(2) 英方仍受 10% 基準關稅，對英企業而言並非完全勝利；(3) 川普政府將 EPD 作為與其他國家談判的「樣板」，後續法國、德國、墨西哥、加拿大、日本均面對類似要求。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-US trade deal', url: 'https://www.gov.uk/government/news', lang: 'en' }],
  },
  'eu-us-talks': {
    latestStatus: {
      summary: '歐美早年的《跨大西洋貿易與投資夥伴協定》（TTIP）談判自 2016 年起停滯。2025 年雙方因川普政府關稅爭端重啟協商，並達成以基準關稅為核心的框架性安排，惟細節與爭議仍多。',
      detail:
        '歐美貿易關係近 10 年走過四個階段：\n\n【一、TTIP 時代（2013–2016）】《跨大西洋貿易與投資夥伴協定》（Transatlantic Trade and Investment Partnership, TTIP）於 2013 年 6 月啟動，目標創建全球最大 FTA。15 輪實質會談涵蓋市場進入、法規合作、爭端解決，但因 2016 年 7 月歐方文件外洩、爭議性 ISDS 條款、川普當選等因素，2016 年底實質停滯，2019 年正式宣告談判結束。\n\n【二、拜登修補時期（2021–2024）】拜登政府未重啟 TTIP，改透過「貿易與技術委員會」（Trade and Technology Council, TTC）、《全球永續鋼鋁安排》（GSSA，未完成）、IPEF 等多軌互動。實質上歐美貿易關係由「自由化」轉向「監管協調」與「對華協調」。\n\n【三、川普 2.0 關稅戰（2025/4-）】2025 年 4 月川普政府宣布對歐盟徵收 20% 關稅、後調為 15% 基準關稅 + 部門加徵（汽車 25%、鋼鋁 50%）。歐方依《反脅迫工具》（ACI）與《補貼法規》多項反制方案準備。\n\n【四、2025 框架安排（2025/7）】2025 年 7 月 27 日，川普與 von der Leyen 於蘇格蘭川普高爾夫球場宣布達成「美歐貿易框架協議」：\n  - 美方對歐盟產品保留 15% 基準關稅（汽車為主）\n  - 歐方承諾購買約 7,500 億美元美方能源（LNG、核燃料）、軍備\n  - 歐方對美方所有工業品零關稅\n  - 鋼鋁關稅安排另行談判\n  - 製藥、半導體、貴金屬部門爭議延後\n\n此框架被歐方部分成員國（法國、德國）批評為「不平衡」，但歐方執委會選擇接受以避免關稅戰升級。後續細節談判（特別是各部門配額）持續進行中。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'European Commission — EU-US', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/united-states_en', lang: 'en' }],
  },
  'tpp-original': {
    latestStatus: {
      summary: '《跨太平洋夥伴協定》（TPP）12 國於 2016 年 2 月簽署，但因美國於 2017 年 1 月退出而未能生效。其餘 11 國其後改組為 CPTPP（2018 年生效），TPP 原協定已實質由 CPTPP 取代。',
      detail:
        'TPP（Trans-Pacific Partnership）起源於 2002 年的「P4」協定（汶、智、新、紐 4 國，2006 年生效），美國於 2008 年加入擴大談判後，逐漸擴展為 12 國（增澳、加、日、馬、墨、秘、越）。\n\n【談判歷程】\n  - 2008/9：美方加入\n  - 2008–2015：30 輪實質會談\n  - 2015/10/5：亞特蘭大部長會議完成談判\n  - 2016/2/4：紐西蘭奧克蘭簽署\n\n【高標準特色】30 章涵蓋：第 14 章電子商務（全球首部 FTA 級數位章節，含跨境資料流動、禁資料在地化、禁強制揭露原始碼）；第 18 章智財（含著作權保護期延長至作者死後 70 年）；第 19 章勞動、第 20 章環境；第 17 章國營事業（首部 FTA 級 SOE 規範）；ISDS 含「投資人對地主國」機制。\n\n【美國退出】2016 年美國大選，川普與希拉蕊均反對 TPP。川普於 2017/1/23 就職後 3 日簽署行政命令退出 TPP。退出後 TPP 因「至少 6 個簽署國（合計佔 GDP 85%）批准方能生效」門檻無法達成（美方佔約 60% GDP）而未生效。\n\n【餘 11 國對應】2017/5 智利 Viña del Mar 部長會議啟動「11 國 TPP」談判，2017/11 越南 APEC 達成原則協議，凍結 22 項主要為美方主推的條款（多為智財、ISDS），其餘照常適用。2018/3/8 智利簽署《跨太平洋夥伴全面進步協定》（CPTPP），同年 12/30 生效。\n\n【歷史意義】TPP 雖未生效，但其高標準條款透過 CPTPP、USMCA、USJDTA、IPEF 等延續，是 2010 年代「下一代 FTA」最重要的範本文件。',
      asOf: '2018-12', byTool: true,
    },
    sourceDocs: [{ label: 'New Zealand MFAT — CPTPP', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/free-trade-agreements-in-force/cptpp', lang: 'en' }],
  },

  // ── 歷史里程碑（byTool）──
  'cobden-chevalier': {
    latestStatus: {
      summary: '《英法商務條約》（1860）引入最惠國（MFN）原則並透過互相援引擴散至歐洲各國，奠定 19 世紀自由貿易網絡的基礎。屬歷史性條約，於一次大戰前後的保護主義浪潮中式微。',
      detail:
        '《科布登—謝瓦利耶條約》（Cobden-Chevalier Treaty）由英國經濟學家 Richard Cobden 與法方代表 Michel Chevalier 主導談判，1860 年 1 月 23 日簽署，是工業革命後第一個現代意義的雙邊「貿易自由化」條約。\n\n【主要內容】(1) 英國對法國葡萄酒、白蘭地、絲綢等大幅降稅；(2) 法國對英國工業品（煤、鐵、機械、紡織）大幅降稅，多項免稅；(3) 第一條納入**「最惠國條款」**（MFN clause）：任一方對第三國給予的優惠，自動延伸至對方。\n\n【「條約網絡」效應】MFN 條款形成「條約串聯效應」：英法之後，歐洲各國相繼簽署雙邊貿易條約，相互援引 MFN，使優惠條款快速擴散。1860–1875 年間：法國—比利時（1861）、英國—比利時（1862）、英國—義大利（1863）、法國—關稅同盟（1862）、法國—瑞士（1864）等共逾 50 個條約。\n\n【經濟影響】19 世紀下半葉成為「自由貿易黃金時代」：歐洲平均關稅由 1820 年代約 50% 降至 1875 年約 9–12%；歐洲內部貿易大幅成長。\n\n【衰落】1873 年「長期蕭條」後，農業保護主義興起：德國 1879 年俾斯麥關稅、法國 1881 年 Méline 關稅、義大利 1887 年關稅、各國相繼提高農產品關稅。1892 年法國《Méline 法》正式廢除自由貿易、提高工業品關稅，標誌條約體系實質終結。1914 年一戰爆發後，條約體系完全瓦解。\n\n【歷史地位】(1) MFN 原則經 Cobden-Chevalier 確立，成為 20 世紀 GATT/WTO 體系的核心原則之一（GATT 第 1 條）；(2) 條約串聯效應為當代「FTA 第三方援用條款」（含 CPTPP、RCEP）的雛形；(3) 19 世紀自由貿易—20 世紀初保護主義—戰後 GATT 自由化，形成貿易史的「鐘擺」循環。',
      asOf: '1914-01', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Principles of the trading system (MFN)', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact2_e.htm', lang: 'en' }],
  },
  'mckinley-tariff': {
    latestStatus: {
      summary: '美國《麥金利關稅法》（1890）將平均進口關稅大幅提高至約 48%，是 19 世紀末美國保護主義的代表，屬歷史事件。',
      detail:
        '《麥金利關稅法》（McKinley Tariff Act）由眾議員 William McKinley（俄亥俄州，後當選總統）主導，1890 年 10 月 1 日經 Harrison 總統簽署生效。\n\n【主要內容】(1) 將美國進口關稅平均稅率由原約 38% 提高至 48–50%；(2) 涵蓋約 1,500 項商品；(3) 含「互惠條款」：授權總統與外國協商互惠安排（後與南美洲、加勒比國家簽訂多個雙邊協定）；(4) 將部分原免稅的農產品（如蛋、馬鈴薯）改為徵稅；(5) 對糖原料（粗糖）改為免稅，但對精製糖實質加稅，保護國內糖業。\n\n【政治背景】(1) 共和黨主張保護國內製造業免受英國工業品競爭；(2) 民主黨反對，認為將拉高消費物價、傷害農民與消費者；(3) 法案通過後 1 個月即舉行 1890 年國會期中選舉，共和黨慘敗（眾院從 173-156 多數變為 88-235 少數），多人歸因麥金利關稅引發的物價上漲。\n\n【經濟影響】(1) 物價上漲，特別是日用品；(2) 部分產業（如錫板、玻璃）獲保護後快速擴張；(3) 美國對加拿大關係惡化，加方加徵對美關稅報復；(4) 1894 年民主黨控制國會通過《威爾遜-高爾曼關稅法》，下調關稅至約 42%。\n\n【歷史意義】(1) 麥金利雖因關稅法在期中選舉中失利，但因經濟周期回穩與「金本位辯論」轉移焦點，1896 年當選總統，後 1897 年《丁利關稅法》進一步提高關稅至 57%；(2) 是 19 世紀末「鍍金時代」（Gilded Age）保護主義代表，與斯姆特-霍利（1930）、川普關稅（2018/2025）形成美國保護主義三大高峰。',
      asOf: '1894-01', byTool: true,
    },
    sourceDocs: [{ label: 'US Office of the Historian — Tariffs', url: 'https://history.state.gov/milestones', lang: 'en' }],
  },
  'imperial-preference': {
    latestStatus: {
      summary: '《渥太華協定》（1932）建立大英帝國內部的特惠關稅制度（帝國特惠制），對外則築起關稅壁壘。二戰後在 GATT 多邊自由化下逐步瓦解，屬歷史制度。',
      detail:
        '《渥太華協定》（Ottawa Agreements，正式名稱為 1932 年「英國大英帝國經濟會議」協定）由英國與其自治領（加拿大、澳洲、紐西蘭、南非、愛爾蘭、紐芬蘭）及殖民地於 1932 年 8 月在渥太華簽署，建立「**帝國特惠制**」（Imperial Preference）。\n\n【背景】(1) 1929 年大蕭條後，全球貿易急劇萎縮；英國於 1931 年放棄金本位、1932 年通過《進口稅法》引入 10% 一般關稅，標誌歷時 86 年的自由貿易政策（自 1846 年《穀物法》廢除以來）正式結束；(2) 英國工業需要保護免受美、德、日競爭；(3) 自治領要求英方對其農產品（小麥、牛肉、乳製品）優惠待遇。\n\n【主要內容】\n(1) **帝國內優惠**：成員間相互降低關稅，享受比第三國更優惠待遇；\n(2) **對外關稅壁壘**：對非帝國成員加徵 10–30% 關稅；\n(3) **數量配額**：對特定商品（如肉品、乳製品）設配額。\n\n【經濟成果】(1) 英國對自治領出口由 1929 年佔總出口 27% 升至 1938 年 40%；自治領對英農產品出口大幅成長；(2) 但全球貿易因各國保護主義萎縮、競爭性貶值，帝國特惠制亦助長全球貿易碎片化。\n\n【二戰後瓦解】(1) 美國對英方在《租借法案》（Lend-Lease, 1941）與布雷頓森林會議（1944）中要求承諾廢除帝國特惠制；(2) GATT 1947 第 1 條 MFN 原則實質上禁止此類歧視性安排，但因英方堅持，第 1 條允許「保留現有特惠」（grandfather clause），帝國特惠制因此得以延續但不得擴大；(3) 1973 年英國加入 EEC 後，逐步以歐洲共同對外關稅取代帝國特惠制；(4) 1980 年代以來，原帝國特惠制成員多透過 GSP（普遍化優惠關稅制度）與英國接續經貿往來。\n\n【歷史意義】(1) 帝國特惠制是 20 世紀經濟史上少數延續逾 40 年的歧視性貿易安排；(2) GATT 第 1 條「祖父條款」設計反映多邊體系與既有特惠安排之妥協；(3) 2020 年代英方脫歐後的「CPTPP 加入」、「英印 FTA」可被視為英方對「失去帝國貿易圈」的當代回應。',
      asOf: '1947-01', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — The GATT years', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact4_e.htm', lang: 'en' }],
  },
  'hawley-smoot': {
    latestStatus: {
      summary: '美國《斯姆特—霍利關稅法》（1930）大幅調高逾兩萬項商品關稅，引發各國報復、加劇全球貿易萎縮與大蕭條，常被引為保護主義之鑑，屬歷史事件。',
      detail:
        '《斯姆特—霍利關稅法》（Smoot-Hawley Tariff Act）由參議員 Reed Smoot（猶他州）與眾議員 Willis Hawley（俄勒岡州）提出，1930 年 6 月 17 日經總統胡佛（Herbert Hoover）簽署成法。\n\n【背景】(1) 1929 年 10 月華爾街股市崩盤，總統胡佛競選承諾保護美國農民免於進口農產品競爭；(2) 1,028 位美國經濟學家連署反對（包括 Irving Fisher 等知名學者），警告將引發報復；(3) 福特、通用汽車、JP Morgan 等大企業反對；(4) 法案仍以 222-153（眾）、44-42（參）通過。\n\n【主要內容】將美國平均進口關稅由約 38% 提高至約 60%（按可徵稅商品計算）；涉及逾 20,000 項商品；多為農產品與工業品。\n\n【國際報復】(1) 加拿大立即對 16 項美方商品加徵關稅；(2) 義大利、法國、西班牙、瑞士、英國（含英聯邦）相繼採取報復措施；(3) 全球進口關稅 1929–1933 平均提高約 65%。\n\n【經濟影響】(1) 美國出口由 1929 年 53 億美元降至 1933 年 17 億美元（−68%）；(2) 全球貿易由 1929 年 360 億美元降至 1932 年 120 億美元（−66%）；(3) 美國失業率由 1929 年 3% 升至 1933 年 25%；(4) 雖大蕭條成因複雜（含貨幣政策、金本位制），但斯姆特—霍利公認為「將衰退轉為大蕭條」的關鍵推手。\n\n【後續修補】(1) 1934 年羅斯福總統推動《互惠貿易協定法》（RTAA），逆轉斯姆特—霍利精神；(2) 1947 年 GATT 建立多邊降稅框架；(3) 美國平均關稅從 1933 年 60% 降至 2024 年約 2%（川普關稅前）。\n\n【當代啟示】斯姆特—霍利成為「保護主義警世故事」的經典案例，常被用於批評貿易戰；2018 年川普對華關稅、2025 年全球基準關稅政策均引發學界廣泛比較。',
      asOf: '1934-01', byTool: true,
    },
    sourceDocs: [{ label: 'US Office of the Historian — Smoot-Hawley', url: 'https://history.state.gov/milestones/1921-1936/protectionism', lang: 'en' }],
  },
  'rtaa-1934': {
    latestStatus: {
      summary: '美國《互惠貿易協定法》（RTAA，1934）將關稅談判授權由國會移轉至總統，開啟以雙邊互惠協定降低關稅的時代，為戰後 GATT 多邊體系奠基。其精神已由 GATT/WTO 承接。',
      detail:
        '《互惠貿易協定法》（Reciprocal Trade Agreements Act, RTAA）由國務卿 Cordell Hull 主導，1934 年 6 月 12 日經羅斯福總統簽署生效，是美國貿易政策史上里程碑式立法。\n\n【背景】《斯姆特—霍利關稅法》（1930）保護主義引發全球報復，加劇大蕭條。羅斯福政府為扭轉局面、振興出口、修補與盟邦關係，需突破國會逐項投票的慣性。\n\n【主要內容】\n(1) **授權移轉**：國會授權總統與外國談判雙邊互惠協定，將特定品項關稅最多調降 50%，**無需逐個重新立法批准**（此前美國憲法傳統下，關稅由國會詳細制定）；\n(2) **互惠原則**：對方須提供相當之關稅優惠；\n(3) **MFN 自動延伸**：協定中之降稅自動延伸至所有與美方有 MFN 待遇之國家；\n(4) **3 年期限**：原始法 3 年屆期，後續多次續展（1937、1940、1943…）至 1962 年由《貿易擴展法》取代。\n\n【主要協定】RTAA 授權下，美方 1934–1947 年間與 30 餘國簽署雙邊互惠協定，含古巴（1934）、巴西（1935）、加拿大（1935）、英國（1938）、阿根廷（1941）等。\n\n【經濟影響】美國平均關稅由 1933 年約 60% 降至 1947 年約 25%；雙邊互惠模式為戰後 GATT 多邊降稅奠定範本與政治可行性基礎。\n\n【歷史意義】\n(1) RTAA 確立「**行政協定模式**」（executive agreement），開啟總統主導對外貿易談判之傳統，影響至今；\n(2) MFN 自動延伸機制為 GATT 第 1 條 MFN 原則的直接前身；\n(3) 1962《貿易擴展法》延續 RTAA 精神，賦予甘迺迪總統授權啟動甘迺迪回合；\n(4) 後續歷次《貿易法》（1974、1988、2002、2015）均建立「快速通關」（Trade Promotion Authority, TPA）機制，亦源自 RTAA。',
      asOf: '1947-01', byTool: true,
    },
    sourceDocs: [{ label: 'US Office of the Historian — RTAA', url: 'https://history.state.gov/milestones/1921-1936/protectionism', lang: 'en' }],
  },
  'us-uk-1938': {
    latestStatus: {
      summary: '《美英貿易協定》（1938）為依《互惠貿易協定法》簽署的雙邊降稅協定，是二戰前美英經貿合作的代表，屬歷史協定，後為 GATT 多邊體系取代。',
      detail:
        '《美英貿易協定》（U.S.-U.K. Trade Agreement of 1938）由美國國務卿 Cordell Hull 與英國駐美大使 Sir Ronald Lindsay 於 1938 年 11 月 17 日在華盛頓簽署，1939 年 1 月 1 日生效。\n\n【談判脈絡】(1) 美方依《互惠貿易協定法》（RTAA，1934）授權與多國談判雙邊降稅協定；(2) 英方為《渥太華協定》（1932）的核心，內部受帝國特惠制保護；(3) 美方希望突破英方帝國特惠制壁壘，但英方堅持優先維持自治領利益。\n\n【主要內容】(1) 美方對英方汽車、紡織、陶瓷、威士忌、玩具等約 1,000 項商品降稅；(2) 英方對美方水果、菸草、汽車零件、化學品、機械等降稅；(3) 含 MFN 條款，使其他與英美簽 MFN 之國家亦自動受惠；(4) 英方堅持保留對加拿大、澳洲、紐西蘭之既有特惠（帝國特惠制不受影響）。\n\n【歷史脈絡】此協定簽署於慕尼黑會議（1938/9）後 2 個月、德國併吞奧地利後 8 個月。美英將協定視為兩大民主國家在納粹威脅下「象徵性團結」的舉動；協定亦反映 Hull 國務卿「自由貿易促進世界和平」之主張。\n\n【經濟成果】因二戰爆發（1939/9）僅 8 個月後，協定實質運作期短；戰時美英經貿關係改由《租借法案》（1941）主導，協定本身重要性下降。\n\n【後續】二戰結束後，1947 GATT 採行多邊降稅模式，美英 1938 協定中的降稅承諾被吸收進入 GATT 第一輪減讓表。1948 年 GATT 生效後，美英 1938 雙邊協定正式失效，由 GATT 體系取代。\n\n【歷史意義】(1) RTAA 1934 後美方最具份量的雙邊協定；(2) 體現美方戰前「以貿易促進民主」之政策；(3) 為戰後 GATT 多邊主義之鋪墊。',
      asOf: '1947-01', byTool: true,
    },
    sourceDocs: [{ label: 'US Office of the Historian', url: 'https://history.state.gov/milestones', lang: 'en' }],
  },
  'eec-rome': {
    latestStatus: {
      summary: '《羅馬條約》（1957）創立歐洲經濟共同體（EEC），建立共同市場與關稅同盟，是歐洲整合的起點。EEC 其後歷經《馬斯垂克條約》等演變為今日的歐洲聯盟（EU）。',
      asOf: '1993-11', byTool: true,
    },
    sourceDocs: [{ label: 'EU — Treaty of Rome', url: 'https://european-union.europa.eu/principles-countries-history/history-eu_en', lang: 'en' }],
  },
  'efta-1960': {
    latestStatus: {
      summary: '《斯德哥爾摩公約》（1960）創立歐洲自由貿易協會（EFTA）。雖多數創始國其後加入歐盟，EFTA 至今仍由瑞士、挪威、冰島、列支敦斯登 4 國維持運作，並對外積極簽署 FTA。',
      detail:
        '歐洲自由貿易協會（European Free Trade Association, EFTA）由 1960 年 1 月 4 日《斯德哥爾摩公約》（Stockholm Convention）建立，1960 年 5 月 3 日生效，由英、奧、丹、挪、葡、瑞典、瑞士 7 國發起。後芬蘭（1961 聯繫、1986 正式）、冰島（1970）、列支敦斯登（1991）加入。\n\n【「七國 vs 六國」歷史】EFTA 為對抗歐洲經濟共同體（EEC，6 國）而成立。英方倡議「自由貿易區」（無共同對外關稅）以平衡 EEC 的「關稅同盟」模式。\n\n【會員流失】成員陸續轉投歐盟：英、丹（1973）、葡（1986）、奧、芬、瑞典（1995）。現會員：瑞士、挪威、冰島、列支敦斯登（4 國）。\n\n【主要功能】\n(1) **內部自由貿易**：成員間貨品零關稅（不含農業 / 漁業）；\n(2) **EEA 機制**：3 個會員（不含瑞士）透過 EEA 參與歐盟單一市場；瑞士透過雙邊條約模式整合；\n(3) **對外 FTA 網絡**：EFTA 集體與全球約 40 個國家/區域簽 FTA，包括加拿大、墨西哥、智利、新加坡、韓國、印度、中國香港、海合會（GCC）等；2025 年完成與 Mercosur、印度 FTA。\n\n【特色】(1) EFTA 對外 FTA 通常較歐盟更具彈性，能更快達成（因無農業共同政策、無內部立法障礙）；(2) 4 個會員均為高所得國家（人均 GDP 約 9 萬美元）、合計人口僅約 1,400 萬，但對外貿易約 7,000 億美元，是全球重要的貿易主體。\n\n【法律機構】EFTA 法院（盧森堡）、EFTA 監督機構（ESA，布魯塞爾）、EFTA 秘書處（日內瓦）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'EFTA 官方網站', url: 'https://www.efta.int/', lang: 'en' }],
  },
  'lafta': {
    latestStatus: {
      summary: '拉丁美洲自由貿易協會（LAFTA，1960）為拉美早期區域整合嘗試，因目標過於宏大而成效有限，1980 年由更具彈性的拉丁美洲整合協會（ALADI）取代。',
      detail:
        '《蒙特維多條約》（Treaty of Montevideo, 1960）由阿根廷、巴西、智利、墨西哥、巴拉圭、秘魯、烏拉圭 7 國於 1960 年 2 月 18 日簽署，1961 年 6 月 2 日生效，建立拉丁美洲自由貿易協會（Latin American Free Trade Association, LAFTA / 西：ALALC）。其後玻利維亞（1967）、哥倫比亞、厄瓜多（1961）、委內瑞拉（1966）相繼加入，共 11 個會員。\n\n【目標】依 GATT 第 24 條（自由貿易區例外），於 12 年內（後延至 20 年）逐步消除成員間絕大多數關稅與貿易障礙，建立拉美自由貿易區。\n\n【主要機制】(1) **共同清單**（Common List）：所有成員每 3 年共同協商一批關稅減讓；(2) **國家清單**（National List）：成員每年自行提供雙邊降稅；(3) **產業互補協定**：針對特定產業（如汽車、化工）的次區域協定。\n\n【失敗主因】\n(1) 經濟發展差距過大：阿、巴、墨「大三」（占 80% GDP）與其他「小八」存在結構性差距，後者擔憂被前者壟斷；\n(2) 進口替代主義：1960–70 年代拉美各國推行進口替代工業化（ISI），對降稅敏感，多次中止；\n(3) 政治不穩：軍政變、左右派輪替、彼此猜忌；\n(4) 共同清單機制過於剛性：要求「全體一致同意」，談判效率低；\n(5) 1970 年代石油危機加劇分歧。\n\n【次區域分裂】1969 年部分成員（玻、智、厄、哥、秘）退出 LAFTA 共同進展、另創安第斯共同體（CAN）；中美洲共同市場（CACM）、加勒比共同體（CARICOM）亦先後成立，使 LAFTA 整體運作更為碎片化。\n\n【取代】1980 年 8 月 12 日《蒙特維多條約 1980》取代原條約，建立彈性更高的 ALADI。LAFTA 的失敗成為拉美區域整合「不可過度雄心」的歷史教訓，影響其後 Mercosur、太平洋聯盟等的設計。',
      asOf: '1980-08', byTool: true,
    },
    sourceDocs: [{ label: 'ALADI', url: 'https://www.aladi.org/', lang: 'es' }],
  },
  'aladi': {
    latestStatus: {
      summary: '拉丁美洲整合協會（ALADI，1980）取代 LAFTA，以彈性的雙邊與次區域優惠安排推動拉美經濟整合，現有 13 個會員國，為 Mercosur、安第斯共同體等的制度傘架，持續運作。',
      detail:
        '拉丁美洲整合協會（Asociación Latinoamericana de Integración, ALADI）由 1980 年 8 月 12 日《蒙特維多條約》（Montevideo Treaty 1980）建立，1981 年生效，取代 1960 年的 LAFTA。秘書處設於烏拉圭蒙特維多。\n\n【為何取代 LAFTA】LAFTA（1960）採剛性「全體共同降稅」模式，要求 12 年內達零關稅，但因成員經濟發展差距過大而失敗。ALADI 改採「彈性整合」：允許成員以雙邊、多邊、次區域形式自由安排優惠。\n\n【成員】13 個正式會員國：阿根廷、玻利維亞、巴西、智利、哥倫比亞、古巴、厄瓜多、墨西哥、巴拿馬（2012 加入）、巴拉圭、秘魯、烏拉圭、委內瑞拉；尼加拉瓜（2011 通過加入但未完成）。\n\n【三大優惠類別】\n(1) **區域關稅優惠**（PAR）：對全體成員的部分關稅減讓；\n(2) **區域範圍協定**（AAR）：可於部分成員間就單一議題達成（如關稅、服務、貿易便捷化）；\n(3) **部分範圍協定**（AAP）：成員間雙邊或次區域 FTA。\n\n【實質角色】(1) ALADI 為拉美「FTA 制度傘架」：成員間絕大多數 FTA（含 Mercosur、安第斯共同體、智利 FTA 網絡）均以 ALADI 為法律基礎；(2) 對 LDC 成員（玻、厄、巴拉圭）給予「特殊待遇」（NMF Plus）；(3) 為拉美在 WTO 體系下「整體南方」談判提供平台。\n\n【現況】2024 年成員間區內貿易約 1,500 億美元，佔總貿易約 13%（雖低於歐盟、北美），但 ALADI 作為制度框架在持續運作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ALADI 官方網站', url: 'https://www.aladi.org/', lang: 'es' }],
  },
  'asean-founding': {
    latestStatus: {
      summary: '《曼谷宣言》（1967）創立東南亞國家協會（ASEAN）。東協其後由 5 國擴展至 10 國，並於 2015 年建立東協經濟共同體（AEC），成為全球重要的區域組織，持續運作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN 官方網站', url: 'https://asean.org/', lang: 'en' }],
  },
  'caricom-1973': {
    latestStatus: {
      summary: '《查瓜拉馬斯條約》（1973）創立加勒比共同體（CARICOM），推動加勒比地區單一市場與經濟整合（CSME），現有 15 個成員國，持續運作。',
      detail:
        '《查瓜拉馬斯條約》（Treaty of Chaguaramas）於 1973 年 7 月 4 日由 4 個前英屬殖民地（巴貝多、蓋亞那、牙買加、千里達及托巴哥）簽署，創立加勒比共同體（Caribbean Community, CARICOM），1973 年 8 月 1 日生效。2001 年修訂為《查瓜拉馬斯修訂條約》，建立加勒比單一市場與經濟（CSME）架構。\n\n【成員】15 個正式會員國：安提瓜及巴布達、巴哈馬、巴貝多、貝里斯、多明尼克、格瑞那達、蓋亞那、海地、牙買加、蒙瑟瑞、聖克里斯多福及尼維斯、聖露西亞、聖文森及格瑞那丁、蘇利南、千里達及托巴哥。另有 5 個聯繫會員（含百慕達、開曼、英屬維京群島等）。\n\n【主要內容】(1) 共同市場：成員間貨品、服務、資本、人員自由流通；(2) 共同對外關稅；(3) 共同貿易政策；(4) 經濟政策協調；(5) 加勒比法院（CCJ）為爭端解決機關，部分成員亦以其取代英國樞密院作為終審法院。\n\n【規模】總人口約 1,800 萬、合計 GDP 約 1,000 億美元，雖規模小，但為加勒比區域整合的核心制度。\n\n【對外關係】CARICOM 與歐盟簽有《CARIFORUM-EU 經濟夥伴協定》（2008，含古巴）；與加拿大、哥斯大黎加、哥倫比亞、委內瑞拉、多明尼加共和國有貿易安排；2024 年起與英國談判 FTA。\n\n【挑戰】(1) 海地長期動盪影響整體運作；(2) 與美國雙邊關係（特別是貿易、移民）持續為議題；(3) 氣候變遷對小島國的存亡威脅。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'CARICOM 官方網站', url: 'https://caricom.org/', lang: 'en' }],
  },
  'andean-community': {
    latestStatus: {
      summary: '安第斯共同體（CAN，1969 年《卡塔赫納協定》）為南美洲的關稅同盟與整合機制，現有玻利維亞、哥倫比亞、厄瓜多、秘魯 4 個會員國，與 Mercosur 並列南美兩大整合集團，持續運作。',
      detail:
        '安第斯共同體（Comunidad Andina, CAN）由 1969 年 5 月 26 日《卡塔赫納協定》（Cartagena Agreement）建立，原稱「安第斯集團」（Andean Group），1996 年改為現名。\n\n【會員變動】\n  - 創始會員：玻利維亞、智利、哥倫比亞、厄瓜多、秘魯（共 5 國）\n  - 1973：委內瑞拉加入\n  - 1976：智利退出（皮諾契政權政策分歧）\n  - 2006：委內瑞拉退出（轉向 Mercosur）\n  - 現會員：玻利維亞、哥倫比亞、厄瓜多、秘魯（4 國）\n  - 聯繫國：阿根廷、巴西、智利、巴拉圭、烏拉圭（Mercosur 4 國）\n\n【主要架構】(1) 共同對外關稅（CET）：理論上存在，但成員實質執行不一；(2) 自由貿易區：成員間 100% 工業品零關稅；(3) 共同農業政策；(4) 自然人移動：互相承認 CAN 國民簽證簡化；(5) 機構：安第斯議會、安第斯法院、總秘書處（設於利馬）。\n\n【規模】總人口約 1.1 億，合計 GDP 約 7,800 億美元；2024 年內部貿易約 100 億美元，雖佔總貿易僅 10%，但對小型成員（玻、厄）非常重要。\n\n【挑戰】(1) 與 Mercosur 競合：兩集團簽有《經濟互補協定》（ACE）相互優惠，但完整整合「南美共同體」（UNASUR）計畫已停滯；(2) 厄瓜多、秘魯、哥倫比亞均與美方簽 FTA，使 CAN 對外貿易政策碎片化；(3) 玻利維亞 2024 年加入 Mercosur 後，其 CAN 會籍與義務之關係待釐清。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Comunidad Andina', url: 'https://www.comunidadandina.org/', lang: 'es' }],
  },
  'auto-pact-1965': {
    latestStatus: {
      summary: '《加美汽車產品協定》（Auto Pact，1965）建立北美汽車業的免關稅整合，深刻形塑跨境供應鏈。其優惠安排於 2001 年因 WTO 裁決違反規則而終止，相關功能由 NAFTA／USMCA 承接。',
      detail:
        '《加美汽車產品協定》（Canada-United States Automotive Products Agreement, Auto Pact）於 1965 年 1 月 16 日由加總理 Pearson 與美總統 Johnson 在德州 LBJ 牧場簽署，1966 年生效。\n\n【背景】1960 年代加方汽車業生產規模小、成本高，無法與美方競爭。Auto Pact 旨在透過北美整合提升加方汽車業競爭力，並維持加方就業。\n\n【主要內容】\n(1) **整車免關稅**：加方對符合資格的美方汽車製造商（限「Big Three」福特、通用、克萊斯勒、後加 American Motors）的整車進口免關稅；\n(2) **零件免關稅**：合資格製造商對汽車零件互運免關稅；\n(3) **加方安全閥**：加方規定合資格製造商須在加方維持一定的「生產對銷售比」（production-to-sales ratio）與最低「加方加值含量」（CVA），實質保障加方汽車業；\n(4) **不對其他國家適用**：屬美加之間排他性安排。\n\n【經濟成果】生效後 35 年間，加方汽車業由「小規模當地組裝」轉型為「北美整合生產基地」，年產約 250 萬輛、就業約 13 萬人，安大略汽車業 GDP 大幅成長。NAFTA（1994）將汽車優惠延伸至墨西哥。\n\n【WTO 裁決與終止】\n  - 1998：日本、歐盟在 WTO 控告 Auto Pact 之歧視性安排違反 MFN（DS139、DS142）\n  - 2000/2：WTO 上訴機構裁定加方違反；\n  - 2001/2：加方廢除 Auto Pact 優惠關稅，相關功能由 NAFTA 第 4 章（汽車原產地）承接；\n  - 2020：USMCA 進一步強化北美汽車原產地（75% 北美比例、40-45% 勞動價值含量）。\n\n【歷史意義】(1) Auto Pact 為產業特定 FTA 之經典案例，影響後續全球汽車業 RTA 設計；(2) 也是 WTO 機制糾正 MFN 違反的代表案例；(3) 加方汽車業迄今仍在全球前 10 大生產國之列，Auto Pact 奠定的整合根基持續發揮作用。',
      asOf: '2001-02', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Canada Autos dispute (DS139/142)', url: 'https://www.wto.org/english/tratop_e/dispu_e/cases_e/ds139_e.htm', lang: 'en' }],
  },
  'us-israel-1985': {
    latestStatus: {
      summary: '美國—以色列自由貿易協定（1985）是美國史上第一個自由貿易協定，已消除雙邊絕大多數貨品關稅，至今仍生效，並為後續美國 FTA 樹立範式。',
      detail:
        '美以 FTA 於 1985 年 4 月 22 日簽署、9 月 1 日生效，為美國史上第一個自由貿易協定，亦是以色列首個全面性 FTA。\n\n【談判動機】(1) 美方：戰略夥伴關係深化、創設 FTA 範本；(2) 以方：突破阿拉伯國家經濟封鎖、進入美國市場。\n\n【主要承諾】10 年內逐步消除所有貨品關稅，1995 年 1 月 1 日達成全面零關稅。涵蓋反傾銷、原產地規則、政府採購；服務貿易、智財、投資未列入原協定。\n\n【補充協定】\n  - 1985 同時簽署《農業協定》（QIZ 機制）；\n  - 1996 《貿易便捷化》：簡化通關；\n  - 2004 修訂《農業協定》延長、規範新增農產品；\n  - 1996 美國通過《合格工業區》（QIZ）擴大方案，使約旦、埃及部分工業區產品（含一定比例以色列原料）得免稅進入美國，間接擴大協定效益。\n\n【經濟成果】1985 雙邊貨品貿易約 49 億美元，2023 達 440 億美元（近 9 倍成長）；以色列為美國第 23 大貿易夥伴，美方為以色列最大貿易夥伴；半導體、製藥、軟體、農業科技為主要受惠領域。\n\n【歷史意義】開啟美國「以 FTA 為外交工具」時代，奠定 NAFTA（1994）、約旦 FTA（2001）等後續協定基礎；其「全面零關稅 + 簡單機制」模式雖未被後續複雜化的美方 FTA 完全沿用，但仍為現代 FTA 雛形。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'USTR — Israel FTA', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/israel-fta', lang: 'en' }],
  },
  'cer-anzcerta': {
    latestStatus: {
      summary: '澳洲—紐西蘭《更緊密經濟關係貿易協定》（ANZCERTA／CER，1983）是全球最全面、自由化程度最高的 FTA 之一，已實現貨品與服務的近乎完全自由流通，持續深化（如單一經濟市場議程）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Australia DFAT — ANZCERTA', url: 'https://www.dfat.gov.au/trade/agreements/in-force/anzcerta', lang: 'en' }],
  },
  'mercosur-1991': {
    latestStatus: {
      summary: '《亞松森條約》（1991）創立南方共同市場（Mercosur），由阿根廷、巴西、巴拉圭、烏拉圭組成關稅同盟。其後對外談判漸增（如 2024 年與歐盟達成協議），為南美最大整合集團，持續運作。',
      detail:
        '南方共同市場（Mercado Común del Sur, Mercosur / 葡：Mercosul）由阿根廷、巴西、巴拉圭、烏拉圭於 1991 年 3 月 26 日於巴拉圭亞松森（Asunción）簽署《亞松森條約》而成立，1995 年 1 月 1 日正式運作為關稅同盟。\n\n【主要文件】\n  - 1991《亞松森條約》：創立 Mercosur\n  - 1994《歐魯普雷圖議定書》（Ouro Preto Protocol）：賦予 Mercosur 國際法人地位、確立機構架構\n  - 1998《尤希蒂亞議定書》（Ushuaia Protocol）：民主條款\n  - 2002《奧利沃斯議定書》（Olivos Protocol）：常設爭端解決法庭\n\n【會員變動】\n  - 創始：阿、巴、巴拉圭、烏\n  - 委內瑞拉：2012 加入，2016 起會籍被暫停（迄今）\n  - 玻利維亞：2024/8 完成加入程序，成為第 5 個正式會員\n  - 觀察員/聯繫國：智利、秘魯、哥倫比亞、厄瓜多、蓋亞納、蘇利南\n\n【關稅同盟】共同對外關稅（CET）平均約 14%，惟阿根廷與巴西長期對汽車、糖、家電維持例外，致 CET 完整性受限。\n\n【對外協定】\n  - 早期 FTA：智利（1996）、玻利維亞（1997）、安第斯共同體（2004）、印度（2009）、以色列（2010）、埃及（2017）\n  - 近年突破：歐盟（2024/12 政治協議）、新加坡（2023/12 簽署）、EFTA（2025 完成談判）、加拿大、印尼（談判中）\n\n【規模】總人口約 3.1 億，總 GDP 約 3 兆美元，是全球第 5 大經濟集團；對外貿易約 7,000 億美元。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Mercosur 官方網站', url: 'https://www.mercosur.int/', lang: 'es' }],
  },
  'afta-1992': {
    latestStatus: {
      summary: '東協自由貿易區（AFTA，1992）透過「共同有效優惠關稅」（CEPT）大幅降低區內關稅，其機制其後由《東協貨品貿易協定》（ATIGA）與東協經濟共同體（AEC）承接深化，持續運作。',
      detail:
        '東協自由貿易區（ASEAN Free Trade Area, AFTA）於 1992 年 1 月 28 日新加坡第 4 屆東協高峰會通過，由原 ASEAN-6（汶、印尼、馬、菲、新、泰）啟動，後續擴及越（1995）、寮緬（1997）、柬（1999）共 10 國。\n\n【核心機制】「共同有效優惠關稅」（CEPT - Common Effective Preferential Tariff）：簽署國對符合原產地規則的東協內部產品，逐步降至 0–5% 關稅。原訂 15 年達成，後縮短至 10 年。\n\n【主要里程碑】\n  - 2003：ASEAN-6 對 99% 產品達 0–5%\n  - 2010：ASEAN-6 對 99.65% 產品達 0%（含越、寮、緬、柬達 0–5%）\n  - 2015：CLMV（柬寮緬越）對 98.86% 產品達 0%\n\n【ATIGA 接續】2009 年簽署《東協貨品貿易協定》（ASEAN Trade in Goods Agreement, ATIGA），2010 年 5 月生效，整合並取代 CEPT-AFTA 與相關附屬協定，成為東協貨品貿易的單一規範文件。\n\n【AEC 整合】2015 年底東協經濟共同體（AEC）建立，AFTA/ATIGA 作為「貨品自由流通」支柱與服務貿易（AFAS）、投資（ACIA）、自然人移動（AFAMNP）等並列。\n\n【現況】2024 年東協內部貿易約 8,500 億美元（佔東協總貿易 22%），雖低於歐盟內部貿易比重，但相較 1992 年僅約 19% 已顯著提升；數位貿易與供應鏈整合（含 RCEP、DEFA）為下一階段重點。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — Economic Community', url: 'https://asean.org/our-communities/economic-community/', lang: 'en' }],
  },
  'nafta': {
    latestStatus: {
      summary: '《北美自由貿易協定》（NAFTA，1994）整合美國、加拿大、墨西哥市場逾 25 年。2020 年 7 月 1 日由重新談判的《美墨加協定》（USMCA）取代，NAFTA 正式走入歷史。',
      detail:
        '《北美自由貿易協定》（NAFTA）由美國、加拿大、墨西哥於 1992 年 12 月 17 日簽署，1994 年 1 月 1 日生效，是當時全球最大的自由貿易區（涵蓋逾 4 億人口、9 兆美元 GDP）。\n\n【內容】22 章涵蓋貨品、服務、投資（含投資人對地主國爭端解決 ISDS）、智財、競爭，並另立《北美勞動合作協定》（NAALC）與《北美環境合作協定》（NAAEC）兩個平行協定。最具特色之處為第 11 章 ISDS 機制，使企業可直接控告地主國，引發後續長期爭議。\n\n【經濟成果】生效 25 年間，三國貿易由 2,900 億美元（1993）成長至 1.2 兆美元（2018）；墨西哥對美出口、美對加投資、加西部能源產業均大幅成長。然汽車與製造業跨境供應鏈深度整合，亦帶來美國中西部「鏽帶」（Rust Belt）製造業流失爭議。\n\n【ISDS 爭議】NAFTA 第 11 章累計受理逾 80 件投資爭端，知名案例包括加方礦業公司控告墨西哥（Metalclad）、美方煙草公司控告加拿大、墨西哥控告美方等。批評認為其過度傾向跨國企業，2018 年 USMCA 重談時美加之間取消、墨西哥僅在能源、電信等部門保留。\n\n【取代】川普 2017 年 1 月就任後啟動重談，2018 年 11 月達成 USMCA，經 2019 年 12 月修訂後於 2020 年 7 月 1 日正式取代 NAFTA。USMCA 大幅調整汽車原產地（北美比例 62.5% → 75%、新增勞動價值含量 LVC）、新增數位貿易與勞動專章、納入日落條款（16 年期、6 年檢視）。',
      asOf: '2020-07', byTool: true,
    },
    sourceDocs: [{ label: 'USTR — USMCA (replacing NAFTA)', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement', lang: 'en' }],
  },
  'maastricht': {
    latestStatus: {
      summary: '《馬斯垂克條約》（1992 年簽署、1993 年生效）正式創立歐洲聯盟（EU），確立經濟暨貨幣聯盟（為歐元鋪路）與共同外交安全政策。其後經《阿姆斯特丹》《尼斯》《里斯本》等條約修訂，奠定今日 EU 架構。',
      detail:
        '《歐洲聯盟條約》（俗稱《馬斯垂克條約》）於 1992 年 2 月 7 日在荷蘭馬斯垂克簽署，1993 年 11 月 1 日生效。是繼《羅馬條約》（1957）後歐洲整合的第二大里程碑。\n\n【主要創新】\n(1) 創立「歐洲聯盟」（European Union, EU）作為法律實體名稱，整合過去的「歐洲共同體」（EC）；\n(2) 建立「三大支柱」（Three Pillars）架構：\n   - 第一支柱：歐洲共同體（經濟、農業、貿易；超國家權限）\n   - 第二支柱：共同外交與安全政策（CFSP；政府間合作）\n   - 第三支柱：司法與內政事務（JHA；政府間合作）\n(3) 確立「經濟暨貨幣聯盟」（EMU）三階段路線圖：1990 資本自由流動 → 1994 歐洲貨幣機構（EMI）→ 1999 歐元啟用（電子記帳）/ 2002 歐元紙幣與硬幣流通；\n(4) 設「歐洲公民」（European Citizenship）身分，允許跨國移動、地方選舉投票；\n(5) 設「輔助性原則」（subsidiarity）與「比例原則」；\n(6) 引入歐洲議會「共同決策程序」（codecision），擴大其立法權限。\n\n【入盟標準】明訂「哥本哈根標準」之前身，要求加入國須具備穩定民主、市場經濟、能承擔成員國義務的條件。\n\n【後續修訂】\n  - 1997《阿姆斯特丹條約》（1999 生效）：強化基本權利、社會章程；\n  - 2001《尼斯條約》（2003 生效）：為東擴調整機構表決權重；\n  - 2007《里斯本條約》（2009 生效）：廢除三支柱、創設「歐洲理事會主席」與「外交事務高級代表」、賦予《基本權利憲章》拘束力；其後歐盟法律基礎改稱《歐盟條約》（TEU）與《歐盟運作條約》（TFEU）兩大條約。',
      asOf: '2009-12', byTool: true,
    },
    sourceDocs: [{ label: 'EU — History', url: 'https://european-union.europa.eu/principles-countries-history/history-eu_en', lang: 'en' }],
  },
  'ita-1996': {
    latestStatus: {
      summary: 'WTO《資訊科技協定》（ITA，1996）消除半導體、電腦、電信設備等資訊科技產品關稅，是少數成功的複邊降稅協定。2015 年達成擴大版（ITA-II），新增約 200 項產品，持續適用。',
      detail:
        'WTO《資訊科技協定》（Information Technology Agreement, ITA）於 1996 年 12 月 13 日新加坡部長會議達成，1997 年 4 月 1 日生效，原由 29 個成員（含我國）簽署，現有 82 個 WTO 成員加入（涵蓋全球 ICT 貿易約 97%）。\n\n【ITA-I（1996）】消除約 200 項資訊科技產品關稅，包括：電腦、半導體、半導體製造設備、軟體、電信設備、計量儀器、儀表等。採「最惠國」（MFN）原則，受惠範圍及於所有 WTO 成員，不限於 ITA 締約方。\n\n【ITA-II（2015）】2015 年 7 月於奈洛比部長會議達成擴大協議，新增約 201 項產品（總值約每年 1.3 兆美元），含新世代產品：MRI、GPS、視訊遊戲機、印刷電路板、半導體新類別、觸控螢幕、雷射印表機、智慧手機等。2016 年 7 月 1 日起分階段降稅，2024 全面完成零關稅。54 個成員（含我國、中國）參與。\n\n【經濟影響】WTO 估計 ITA 累積降低全球 ICT 產品關稅成本約 1.3 兆美元；對台、韓、日、新等 ICT 出口導向經濟體影響尤大。\n\n【我國地位】我國以「臺灣、澎湖、金門及馬祖個別關稅領域」（TPKM）名義為 ITA 創始與 ITA-II 成員，半導體、ICT 產業實質受惠。\n\n【未來】WTO 內部曾討論 ITA-III 但尚未正式啟動；新興項目（AI 晶片、量子計算設備、無人機等）的歸類與納入為核心議題。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Information Technology Agreement', url: 'https://www.wto.org/english/tratop_e/inftec_e/inftec_e.htm', lang: 'en' }],
  },
  'wto-fin-services': {
    latestStatus: {
      summary: 'WTO《金融服務協定》（GATS 第五議定書，1997 年達成、1999 年生效）開放銀行、保險、證券等金融服務市場，為 GATS 體系下的重要承諾，持續適用。',
      detail:
        'WTO《金融服務協定》以《服務貿易總協定》（GATS）「第五議定書」（Fifth Protocol）形式呈現，1997 年 12 月 12 日達成共識，1999 年 3 月 1 日生效。\n\n【背景】(1) 烏拉圭回合（1986–1994）建立 GATS 框架，但金融、電信、自然人移動三大敏感領域延後談判；(2) 1995 年第一次嘗試完成金融服務談判，但美方拒絕簽署、繼續壓力對方擴大開放；(3) 1997 年 12 月，70 個 WTO 成員（涵蓋全球金融服務市場約 95%）達成共識。\n\n【主要承諾】成員提交「具體承諾減讓表」涵蓋：\n(1) **銀行業**：外資銀行設立、跨境提供服務、市場進入；\n(2) **保險業**：人壽、產險、再保險之市場進入與國民待遇；\n(3) **證券業**：證券發行、交易、託管；\n(4) **其他**：信用評等、金融資料處理、財務諮詢、退休金管理。\n\n【「審慎例外」】GATS 金融服務附件第 2 條設「審慎例外」（prudential carve-out），允許成員為「保障投資人、存款人、保單持有人」或「確保金融體系完整與穩定」採取與 GATS 義務不一致之措施，使各國保留充分監理彈性。此例外於 2008 年金融危機後被廣泛援用。\n\n【經濟影響】(1) 1990–2010 年間，全球跨境金融服務貿易由 0.3 兆美元成長至 1.2 兆美元；(2) 開發中國家金融市場開放後，外資銀行進入增加金融效率，但也帶來金融不穩定風險（如 1997 亞洲金融危機、2008 全球金融海嘯）。\n\n【後續】(1) 2008 年金融海嘯後，部分國家重新加強金融監理，但未撤回 GATS 承諾；(2) WTO 內部曾討論金融服務章節升級（與數位金融、Fintech、加密貨幣有關），但未達共識；(3) FTA / RTA 體系（CPTPP 第 11 章、USMCA 第 17 章、CETA 第 13 章）多納入更深度金融服務章節，補充 GATS 不足。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Financial services', url: 'https://www.wto.org/english/tratop_e/serv_e/finance_e/finance_e.htm', lang: 'en' }],
  },

  // ── 新增遺漏項目（byTool）──
  'ipef': {
    latestStatus: {
      summary:
        '印太經濟繁榮架構（IPEF）由 14 國於 2022 年 5 月啟動，分四大支柱。第二支柱《供應鏈協定》2023 年 11 月簽署、2024 年 2 月生效；第三支柱《潔淨經濟協定》與第四支柱《公平經濟協定》於 2024 年 6 月簽署；第一支柱《貿易》談判尚未完成。川普 2025 年重返後對 IPEF 立場仍待釐清。',
      detail:
        '【架構】IPEF 不是傳統 FTA，刻意避開市場進入承諾，改以四支柱推動：\n  I. 貿易（含勞動、環境、數位、農業、透明化、競爭、貿易便捷化等子議題）\n  II. 供應鏈韌性（關鍵供應鏈緊急應變網絡、勞動權利諮詢機制）\n  III. 潔淨經濟（潔淨能源、減碳、永續基礎建設）\n  IV. 公平經濟（反貪腐、稅務透明化）\n\n【成員】美國、澳、汶、斐、印、印尼、日、韓、馬、紐、菲、新、泰、越，共 14 國。印度僅參與第二、三、四支柱。\n\n【進展】\n  - 2023/11/16：第二支柱「供應鏈協定」簽署\n  - 2024/2/24：供應鏈協定生效\n  - 2024/6：第三支柱「潔淨經濟協定」、第四支柱「公平經濟協定」簽署\n  - 2024/10：潔淨經濟及公平經濟協定生效（前 5 個批准成員間）\n  - 2025–：川普政府對 IPEF 政策走向仍在評估，第一支柱談判前景不明',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'USTR — IPEF', url: 'https://ustr.gov/trade-agreements/agreements-currently-under-negotiation/indo-pacific-economic-framework-prosperity-ipef', lang: 'en' },
      { label: 'US Department of Commerce — IPEF', url: 'https://www.commerce.gov/ipef', lang: 'en' },
    ],
  },
  'japan-australia-jaepa': {
    latestStatus: {
      summary: '日澳經濟夥伴協定（JAEPA）2015 年 1 月生效後持續運作；CPTPP 與 RCEP 生效後，部分關稅安排於該等多邊架構下另行落實，JAEPA 仍為雙邊基準制度。',
      detail:
        '日澳《經濟夥伴協定》（JAEPA）自 2007 年啟動談判，歷經 7 年、17 輪會談，2014 年 7 月 8 日簽署、2015 年 1 月 15 日生效。\n\n【主要承諾】(1) 日方對澳方 95% 工業品立即降至零；對牛肉設 18 年過渡（澳方為主要受益）、對乳製品、糖、米、小麥設配額；(2) 澳方對日方 100% 工業品立即降至零；(3) 服務：互開金融、教育、法律、運輸；(4) 投資：含 ISDS；(5) 自然人移動：日方對澳專業人員放寬簽證。\n\n【特色】(1) 是日方與已開發國家簽署的最具雄心 FTA 之一，農業敏感品保護程度低於既往日方 FTA；(2) 澳方稱為「對日 21 世紀最具影響力的協定」；(3) 為日方 CPTPP 談判預作準備（許多條款被 CPTPP 沿用）。\n\n【經濟成果】2015 年雙邊貿易 670 億美元，2024 年達 870 億美元；澳方對日鐵礦、煤、LNG、牛肉、葡萄酒為主；日方對澳汽車、電子、機械為主。\n\n【與 CPTPP/RCEP 互動】2018 年 CPTPP、2022 年 RCEP 生效後，JAEPA 部分條款於多邊架構下另有適用。實務上，企業可依貨品類別選擇對自身最有利的協定（reciprocal advantage）。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'Australia DFAT — JAEPA', url: 'https://www.dfat.gov.au/trade/agreements/in-force/jaepa', lang: 'en' },
    ],
  },
  'korea-australia-kafta': {
    latestStatus: {
      summary: '韓澳自由貿易協定（KAFTA）2014 年 12 月生效以來持續運作，雙邊絕大多數貨品已達零關稅。',
      detail:
        '韓澳自由貿易協定（Korea-Australia FTA, KAFTA）自 2009 年 5 月啟動談判，歷經 5 年、7 輪會談，2014 年 4 月 8 日簽署、2014 年 12 月 12 日生效。\n\n【主要承諾】(1) 韓方對澳方 99% 工業品 8 年內降至零；對牛肉設 15 年過渡；對乳製品、米、糖設較長配額過渡；(2) 澳方對韓方 100% 工業品 10 年內降至零；(3) 服務：互開金融、運輸、教育、法律；(4) 投資：含 ISDS；(5) 智財：韓方爭取高標準保護。\n\n【特色】(1) 是澳方繼 AUSFTA（2005）後最重要的東亞 FTA；(2) 韓方繼歐韓 FTA、美韓 FTA 之後第三個與已開發國家簽署的 FTA；(3) 為 RCEP 談判鋪路。\n\n【經濟成果】2014 年雙邊貿易約 280 億美元，2024 年約 370 億美元；澳方對韓鐵礦、煤、LNG、牛肉為主；韓方對澳汽車、石化、半導體為主。\n\n【與其他 FTA 互動】(1) KAFTA 與 RCEP（2022/2 對韓國生效）並行；(2) 韓國 2024 年起與澳洲共同推動關鍵礦產供應鏈合作，KAFTA 為制度基礎。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'Australia DFAT — KAFTA', url: 'https://www.dfat.gov.au/trade/agreements/in-force/kafta', lang: 'en' },
    ],
  },
  'gcc-korea': {
    latestStatus: {
      summary: '韓國—海合會自由貿易協定歷經逾十年談判後，於 2023 年 12 月正式簽署，涵蓋貨品、服務與電子商務；待韓國與海合會 6 個成員國分別完成國內批准程序後生效。',
      detail:
        '韓國—海灣阿拉伯合作委員會（GCC：沙烏地阿拉伯、阿聯、卡達、科威特、巴林、阿曼）自由貿易協定談判自 2008 年啟動，歷經多次中斷與重啟，2023 年 12 月 28 日於利雅德正式簽署。\n\n【規模】涵蓋 GCC 約 8,000 萬人口、合計 GDP 約 2.2 兆美元；2024 年韓國對 GCC 貿易約 860 億美元。\n\n【主要內容】(1) 貨品：GCC 對韓 90% 產品 10 年內降至零；韓方對 GCC 89.9% 產品降稅；(2) 服務：互開金融、營造、運輸；(3) 電子商務：高標準章節（含跨境資料流動）；(4) 投資：含 ISDS；(5) 政府採購、智財、競爭等完整章節。\n\n【意義】(1) GCC 對韓國汽車、家電、半導體出口為主要受惠；(2) 韓方對沙烏地阿拉伯、阿聯石油與石化進口為主；(3) 強化韓國「中東 K-City（新都市）」、再生能源、核能合作。\n\n【批准進度】韓國國會於 2024 年通過；GCC 6 國須各自完成批准程序，預計 2025–2026 完成生效。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'Korea MOFA — Korea-GCC FTA', url: 'https://www.fta.go.kr/eng/', lang: 'en' },
    ],
  },
  'switzerland-eu-bilaterals': {
    latestStatus: {
      summary: '瑞士與歐盟「雙邊架構 III」（Bilaterals III）於 2024 年 12 月 20 日宣布實質完成談判，將以新制度架構（含動態接軌歐盟法、爭端解決、國家補貼規範）穩定並更新雙方逾百項雙邊協定。後續待法律整理、簽署與瑞士公投批准。',
      detail:
        '瑞士因 1992 年公投否決加入 EEA，改採與歐盟「雙邊條約」模式整合單一市場：\n  - 雙邊架構 I（1999 簽、2002 生效）：7 個協定，涵蓋自由人員移動、農業、空運、陸運、技術障礙、政府採購、研究合作\n  - 雙邊架構 II（2004 簽、2008+ 陸續生效）：9 個協定，涵蓋申根、都柏林、儲蓄稅、加工農產品、教育、退休金等\n\n【為何需要 III】(1) 歐盟自 2014 年起要求瑞士採用「制度性架構協定」（Institutional Framework Agreement, IFA），以動態接軌歐盟法、設立統一爭端解決機制；(2) 2018–2021 年 IFA 談判破局，瑞士聯邦委員會於 2021/5 單方面宣布退出（主因國內政黨反對自由人員移動與工資保護條款）；(3) 2022 起重啟，由「整套架構」改為「分散式套案」（package approach），即在每個雙邊協定內各自納入制度條款。\n\n【主要新增內容】\n(1) 動態接軌歐盟法（dynamic alignment）：在涉及內部市場的協定，瑞方接受歐盟新法規同步適用；\n(2) 爭端解決：含瑞士、歐盟代表組成的仲裁庭，疑義時轉至歐洲法院（CJEU）解釋；\n(3) 國家補貼規範：適用瑞士航空、陸運（鐵路、公路）部門；\n(4) 新增 3 個協定：電力、食品安全、衛生（首次涵蓋）；\n(5) 解決自由人員移動爭議：「安全閥」條款，允許瑞方在嚴重移民壓力下暫時管制。\n\n【批准前景】因含關鍵改變（特別是制度條款、CJEU 解釋角色），預計將進行全民公投，最快 2027 年完成；瑞士國內反對派（SVP 等）已表態強烈反對。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — Switzerland', url: 'https://commission.europa.eu/strategy-and-policy/relations-non-eu-countries/relations-switzerland_en', lang: 'en' },
      { label: 'Swiss FDFA — EU dossier', url: 'https://www.eda.admin.ch/europa/en/home.html', lang: 'en' },
    ],
  },
  'eu-thailand-fta': {
    latestStatus: {
      summary: '歐盟—泰國自由貿易協定談判於 2023 年 3 月重啟，涵蓋貨品、服務、投資、永續發展與數位貿易。雙方已多輪會談，目標於 2025 年完成。',
      detail:
        '歐泰 FTA 談判原於 2013 年啟動，2014 年因泰國軍方政變而暫停（歐方因泰方人權狀況中止）。2017 年起雙方逐步恢復對話，2022 年泰方民主回穩後正式重啟，2023 年 3 月 15 日在布魯塞爾啟動新一輪談判。\n\n【規模】涵蓋約 5 億人口（歐盟 27 + 泰國），合計 GDP 約 19 兆美元；2024 年雙邊貿易約 470 億歐元，歐盟為泰國第 4 大貿易夥伴。\n\n【談判進度（至 2025 年底）】已進行 7 輪實質會談，涵蓋章節：貨品、服務、投資、政府採購、永續發展、智財（含地理標示）、數位貿易、中小企業、競爭、爭端解決。雙方原訂 2025 年達成共識的目標可能延至 2026 年。\n\n【主要關切】\n(1) 永續發展：泰方對歐方要求的《巴黎協定》、ILO 公約、反森林砍伐法（EUDR）有實質關切，特別是稻米、橡膠、棕櫚油等出口品；\n(2) 智財：歐方要求高水準保護（含 GI、生物多樣性、傳統知識）；\n(3) 政府採購：泰方對開放各級採購市場保留；\n(4) 投資：採 ICS 而非 ISDS；\n(5) 漁業補貼與 IUU 漁業：歐方曾於 2015 年對泰方提出「黃牌警告」（2019 解除），仍要求協定納入承諾。\n\n【意義】(1) 將是歐盟在東南亞繼新加坡、越南、印尼後第 4 個全面 FTA；(2) 強化歐盟「印太戰略」與「全球門戶」（Global Gateway）對泰國的供應鏈佈局；(3) 提供泰方在中美貿易戰下多元化避險。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'European Commission — EU-Thailand', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/thailand/eu-thailand-agreement_en', lang: 'en' },
    ],
  },
};
