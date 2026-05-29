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
};
