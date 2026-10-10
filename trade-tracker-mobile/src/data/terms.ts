/**
 * 專有名詞資料庫(常用名詞)。
 *
 * 規則
 * - 每個名詞至少有中文名稱、原文、解釋,以及 APA 格式的來源(盡量附連結)。
 * - 來源優先序:官方與國際組織 → 研究或學術機構 → 企業 → 其他。不使用簡體中文或中國大陸的來源。
 * - 中文譯名以我國官方用法為準;找不到來源時才由 AI 翻譯,並在 aiNote 說明翻譯方法。
 * - 解釋依所列來源整理(摘要或改寫),官方《WTO小辭典》有收錄的名詞,詞條頁另附官方全文。
 *
 * 這裡的名詞會在協定、動態等頁面的文字中自動變成連結(見 src/lib/term-links.ts)。
 * 其他 539 個 WTO 用語來自 src/data/wto-glossary.json(經濟部國際貿易署《WTO小辭典》)。
 */

export type TermCategory = 'document' | 'agreement-type' | 'wto-rule' | 'trade-remedy' | 'wto-body' | 'us-tariff' | 'emerging';
export type SourceTier = 'official' | 'academic' | 'corporate' | 'other';

export interface TermSource {
  apa: string;       // APA 格式
  url?: string;
  tier: SourceTier;
}

export interface Term {
  id: string;
  zh: string;            // 中文名稱(我國用法)
  original: string;      // 原文
  abbr?: string;         // 縮寫
  /** 其他中文寫法,也會被辨識成這個名詞;原文不同時寫成 { zh, original }。 */
  aliases?: (string | { zh: string; original: string })[];
  category: TermCategory;
  definition: string;
  sources: TermSource[];
  /** AI 翻譯或 AI 撰寫的部分,以及方法說明。沒有這個欄位代表譯名與解釋都來自所列來源。 */
  aiNote?: string;
  /** 對應的《WTO小辭典》詞條(英文名稱),詞條頁會附官方全文。 */
  wtoGlossaryEn?: string;
  related?: string[];
  /** 是否在內文中自動加連結(常見字如「共識」不加)。預設 true。 */
  linkInText?: boolean;
}

export const CATEGORY_LABELS: Record<TermCategory, string> = {
  'document': '文件類型',
  'agreement-type': '協定類型',
  'wto-rule': 'WTO 規則與原則',
  'trade-remedy': '貿易救濟與爭端解決',
  'wto-body': 'WTO 機構與談判',
  'us-tariff': '美國關稅措施',
  'emerging': '協定程序與新興議題',
};

export const SOURCE_TIER_LABELS: Record<SourceTier, string> = {
  official: '官方/國際組織',
  academic: '研究/學術機構',
  corporate: '企業',
  other: '其他',
};

// ─── 來源 ─────────────────────────────────────────────────────────────────

const BOFT: TermSource = {
  apa: '經濟部國際貿易署(2025)。WTO小辭典〔資料集〕。政府資料開放平臺。依政府資料開放授權條款第1版使用。https://data.gov.tw/dataset/22660',
  url: 'https://data.gov.tw/dataset/22660', tier: 'official',
};
const MOA_RTA: TermSource = {
  apa: '劉凱翔(2014年5月23日)。WTO區域貿易協定(RTA)及農業相關議題之簡介。農政與農情,263。農業部。https://www.moa.gov.tw/ws.php?id=2501258',
  url: 'https://www.moa.gov.tw/ws.php?id=2501258', tier: 'official',
};
const BOFT_FTA_PORTAL: TermSource = {
  apa: '經濟部國際貿易署(無日期)。臺灣ECA/FTA總入口網。https://fta.trade.gov.tw/',
  url: 'https://fta.trade.gov.tw/', tier: 'official',
};
const GAC_FIPA: TermSource = {
  apa: 'Global Affairs Canada. (2021, May 11). Canada\'s 2021 Foreign Investment Promotion and Protection Agreement (FIPA) model. https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/fipa-apie/index.aspx?lang=eng',
  url: 'https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/fipa-apie/index.aspx?lang=eng',
  tier: 'official',
};
const TREATY_ACT: TermSource = {
  apa: '條約締結法(2015年7月1日)。總統府公報,7200。https://www.president.gov.tw/PORTALS/0/BULLETINS/PAPER/PDF/7200-1.PDF',
  url: 'https://www.president.gov.tw/PORTALS/0/BULLETINS/PAPER/PDF/7200-1.PDF', tier: 'official',
};
const OTN_MC14: TermSource = {
  apa: '行政院經貿談判辦公室(2026年3月30日)。第14屆部長會議(MC14)。https://www.ey.gov.tw/otn/7BDE903DD4BEFBF4',
  url: 'https://www.ey.gov.tw/otn/7BDE903DD4BEFBF4', tier: 'official',
};
const OTN_RECIPROCAL: TermSource = {
  apa: '行政院經貿談判辦公室(2025年8月8日)。經貿辦:4月即已說明對等關稅採疊加計算 將持續與美磋商爭取合理稅率。https://www.ey.gov.tw/otn/3C2A5B02FE10DE06/2d94e33c-f11c-4c3d-83ef-8f1bf4b3559e',
  url: 'https://www.ey.gov.tw/otn/3C2A5B02FE10DE06/2d94e33c-f11c-4c3d-83ef-8f1bf4b3559e', tier: 'official',
};
const OTN_IEEPA: TermSource = {
  apa: '行政院經貿談判辦公室(2026年3月2日)。美國聯邦最高法院判決認定國際緊急經濟權力法(IEEPA)未授權川普總統課徵對等關稅及芬太尼關稅案判決摘要。https://www.ey.gov.tw/otn/8E7CF7585049FAB6/ed665b72-36bf-442e-966d-0137ba89e7c6',
  url: 'https://www.ey.gov.tw/otn/8E7CF7585049FAB6/ed665b72-36bf-442e-966d-0137ba89e7c6', tier: 'official',
};
const OTN_TW_JP_DTA: TermSource = {
  apa: '行政院經貿談判辦公室(2025年12月4日)。臺日簽署數位貿易協議,建構可信賴的供應鏈並強化合作。https://www.ey.gov.tw/otn/8E7CF7585049FAB6/bd8ff799-6b03-4a8a-bd94-d18e9e1f9710',
  url: 'https://www.ey.gov.tw/otn/8E7CF7585049FAB6/bd8ff799-6b03-4a8a-bd94-d18e9e1f9710', tier: 'official',
};
const DPA_TW_JP_DTA: TermSource = {
  apa: 'Digital Policy Alert. (2025). Taiwan–Japan Relations Association and Japan–Taiwan Exchange Association signed Arrangement for Mutual Cooperation on Digital Trade. https://digitalpolicyalert.org/event/40448-taiwan-japan-relations-association-and-japan-taiwan-exchange-association-signed-arrangement-for-mutual-cooperation-on-digital-trade',
  url: 'https://digitalpolicyalert.org/event/40448-taiwan-japan-relations-association-and-japan-taiwan-exchange-association-signed-arrangement-for-mutual-cooperation-on-digital-trade',
  tier: 'academic',
};
const NCCU_319: TermSource = {
  apa: '文逢遠、蔡汶憲(編譯)(2023年10月25日)。完成WTO電子商務談判的最後一塊拼圖:咫尺天涯?經貿法訊,319。國立政治大學商學院國際經貿組織暨法律研究中心。https://tradelaw.nccu.edu.tw/epaper/no319/1.pdf',
  url: 'https://tradelaw.nccu.edu.tw/epaper/no319/1.pdf', tier: 'academic',
};
const EO_14257: TermSource = {
  apa: 'Executive Office of the President. (2025, April 2). Executive Order 14257—Regulating imports with a reciprocal tariff to rectify trade practices that contribute to large and persistent annual United States goods trade deficits (DCPD-202500425). U.S. Government Publishing Office. https://www.govinfo.gov/content/pkg/DCPD-202500425/pdf/DCPD-202500425.pdf',
  url: 'https://www.govinfo.gov/content/pkg/DCPD-202500425/pdf/DCPD-202500425.pdf', tier: 'official',
};
const LTN_LIBERATION: TermSource = {
  apa: '自由時報財經頻道(2025年3月20日)。關稅要來了! 川普警告Fed最好降息。自由財經。https://ec.ltn.com.tw/article/breakingnews/4985966',
  url: 'https://ec.ltn.com.tw/article/breakingnews/4985966', tier: 'other',
};
const CSIS_232: TermSource = {
  apa: 'Reinsch, W. A. (2026, July 22). Section 232 explained. Center for Strategic and International Studies. https://www.csis.org/analysis/section-232-explained',
  url: 'https://www.csis.org/analysis/section-232-explained', tier: 'academic',
};
const GTA_232_301: TermSource = {
  apa: 'Harput, H., & Risse, M. (2026, February 26). After IEEPA: How Sections 232 and 301 work. Global Trade Alert. https://globaltradealert.org/blog/sections-232-301-tariff-explainer',
  url: 'https://globaltradealert.org/blog/sections-232-301-tariff-explainer', tier: 'academic',
};
const EU_A2M_MFN: TermSource = {
  apa: 'European Commission. (n.d.). Most-favoured-nation (MFN) [Glossary term]. Access2Markets. https://trade.ec.europa.eu/access-to-markets/en/glossary/most-favoured-nation',
  url: 'https://trade.ec.europa.eu/access-to-markets/en/glossary/most-favoured-nation', tier: 'official',
};
const VCLT: TermSource = {
  apa: 'United Nations. (1969). Vienna Convention on the Law of Treaties (Art. 25). United Nations Treaty Series, 1155, 331. https://legal.un.org/ilc/texts/instruments/english/conventions/1_1_1969.pdf',
  url: 'https://legal.un.org/ilc/texts/instruments/english/conventions/1_1_1969.pdf', tier: 'official',
};
const EU_CBAM: TermSource = {
  apa: 'European Commission, Directorate-General for Taxation and Customs Union. (n.d.). Carbon Border Adjustment Mechanism. https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
  url: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en', tier: 'official',
};

// ─── 名詞 ─────────────────────────────────────────────────────────────────

export const TERMS: Term[] = [
  // 文件類型
  {
    id: 'treaty', zh: '條約', original: 'Treaty', aliases: [{ zh: '公約', original: 'Convention' }], category: 'document',
    definition: '我國與外國或國際組織簽訂的國際書面協定,名稱為條約或公約,或內容訂有批准、接受、贊同或加入條款,涉及人民權利義務、國防外交財政經濟等國家重要事項,或與國內法律不一致、須變更國內法律者,皆屬條約(條約締結法第3條第1項)。',
    sources: [TREATY_ACT], related: ['agreement'],
  },
  {
    id: 'agreement', zh: '協定', original: 'Agreement', category: 'document',
    definition: '條約以外,內容對締約各方均具有拘束力的國際書面協定(條約締結法第3條第2項)。本工具收錄的貿易協定多屬此類,例如自由貿易協定、經濟夥伴協定。',
    sources: [TREATY_ACT], related: ['treaty', 'arrangement'], linkInText: false,
  },
  {
    id: 'arrangement', zh: '協議', original: 'Arrangement', category: 'document',
    definition: '英文 Arrangement 在我國官方用法中譯為「協議」,常見於透過授權機構簽署的文件,例如臺灣日本關係協會與日本台灣交流協會簽署的「臺日數位貿易協議」(Arrangement for Mutual Cooperation on Digital Trade)。',
    sources: [OTN_TW_JP_DTA, DPA_TW_JP_DTA], related: ['agreement'], linkInText: false,
    aiNote: '譯名依經貿辦新聞稿用例(Arrangement → 協議);說明文字由本工具整理,經貿辦頁面未提供英文名稱,英文名稱取自 Digital Policy Alert。',
  },
  {
    id: 'mou', zh: '備忘錄', original: 'Memorandum of Understanding', abbr: 'MOU', aliases: ['合作備忘錄', '瞭解備忘錄'], category: 'document',
    definition: '雙方記錄合作意向與架構的文件,通常不具法律拘束力,也不需經批准程序。',
    sources: [], aiNote: 'AI 翻譯與撰寫:依我國官方常見譯法「備忘錄」翻譯 Memorandum of Understanding;本資料庫目前沒有找到合適的權威定義來源,說明為一般性整理,使用時請再查證。',
  },
  {
    id: 'joint-statement', zh: '聯合聲明', original: 'Joint Statement', aliases: ['共同聲明'], category: 'document',
    definition: '雙方或多方共同發表的政治性文件,用來宣示立場、共識或後續合作方向,通常不具法律拘束力。WTO 的「聯合聲明倡議」即由一群會員以聯合聲明啟動複邊談判。',
    sources: [NCCU_319], related: ['jsi'],
    aiNote: '譯名依政大國際經貿組織暨法律研究中心用例;說明前半段為本工具整理(AI 撰寫)。',
  },

  // 協定類型
  {
    id: 'rta', zh: '區域貿易協定', original: 'Regional Trade Agreement', abbr: 'RTA', category: 'agreement-type',
    definition: '2個或2個以上國家(或關稅領域)之間簽署的互惠性貿易協定,是一個集合性名詞。依 WTO 規定,區域貿易協定包括關稅同盟、自由貿易協定、部分範圍協定與經濟整合協定4種類型;名稱不一定有「自由貿易」字樣,例如經濟夥伴協定、經濟合作協定,本質上都是區域貿易協定。',
    sources: [MOA_RTA], related: ['fta', 'customs-union', 'psa', 'eia', 'gatt-article-24', 'enabling-clause'],
  },
  {
    id: 'fta', zh: '自由貿易協定', original: 'Free Trade Agreement', abbr: 'FTA', aliases: [{ zh: '自由貿易區', original: 'Free Trade Area' }], category: 'agreement-type',
    definition: '由2個或2個以上關稅領域組成的自由貿易區,成員之間消除大部分貿易的關稅與限制,但各自保留對區外的關稅。狹義的自由貿易協定只涉及貨品貿易,是區域貿易協定的一種。',
    sources: [MOA_RTA], related: ['rta', 'customs-union'],
  },
  {
    id: 'customs-union', zh: '關稅同盟', original: 'Customs Union', abbr: 'CU', category: 'agreement-type',
    definition: '以單一關稅領域代替2個或2個以上的關稅領域:成員之間大多數貿易的關稅與限制被消除,對區外則採用大致相同的關稅與商業法規。',
    sources: [MOA_RTA], related: ['rta', 'fta'],
  },
  {
    id: 'psa', zh: '部分範圍協定', original: 'Partial Scope Agreement', abbr: 'PSA', category: 'agreement-type',
    definition: '簽署國之間只針對一部分貨品消除或削減關稅或商業性限制的協定,是區域貿易協定的一種,多見於開發中國家之間。',
    sources: [MOA_RTA], related: ['rta', 'enabling-clause'],
  },
  {
    id: 'eia', zh: '經濟整合協定', original: 'Economic Integration Agreement', abbr: 'EIA', category: 'agreement-type',
    definition: '規範服務貿易的區域貿易協定:簽署國之間的大多數服務業應消除現行的歧視性措施,法源為服務貿易總協定(GATS)第5條。',
    sources: [MOA_RTA], related: ['rta'],
  },
  {
    id: 'epa', zh: '經濟夥伴協定', original: 'Economic Partnership Agreement', abbr: 'EPA', aliases: ['經濟夥伴關係協定'], category: 'agreement-type',
    definition: '區域貿易協定的一種名稱。範圍通常比自由貿易協定廣,除關稅外還涵蓋投資、服務、政府採購等;名稱雖不同,本質上仍屬區域貿易協定。',
    sources: [MOA_RTA], related: ['rta', 'fta'],
    aiNote: '「名稱不同、本質上屬區域貿易協定」出自所列來源;「範圍通常較廣」為本工具整理(AI 撰寫)。',
  },
  {
    id: 'bit', zh: '雙邊投資條約', original: 'Bilateral Investment Treaty', abbr: 'BIT', category: 'agreement-type',
    aliases: [
      { zh: '投資促進及保障協議', original: 'Foreign Investment Promotion and Protection Agreement' },
      { zh: '投資促進及保障協定', original: 'Foreign Investment Promotion and Protection Agreement' },
    ],
    definition: '兩國之間保障與促進投資的協定,美國以此稱呼它的投資促進及保護協定。典型內容包括最惠國待遇與國民待遇、公平公正待遇、投資設立許可、徵收須依程序、資金自由移轉、法規透明與有效救濟等權利義務。加拿大的同類協定稱為投資促進及保障協議(FIPA)。',
    sources: [BOFT, GAC_FIPA], wtoGlossaryEn: 'Bilateral investment treaties', related: ['fta'],
    aiNote: '前兩句依經濟部國際貿易署 WTO 小辭典的「雙邊投資條約」條目改寫;「加拿大的同類協定稱為 FIPA」依加拿大全球事務部頁面整理(AI 撰寫)。',
  },
  {
    id: 'eca', zh: '經濟合作協定', original: 'Economic Cooperation Agreement', abbr: 'ECA', category: 'agreement-type',
    definition: '區域貿易協定的一種名稱,本質上與自由貿易協定同屬區域貿易協定。我國與巴拉圭、史瓦帝尼、貝里斯、馬紹爾群島簽署的經貿協定採用這個名稱,內容以雙方給予部分貨品關稅優惠為主,另含投資、技術等合作事項。',
    sources: [MOA_RTA, BOFT_FTA_PORTAL], related: ['rta', 'fta', 'epa'],
    aiNote: '「屬區域貿易協定的一種名稱」出自農業部文章,「我國以此名稱簽署的協定」出自國際貿易署 ECA/FTA 總入口網;「內容以部分貨品關稅優惠為主,另含投資、技術等合作」為本工具依各協定的官方說明整理(AI 撰寫)。',
  },
  {
    id: 'plurilateral', zh: '複邊貿易協定', original: 'Plurilateral Trade Agreement', aliases: ['複邊協定', { zh: '複邊談判', original: 'Plurilateral Negotiations' }], category: 'agreement-type',
    definition: '參與者比雙邊(2方)多、但比多邊(全體會員)少的協定。在 WTO 中,只有部分會員參加的談判稱為複邊談判,例如電子商務聯合聲明倡議。',
    sources: [BOFT, NCCU_319], wtoGlossaryEn: 'Plurilateral trade agreement', related: ['jsi'],
  },
  {
    id: 'preferential-arrangement', zh: '優惠性貿易協議', original: 'Preferential Trade Arrangement', aliases: ['優惠貿易協定'], category: 'agreement-type',
    definition: '依談判結果或單方面決定,給予其他國家的產品或服務優惠待遇的協議,例如降低或免除關稅、部分開放服務貿易。在 WTO 規則下,除普遍化優惠關稅制度外,這類協議原則上須成立自由貿易區或關稅同盟,或取得豁免。',
    sources: [BOFT], wtoGlossaryEn: 'Preferential trade arrangement', related: ['gsp', 'fta'],
  },

  // WTO 規則與原則
  {
    id: 'mfn', zh: '最惠國待遇', original: 'Most-Favoured-Nation Treatment', abbr: 'MFN', category: 'wto-rule',
    definition: '給予任一貿易夥伴的優惠(例如較低的關稅),必須立即且無條件地給予所有其他 WTO 會員。與國民待遇合稱「不歧視原則」。例外包括自由貿易區、關稅同盟、普遍化優惠關稅制度與豁免。',
    sources: [BOFT, EU_A2M_MFN], wtoGlossaryEn: 'Most-favoured-nation treatment (MFN)', related: ['national-treatment', 'gatt-article-24'],
  },
  {
    id: 'national-treatment', zh: '國民待遇', original: 'National Treatment', category: 'wto-rule',
    definition: '外國產品或服務進入國內市場後,所受待遇不得低於本國同類產品或服務。貨品規定在關稅及貿易總協定第3條,服務規定在服務貿易總協定第17條,智慧財產權規定在 TRIPS 第3條。',
    sources: [BOFT], wtoGlossaryEn: 'National treatment', related: ['mfn'],
  },
  {
    id: 'rules-of-origin', zh: '原產地規則', original: 'Rules of Origin', abbr: 'ROO', category: 'wto-rule',
    definition: '決定產品或服務原產國的法律與規則。貿易協定靠它判斷哪些產品可以享受優惠關稅,常見判定方法有稅則號列變更、附加價值比例與特定製程三種。',
    sources: [BOFT], wtoGlossaryEn: 'Rules of origin', related: ['fta'],
  },
  {
    id: 'enabling-clause', zh: '授權條款', original: 'Enabling Clause', aliases: ['培植條款'], category: 'wto-rule',
    definition: '1979年11月28日關稅及貿易總協定締約方通過的決定,允許給予開發中國家與低度開發國家較優惠的待遇,包括普遍化優惠關稅制度,以及開發中國家之間不受最惠國待遇限制的區域性或全球性貿易協定。',
    sources: [BOFT, MOA_RTA], wtoGlossaryEn: 'Enabling Clause', related: ['gsp', 'rta', 'psa'],
  },
  {
    id: 'gatt-article-24', zh: '關稅及貿易總協定第24條', original: 'GATT Article XXIV', aliases: ['GATT第24條', 'GATT 第24條', 'GATT 第 24 條'], category: 'wto-rule',
    definition: '貨品貿易區域貿易協定的 WTO 法源。允許會員設立關稅同盟或自由貿易區,而不必把區內優惠給予其他會員,是最惠國待遇的例外;但不得因此提高對區外會員的貿易障礙。',
    sources: [MOA_RTA], related: ['rta', 'mfn', 'customs-union'],
  },
  {
    id: 'non-tariff-measures', zh: '非關稅措施', original: 'Non-Tariff Measures', abbr: 'NTM', aliases: [{ zh: '非關稅障礙', original: 'Non-Tariff Barriers' }], category: 'wto-rule',
    definition: '關稅以外會限制貿易量的政府措施,例如數量限制、輸入許可、自願設限協議及差價稅。烏拉圭回合的結論之一,是會員應將農產品的非關稅措施轉換成關稅。',
    sources: [BOFT], wtoGlossaryEn: 'Non-tariff measures', related: ['tbt', 'tariff-quota'],
  },
  {
    id: 'tariff-quota', zh: '關稅配額', original: 'Tariff Quota', aliases: [{ zh: '關稅稅率配額', original: 'Tariff Rate Quota' }], category: 'wto-rule',
    definition: '在特定進口數量內適用較低的關稅稅率,超過的部分適用較高稅率。配額內外稅率差距大時,仍可能實質限制進口。',
    sources: [BOFT], wtoGlossaryEn: 'Tariff quota',
  },
  {
    id: 'bound-tariff', zh: '約束關稅稅率', original: 'Bound Tariff Rate', aliases: ['約束稅率'], category: 'wto-rule',
    definition: '政府在 WTO 承諾課徵關稅的上限。實際適用稅率可以低於約束稅率。',
    sources: [BOFT], wtoGlossaryEn: 'Bound tariff rates',
  },
  {
    id: 'gsp', zh: '普遍化優惠關稅制度', original: 'Generalized System of Preferences', abbr: 'GSP', aliases: ['普惠制'], category: 'wto-rule',
    definition: '已開發國家對開發中國家的產品給予優惠關稅的制度,1968年由聯合國貿易及發展會議提出,1971年生效,用以提升開發中國家產品的競爭力。',
    sources: [BOFT], wtoGlossaryEn: 'Generalized System of Preferences', related: ['enabling-clause'],
  },
  {
    id: 'geographical-indications', zh: '地理標示', original: 'Geographical Indications', abbr: 'GI', category: 'wto-rule',
    definition: '當產品的品質、聲譽或其他特性主要來自其產地時,用來標示該產品來源國家、區域或地方的標誌,例如勃艮地酒、雪莉酒、波特酒。受 TRIPS 協定保護,也是許多自由貿易協定的談判議題。',
    sources: [BOFT], wtoGlossaryEn: 'Geographical indications',
  },
  {
    id: 'government-procurement', zh: '政府採購', original: 'Government Procurement', aliases: [{ zh: '公共採購', original: 'Public Procurement' }], category: 'wto-rule',
    definition: '政府或政府機關為自用而採購貨品及服務,又稱公共採購。關稅及貿易總協定與服務貿易總協定不適用政府採購,另由複邊的政府採購協定規範。',
    sources: [BOFT], wtoGlossaryEn: 'Government procurement',
  },
  {
    id: 'tbt', zh: '技術性貿易障礙', original: 'Technical Barriers to Trade', abbr: 'TBT', category: 'wto-rule',
    definition: '因技術標準與符合性評估制度而對貿易造成的障礙。WTO 技術性貿易障礙協定規範如何調和、減少及消除這類障礙。',
    sources: [BOFT], wtoGlossaryEn: 'Technical barriers to trade', related: ['non-tariff-measures'],
  },

  // 貿易救濟與爭端解決
  {
    id: 'anti-dumping', zh: '反傾銷措施', original: 'Anti-Dumping Measures', abbr: 'AD', aliases: ['反傾銷', { zh: '反傾銷稅', original: 'Anti-Dumping Duties' }], category: 'trade-remedy',
    definition: '出口商以低於其國內市場正常價值的價格在進口國銷售(傾銷),並對進口國產業造成實質損害時,進口國可課徵的特別進口稅。須證明傾銷、損害及兩者的因果關係。',
    sources: [BOFT], wtoGlossaryEn: 'Anti-dumping measures', related: ['countervailing', 'safeguards'],
  },
  {
    id: 'countervailing', zh: '平衡稅', original: 'Countervailing Duties', abbr: 'CVD', aliases: ['反補貼稅'], category: 'trade-remedy',
    definition: '對進口產品課徵的特別稅,用以抵銷出口國政府補貼其生產者或出口商所形成的利益,限於國內產業受有實質損害的情形。',
    sources: [BOFT], wtoGlossaryEn: 'Countervailing duties', related: ['anti-dumping'],
  },
  {
    id: 'safeguards', zh: '防衛措施', original: 'Safeguard Measures', aliases: ['保障措施', { zh: '防衛協定', original: 'Agreement on Safeguards' }], category: 'trade-remedy',
    definition: '進口突然增加,對國內產業造成嚴重損害或有嚴重損害之虞時,依關稅及貿易總協定第19條與 WTO 防衛協定採取的緊急措施。必須不歧視地適用於所有來源,期間一般不超過4年,最長8年。',
    sources: [BOFT], wtoGlossaryEn: 'Agreement of Safeguards', related: ['anti-dumping'],
  },
  {
    id: 'dispute-settlement', zh: '爭端解決', original: 'Dispute Settlement', aliases: ['爭端解決機制'], category: 'trade-remedy',
    definition: '政府之間因貿易規則的解釋或執行發生衝突時的解決方式。WTO 的爭端解決程序通常在諮商失敗後開始,細節規定在 WTO 爭端解決瞭解書。',
    sources: [BOFT], wtoGlossaryEn: 'Dispute settlement', related: ['appellate-body'],
  },
  {
    id: 'appellate-body', zh: '上訴機構', original: 'Appellate Body', abbr: 'AB', category: 'trade-remedy',
    definition: '依 WTO 爭端解決瞭解書設立、由7人組成的常設機構,審理對爭端解決小組報告的上訴,上訴理由限於法律問題。',
    sources: [BOFT], wtoGlossaryEn: 'Appellate body', related: ['dispute-settlement'],
  },

  // WTO 機構與談判
  {
    id: 'wto', zh: '世界貿易組織', original: 'World Trade Organization', abbr: 'WTO', category: 'wto-body',
    definition: '1995年1月1日成立的國際組織,取代關稅及貿易總協定(GATT)體制,掌管貨品、服務與智慧財產權等多邊貿易協定,並設有爭端解決機制。最高決策機構為部長會議。',
    sources: [BOFT, MOA_RTA], related: ['gatt', 'ministerial-conference', 'general-council'],
    aiNote: '《WTO小辭典》與農業部文章都提到 WTO 於1995年成立並承接 GATT;本段整合兩者,由本工具撰寫(AI 撰寫)。',
  },
  {
    id: 'gatt', zh: '關稅及貿易總協定', original: 'General Agreement on Tariffs and Trade', abbr: 'GATT', aliases: ['關稅暨貿易總協定'], category: 'wto-body',
    definition: '1948年1月1日生效的暫時協定,建立了貨品貿易的多邊義務,包括最惠國待遇、國民待遇、反傾銷稅及平衡稅、關稅同盟與自由貿易區等。1995年起條文成為 WTO 架構的一部分(GATT 1994)。',
    sources: [BOFT], wtoGlossaryEn: 'GATT', related: ['wto', 'mfn'],
  },
  {
    id: 'ministerial-conference', zh: '部長會議', original: 'WTO Ministerial Conference', abbr: 'MC', aliases: ['部長級會議', '世界貿易組織部長會議'], category: 'wto-body',
    definition: '由所有 WTO 會員部長級代表組成的會議,至少每兩年舉行一次,有權決定多邊貿易協定的所有事項。例如第14屆部長會議(MC14)於2026年3月在喀麥隆雅溫德舉行。',
    sources: [BOFT, OTN_MC14], wtoGlossaryEn: 'WTO Ministerial Conference', related: ['general-council'],
  },
  {
    id: 'general-council', zh: '總理事會', original: 'General Council', category: 'wto-body',
    definition: '由所有 WTO 會員組成的機構,在兩屆部長會議之間代表部長會議行使職權,監督 WTO 各協定的運作。',
    sources: [BOFT], wtoGlossaryEn: 'General Council', related: ['ministerial-conference'],
  },
  {
    id: 'accession', zh: '入會', original: 'Accession', category: 'wto-body',
    definition: '成為 WTO 或其他國際組織、協定成員的行為。申請者須與既有會員談判,確保其貿易制度符合 WTO 原則,並提出關稅減讓表與服務業承諾表。',
    sources: [BOFT], wtoGlossaryEn: 'Accession',
  },
  {
    id: 'consensus', zh: '共識決', original: 'Consensus', aliases: ['共識'], category: 'wto-body', linkInText: false,
    definition: 'WTO 通常的決策方式。規則雖允許投票,但很少使用;共識決能減少爭執,但常使談判時間拉長。',
    sources: [BOFT], wtoGlossaryEn: 'Consensus',
  },
  {
    id: 'waiver', zh: '豁免', original: 'Waiver', category: 'wto-body', linkInText: false,
    definition: 'WTO 會員同意讓某會員在特定範圍內免除特定條文的義務,須經全體會員四分之三以上同意,並定期檢討。',
    sources: [BOFT], wtoGlossaryEn: 'Waiver',
  },
  {
    id: 'jsi', zh: '聯合聲明倡議', original: 'Joint Statement Initiative', abbr: 'JSI', aliases: ['共同聲明倡議'], category: 'wto-body',
    definition: '一群 WTO 會員以聯合聲明啟動、只由參與會員進行的複邊談判。電子商務談判是其中之一,有超過80個會員參與,由日本、澳洲、新加坡主導。',
    sources: [NCCU_319], related: ['plurilateral', 'ecommerce-moratorium'],
  },
  {
    id: 'ecommerce-moratorium', zh: '電子傳輸暫免課徵關稅', original: 'Moratorium on Customs Duties on Electronic Transmissions', aliases: ['電子傳輸免徵關稅', '電子傳輸暫免關稅'], category: 'wto-body',
    definition: 'WTO 會員同意暫時不對電子傳輸課徵關稅的承諾,自1998年起由歷屆部長會議延長。第14屆部長會議(MC14)未能就延長達成共識,現有措施於2026年3月底到期。',
    sources: [OTN_MC14, NCCU_319], related: ['jsi', 'ministerial-conference'],
    aiNote: '「自1998年起」為本工具依 WTO 背景補充(AI 撰寫);到期與 MC14 結果出自經貿辦頁面。',
  },
  {
    id: 'doha', zh: '杜哈發展議程', original: 'Doha Development Agenda', abbr: 'DDA', aliases: [{ zh: '杜哈回合', original: 'Doha Round' }], category: 'wto-body',
    definition: '2001年11月 WTO 第4屆(杜哈)部長會議啟動的多邊談判回合,特別強調照顧開發中及低度開發國家的發展需求,故稱「發展議程」。',
    sources: [BOFT], wtoGlossaryEn: 'Doha Development Agenda (DDA)', related: ['uruguay-round'],
  },
  {
    id: 'uruguay-round', zh: '烏拉圭回合', original: 'Uruguay Round', category: 'wto-body',
    definition: '1986年9月在烏拉圭東岬啟動、1994年4月在馬爾喀什結束的多邊貿易談判回合,成果包括成立 WTO、簽署農業協定、服務貿易總協定、TRIPS 協定,以及建立爭端解決機制。',
    sources: [BOFT], wtoGlossaryEn: 'Uruguay Round', related: ['wto', 'doha'],
  },

  // 美國關稅措施
  {
    id: 'liberation-day', zh: '解放日', original: 'Liberation Day', category: 'us-tariff',
    definition: '美國總統川普對2025年4月2日的稱呼。當天他簽署第14257號行政命令,援引國際緊急經濟權力法宣布國家緊急狀態,對各貿易夥伴課徵對等關稅。',
    sources: [EO_14257, LTN_LIBERATION], related: ['reciprocal-tariff', 'ieepa'],
  },
  {
    id: 'reciprocal-tariff', zh: '對等關稅', original: 'Reciprocal Tariff', category: 'us-tariff',
    definition: '美國依第14257號行政命令,以貿易逆差為由對各國加徵的關稅:先對所有國家課徵10%,再對逆差較大的國家適用較高稅率,並疊加在原有最惠國待遇稅率之上。我國自2025年8月7日起適用最惠國稅率加20%的暫時性稅率。2026年2月,美國聯邦最高法院判決國際緊急經濟權力法並未授權課徵對等關稅。',
    sources: [EO_14257, OTN_RECIPROCAL, OTN_IEEPA], related: ['liberation-day', 'ieepa', 'mfn'],
  },
  {
    id: 'ieepa', zh: '國際緊急經濟權力法', original: 'International Emergency Economic Powers Act', abbr: 'IEEPA', category: 'us-tariff',
    definition: '美國法律,授權總統在國家緊急狀態下「規範進口」等經濟措施,條文未提及關稅。川普政府據此課徵對等關稅與芬太尼關稅;美國聯邦最高法院於2026年2月判決此法並未授權總統課徵這些關稅。',
    sources: [OTN_IEEPA, EO_14257], related: ['reciprocal-tariff', 'section-232', 'section-301'],
  },
  {
    id: 'section-232', zh: '232條款', original: 'Section 232 of the Trade Expansion Act of 1962', aliases: ['232 條款', { zh: '232關稅', original: 'Section 232 Tariffs' }, { zh: '232 關稅', original: 'Section 232 Tariffs' }], category: 'us-tariff',
    definition: '美國《1962年貿易擴張法》第232條,授權總統對經判定威脅國家安全的進口採取行動(多為關稅或配額),調查由商務部進行並向總統提出建議。',
    sources: [CSIS_232, GTA_232_301, OTN_IEEPA], related: ['section-301', 'ieepa'],
    aiNote: '中文名稱「232條款」依經貿辦網站用法(該頁僅於選單出現);解釋依 CSIS 與 Global Trade Alert 整理翻譯。',
  },
  {
    id: 'section-301', zh: '301條款', original: 'Section 301 of the Trade Act of 1974', aliases: ['301 條款', { zh: '301調查', original: 'Section 301 Investigation' }, { zh: '301 調查', original: 'Section 301 Investigation' }], category: 'us-tariff',
    definition: '美國《1974年貿易法》第301條,授權美國貿易代表署調查對美國商業造成負擔的外國政府做法,並可課徵關稅或採取其他進口限制。',
    sources: [GTA_232_301, OTN_IEEPA], related: ['section-232', 'ieepa'],
    aiNote: '中文名稱「301條款/301調查」依經貿辦網站用法(該頁僅於選單出現);解釋依 Global Trade Alert 整理翻譯。',
  },

  // 協定程序與新興議題
  {
    id: 'provisional-application', zh: '暫時適用', original: 'Provisional Application', category: 'emerging',
    definition: '條約或其一部分在正式生效前先行適用:條約本身如此規定,或談判國另有同意時即可暫時適用;國家通知不成為締約方時即終止(維也納條約法公約第25條)。例如歐盟–南方共同市場的臨時貿易協定自2026年5月起暫時適用。',
    sources: [VCLT], related: ['treaty'],
    aiNote: 'AI 翻譯:依條文 provisional application 直譯為「暫時適用」,並參照我國法律文件常見用語;本資料庫未找到我國官方對此詞的定義,解釋為依公約第25條英文原文翻譯整理。',
  },
  {
    id: 'cbam', zh: '碳邊境調整機制', original: 'Carbon Border Adjustment Mechanism', abbr: 'CBAM', aliases: ['碳邊境調整'], category: 'emerging',
    definition: '歐盟處理「碳洩漏」的工具,讓進口產品的價格反映其生產過程中的碳排放;自2026年1月1日起進入正式實施階段。',
    sources: [EU_CBAM],
    aiNote: 'AI 翻譯:中文名稱依我國官方與媒體常見譯法「碳邊境調整機制」(Carbon Border Adjustment Mechanism 逐詞對譯);本資料庫尚未取得我國官方定義頁面,解釋依歐盟執委會頁面翻譯整理。',
  },
];

export const aliasText = (a: string | { zh: string }) => (typeof a === 'string' ? a : a.zh);

const BY_ID = new Map(TERMS.map(t => [t.id, t]));
export const termById = (id: string) => BY_ID.get(id);
