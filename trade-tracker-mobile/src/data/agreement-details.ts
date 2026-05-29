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
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署 — ANZTEC', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-singapore-chinese-taipei': {
    latestStatus: {
      summary: 'ASTEP 自 2014 年 4 月生效以來持續運作，雙方絕大多數貨品已達零關稅，並涵蓋服務、投資及電子商務合作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署 — ASTEP', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-guatemala-chinese-taipei': {
    latestStatus: {
      summary: '臺瓜 FTA 仍生效中。瓜地馬拉為我國中美洲重要邦交國，協定持續提供雙邊貨品優惠關稅。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-panama-chinese-taipei': {
    latestStatus: {
      summary: '本協定（我國史上首個 FTA，2004 年生效）已實質終止。巴拿馬於 2017 年 6 月與我斷交、轉與中華人民共和國建交，雙邊優惠關稅安排隨之失效。',
      asOf: '2017-06', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署（歷史協定）', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-nicaragua-chinese-taipei': {
    latestStatus: {
      summary: '本協定已終止。尼加拉瓜於 2021 年 12 月與我斷交、轉與中國建交後，雙邊 FTA 失效。',
      asOf: '2022-07', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署（歷史協定）', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },
  'wto-rta-el-salvador-honduras-chinese-taipei': {
    latestStatus: {
      summary: '本三方協定已終止。薩爾瓦多（2018）與宏都拉斯（2023）相繼與我斷交、轉與中國建交，協定失效。',
      asOf: '2023-12', byTool: true,
    },
    sourceDocs: [{ label: '經濟部國際貿易署（歷史協定）', url: 'https://www.trade.gov.tw/', lang: 'zh' }],
  },

  'taiwan-japan-dta': {
    latestStatus: {
      summary: '台日數位貿易協議於 2025 年 12 月 4 日由臺灣日本關係協會與日本台灣交流協會簽署，是我國少數以官方文本對外簽署的數位貿易協議。在跨境資料流動與數位信任領域已奠定完整規範基礎，但廣義數位經濟議題（AI、金融科技等）尚未納入。',
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
        'CPTPP（跨太平洋夥伴全面進步協定）原 11 國於 2018 年 3 月簽署、同年 12 月 30 日生效。\n\n【擴大】英國於 2021 年 2 月申請加入，2023 年 7 月簽署加入議定書，2024 年 12 月 15 日正式生效，成為首個非創始成員，締約方增至 12 國。\n\n【待審申請】中國（2021/9）、中華民國（臺灣）（2021/9）、烏克蘭（2023）、烏拉圭（2024）、哥斯大黎加（2022）等已提出加入申請。哥斯大黎加加入工作小組已成立並進入審查程序。新成員加入須經全體現有締約方共識決。',
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
        'ASEAN 數位經濟框架協定（DEFA）為全球首個區域性數位經濟協定，2023 年 9 月啟動談判。ASEAN 領袖於 2025 年 5 月第 46 屆東協高峰會宣布實質完成（substantial conclusion）談判，目標於 2025 年內簽署，預估可使東協數位經濟規模倍增。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [
      { label: 'ASEAN — DEFA', url: 'https://asean.org/our-communities/economic-community/', lang: 'en' },
    ],
  },

  // ── 多邊協定 / GATT-WTO 體系（最新狀態為 AI 整理，byTool）──
  'gatt-1947': {
    latestStatus: {
      summary:
        '《關稅暨貿易總協定》（GATT 1947）於 1947 年 10 月簽署、1948 年 1 月生效，主導戰後多邊貿易自由化達 47 年、共 8 個談判回合。1995 年世界貿易組織（WTO）成立後，GATT 1947 由「GATT 1994」併入 WTO 法律架構繼續適用，原臨時性的 GATT 組織則走入歷史。',
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
      asOf: '2024-01', byTool: true,
    },
    sourceDocs: [
      { label: 'European Council — Samoa Agreement', url: 'https://www.consilium.europa.eu/en/policies/eu-acp-partnership-agreement/', lang: 'en' },
    ],
  },
};
