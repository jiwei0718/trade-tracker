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

  // ── 中國系雙邊 FTA（最新狀態為 AI 整理，byTool）──
  'china-asean': {
    latestStatus: {
      summary:
        '中國—東協自由貿易區（CAFTA）自 2010 年全面生效，是中國最早、規模最大的 FTA 之一。雙方「3.0 版」升級談判已於 2024 年實質完成，新增數位經濟、綠色經濟、供應鏈互聯等章節，並於 2025 年簽署升級議定書。',
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
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-Australia FTA', url: 'https://www.gov.uk/government/collections/uk-australia-free-trade-agreement', lang: 'en' }],
  },
  'uk-nz': {
    latestStatus: {
      summary: '英國—紐西蘭自由貿易協定 2022 年 2 月簽署、2023 年 5 月 31 日與英澳協定同日生效，逐步消除雙邊關稅並涵蓋服務、數位貿易與環境條款。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-New Zealand FTA', url: 'https://www.gov.uk/government/collections/uk-new-zealand-free-trade-agreement', lang: 'en' }],
  },
  'uk-japan': {
    latestStatus: {
      summary: '英日《全面經濟夥伴協定》（CEPA）2020 年 10 月簽署、2021 年 1 月生效，是英國脫歐後首個重大貿易協定，大致延續原歐日 EPA 內容並強化數位貿易條款。英國其後並透過 CPTPP 進一步深化與日本經貿。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-Japan CEPA', url: 'https://www.gov.uk/government/collections/uk-japan-comprehensive-economic-partnership-agreement', lang: 'en' }],
  },

  // ── 印度系（byTool）──
  'india-korea': {
    latestStatus: {
      summary: '印度—韓國《全面經濟夥伴協定》（CEPA）2010 年生效。雙方升級談判持續進行，盼擴大市場開放並調整原產地規則。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },
  'india-japan': {
    latestStatus: {
      summary: '印度—日本《全面經濟夥伴協定》（CEPA）2011 年生效。雙方就協定檢視與升級進行討論，以擴大製造業與供應鏈合作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },
  'india-australia': {
    latestStatus: {
      summary: '印度—澳洲《經濟合作暨貿易協定》（ECTA）2022 年 12 月 29 日生效，為早期收穫協定；雙方正就更全面的《全面經濟合作協定》（CECA）持續談判。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Australia DFAT — India ECTA', url: 'https://www.dfat.gov.au/trade/agreements/in-force/aifta', lang: 'en' }],
  },
  'india-oman': {
    latestStatus: {
      summary: '印度—阿曼《全面經濟夥伴協定》（CEPA）談判已大致完成，將是印度在波斯灣地區繼印阿聯 CEPA 後的另一重要協定，待最終確認與簽署。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },
  'india-nz': {
    latestStatus: {
      summary: '印度—紐西蘭自由貿易協定談判於 2025 年 3 月正式啟動，雙方設定加速完成的目標，乳製品市場開放為主要議題之一。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'New Zealand MFAT — India', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/agreements-under-negotiation/india', lang: 'en' }],
  },
  'india-canada-suspended': {
    latestStatus: {
      summary: '印度—加拿大《早期進展貿易協定》（EPTA）談判於 2023 年 9 月因兩國外交關係惡化（涉錫克教領袖 Nijjar 命案爭議）而暫停，迄今未恢復。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'India Ministry of Commerce — Trade Agreements', url: 'https://commerce.gov.in/international-trade/trade-agreements/', lang: 'en' }],
  },

  // ── 東協對外 FTA（byTool）──
  'asean-india': {
    latestStatus: {
      summary: '東協—印度自由貿易協定（貨品部分 AITIGA 於 2010 年生效）。雙方自 2023 年起進行協定檢視與升級談判，目標於 2025 年完成。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — FTAs with Dialogue Partners', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'asean-aus-nz': {
    latestStatus: {
      summary: '東協—澳洲—紐西蘭自由貿易協定（AANZFTA）2010 年生效。升級議定書於 2023 年簽署、2024 年起陸續生效，新增電子商務、永續發展等章節。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — AANZFTA', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'asean-korea': {
    latestStatus: {
      summary: '東協—韓國自由貿易協定 2007 年起分階段生效，涵蓋貨品、服務與投資，並透過 RCEP 進一步整合，協定持續運作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — ASEAN-Korea FTA', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'asean-japan': {
    latestStatus: {
      summary: '東協—日本《全面經濟夥伴協定》（AJCEP）2008 年生效，其後補充服務與投資章節，並隨 RCEP 深化區域整合，協定持續運作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — AJCEP', url: 'https://asean.org/our-communities/economic-community/free-trade-agreements-with-dialogue-partners/', lang: 'en' }],
  },
  'aec-2015': {
    latestStatus: {
      summary: '東協經濟共同體（AEC）於 2015 年底正式建立，致力打造單一市場與生產基地。「AEC 藍圖 2025」持續推進貨品、服務、投資、資金與技術勞工流通的深化整合。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — Economic Community', url: 'https://asean.org/our-communities/economic-community/', lang: 'en' }],
  },

  // ── EFTA / 其他現役（byTool）──
  'efta-mercosur': {
    latestStatus: {
      summary: 'EFTA（瑞士、挪威、冰島、列支敦斯登）與南方共同市場（Mercosur）於 2025 年宣布完成自由貿易協定談判，將形成跨大西洋的大型自貿關係，後續待法律整理與各方批准。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'EFTA — Mercosur', url: 'https://www.efta.int/free-trade/free-trade-agreements/mercosur', lang: 'en' }],
  },
  'mercosur-singapore': {
    latestStatus: {
      summary: '南方共同市場—新加坡自由貿易協定（MCSFTA）2023 年 12 月簽署，是 Mercosur 與亞洲國家的首個 FTA，待各成員國完成批准後生效。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Singapore MTI — Mercosur-Singapore FTA', url: 'https://www.mti.gov.sg/Trade/Free-Trade-Agreements', lang: 'en' }],
  },
  'us-uk-fta': {
    latestStatus: {
      summary: '美英於 2025 年 5 月 8 日宣布「經濟繁榮協議」（Economic Prosperity Deal），屬範圍有限的關稅安排（涉汽車、鋼鋁、牛肉、乙醇等），而非全面性 FTA；後續細節與實施仍在推進。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'UK DBT — UK-US trade deal', url: 'https://www.gov.uk/government/news', lang: 'en' }],
  },
  'eu-us-talks': {
    latestStatus: {
      summary: '歐美早年的《跨大西洋貿易與投資夥伴協定》（TTIP）談判自 2016 年起停滯。2025 年雙方因川普政府關稅爭端重啟協商，並達成以基準關稅為核心的框架性安排，惟細節與爭議仍多。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'European Commission — EU-US', url: 'https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/united-states_en', lang: 'en' }],
  },
  'tpp-original': {
    latestStatus: {
      summary: '《跨太平洋夥伴協定》（TPP）12 國於 2016 年 2 月簽署，但因美國於 2017 年 1 月退出而未能生效。其餘 11 國其後改組為 CPTPP（2018 年生效），TPP 原協定已實質由 CPTPP 取代。',
      asOf: '2018-12', byTool: true,
    },
    sourceDocs: [{ label: 'New Zealand MFAT — CPTPP', url: 'https://www.mfat.govt.nz/en/trade/free-trade-agreements/free-trade-agreements-in-force/cptpp', lang: 'en' }],
  },

  // ── 歷史里程碑（byTool）──
  'cobden-chevalier': {
    latestStatus: {
      summary: '《英法商務條約》（1860）引入最惠國（MFN）原則並透過互相援引擴散至歐洲各國，奠定 19 世紀自由貿易網絡的基礎。屬歷史性條約，於一次大戰前後的保護主義浪潮中式微。',
      asOf: '1914-01', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Principles of the trading system (MFN)', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact2_e.htm', lang: 'en' }],
  },
  'mckinley-tariff': {
    latestStatus: {
      summary: '美國《麥金利關稅法》（1890）將平均進口關稅大幅提高至約 48%，是 19 世紀末美國保護主義的代表，屬歷史事件。',
      asOf: '1894-01', byTool: true,
    },
    sourceDocs: [{ label: 'US Office of the Historian — Tariffs', url: 'https://history.state.gov/milestones', lang: 'en' }],
  },
  'imperial-preference': {
    latestStatus: {
      summary: '《渥太華協定》（1932）建立大英帝國內部的特惠關稅制度（帝國特惠制），對外則築起關稅壁壘。二戰後在 GATT 多邊自由化下逐步瓦解，屬歷史制度。',
      asOf: '1947-01', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — The GATT years', url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact4_e.htm', lang: 'en' }],
  },
  'hawley-smoot': {
    latestStatus: {
      summary: '美國《斯姆特—霍利關稅法》（1930）大幅調高逾兩萬項商品關稅，引發各國報復、加劇全球貿易萎縮與大蕭條，常被引為保護主義之鑑，屬歷史事件。',
      asOf: '1934-01', byTool: true,
    },
    sourceDocs: [{ label: 'US Office of the Historian — Smoot-Hawley', url: 'https://history.state.gov/milestones/1921-1936/protectionism', lang: 'en' }],
  },
  'rtaa-1934': {
    latestStatus: {
      summary: '美國《互惠貿易協定法》（RTAA，1934）將關稅談判授權由國會移轉至總統，開啟以雙邊互惠協定降低關稅的時代，為戰後 GATT 多邊體系奠基。其精神已由 GATT/WTO 承接。',
      asOf: '1947-01', byTool: true,
    },
    sourceDocs: [{ label: 'US Office of the Historian — RTAA', url: 'https://history.state.gov/milestones/1921-1936/protectionism', lang: 'en' }],
  },
  'us-uk-1938': {
    latestStatus: {
      summary: '《美英貿易協定》（1938）為依《互惠貿易協定法》簽署的雙邊降稅協定，是二戰前美英經貿合作的代表，屬歷史協定，後為 GATT 多邊體系取代。',
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
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'EFTA 官方網站', url: 'https://www.efta.int/', lang: 'en' }],
  },
  'lafta': {
    latestStatus: {
      summary: '拉丁美洲自由貿易協會（LAFTA，1960）為拉美早期區域整合嘗試，因目標過於宏大而成效有限，1980 年由更具彈性的拉丁美洲整合協會（ALADI）取代。',
      asOf: '1980-08', byTool: true,
    },
    sourceDocs: [{ label: 'ALADI', url: 'https://www.aladi.org/', lang: 'es' }],
  },
  'aladi': {
    latestStatus: {
      summary: '拉丁美洲整合協會（ALADI，1980）取代 LAFTA，以彈性的雙邊與次區域優惠安排推動拉美經濟整合，現有 13 個會員國，為 Mercosur、安第斯共同體等的制度傘架，持續運作。',
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
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'CARICOM 官方網站', url: 'https://caricom.org/', lang: 'en' }],
  },
  'andean-community': {
    latestStatus: {
      summary: '安第斯共同體（CAN，1969 年《卡塔赫納協定》）為南美洲的關稅同盟與整合機制，現有玻利維亞、哥倫比亞、厄瓜多、秘魯 4 個會員國，與 Mercosur 並列南美兩大整合集團，持續運作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Comunidad Andina', url: 'https://www.comunidadandina.org/', lang: 'es' }],
  },
  'auto-pact-1965': {
    latestStatus: {
      summary: '《加美汽車產品協定》（Auto Pact，1965）建立北美汽車業的免關稅整合，深刻形塑跨境供應鏈。其優惠安排於 2001 年因 WTO 裁決違反規則而終止，相關功能由 NAFTA／USMCA 承接。',
      asOf: '2001-02', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Canada Autos dispute (DS139/142)', url: 'https://www.wto.org/english/tratop_e/dispu_e/cases_e/ds139_e.htm', lang: 'en' }],
  },
  'us-israel-1985': {
    latestStatus: {
      summary: '美國—以色列自由貿易協定（1985）是美國史上第一個自由貿易協定，已消除雙邊絕大多數貨品關稅，至今仍生效，並為後續美國 FTA 樹立範式。',
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
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'Mercosur 官方網站', url: 'https://www.mercosur.int/', lang: 'es' }],
  },
  'afta-1992': {
    latestStatus: {
      summary: '東協自由貿易區（AFTA，1992）透過「共同有效優惠關稅」（CEPT）大幅降低區內關稅，其機制其後由《東協貨品貿易協定》（ATIGA）與東協經濟共同體（AEC）承接深化，持續運作。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'ASEAN — Economic Community', url: 'https://asean.org/our-communities/economic-community/', lang: 'en' }],
  },
  'nafta': {
    latestStatus: {
      summary: '《北美自由貿易協定》（NAFTA，1994）整合美國、加拿大、墨西哥市場逾 25 年。2020 年 7 月 1 日由重新談判的《美墨加協定》（USMCA）取代，NAFTA 正式走入歷史。',
      asOf: '2020-07', byTool: true,
    },
    sourceDocs: [{ label: 'USTR — USMCA (replacing NAFTA)', url: 'https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement', lang: 'en' }],
  },
  'maastricht': {
    latestStatus: {
      summary: '《馬斯垂克條約》（1992 年簽署、1993 年生效）正式創立歐洲聯盟（EU），確立經濟暨貨幣聯盟（為歐元鋪路）與共同外交安全政策。其後經《阿姆斯特丹》《尼斯》《里斯本》等條約修訂，奠定今日 EU 架構。',
      asOf: '2009-12', byTool: true,
    },
    sourceDocs: [{ label: 'EU — History', url: 'https://european-union.europa.eu/principles-countries-history/history-eu_en', lang: 'en' }],
  },
  'ita-1996': {
    latestStatus: {
      summary: 'WTO《資訊科技協定》（ITA，1996）消除半導體、電腦、電信設備等資訊科技產品關稅，是少數成功的複邊降稅協定。2015 年達成擴大版（ITA-II），新增約 200 項產品，持續適用。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Information Technology Agreement', url: 'https://www.wto.org/english/tratop_e/inftec_e/inftec_e.htm', lang: 'en' }],
  },
  'wto-fin-services': {
    latestStatus: {
      summary: 'WTO《金融服務協定》（GATS 第五議定書，1997 年達成、1999 年生效）開放銀行、保險、證券等金融服務市場，為 GATS 體系下的重要承諾，持續適用。',
      asOf: '2025-12', byTool: true,
    },
    sourceDocs: [{ label: 'WTO — Financial services', url: 'https://www.wto.org/english/tratop_e/serv_e/finance_e/finance_e.htm', lang: 'en' }],
  },
};
