import type { ArticleGroup } from './types';

/**
 * Detailed clause/article breakdowns for digital trade agreements.
 * Keyed by agreement id. Bundled in-app (reference data that rarely changes).
 * Source: user's research tables (USJDTA / SADEA / UKSDEA / KSDPA / WTO JSI).
 */
export const ARTICLE_STRUCTURES: Record<string, ArticleGroup[]> = {
  // ─── 臺日數位貿易協議 (Taiwan–Japan Digital Trade Agreement) ─────────
  'taiwan-japan-dta': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '定義', en: 'Definitions' },
        { num: 'Art.2', zh: '原則與目標', en: 'Principles and Objectives' },
        { num: 'Art.3', zh: '範圍', en: 'Scope' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.4', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.5', zh: '數位產品之非歧視待遇', en: 'Non-Discriminatory Treatment of Digital Products' },
        { num: 'Art.16', zh: '原始碼', en: 'Source Code' },
        { num: 'Art.17', zh: '使用密碼學之商業資通訊科技產品', en: 'Commercial ICT Products that Use Cryptography' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.12', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.13', zh: '算力設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.18', zh: '開放政府資料', en: 'Open Government Data' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.6', zh: '電子交易框架', en: 'Electronic Transactions Framework' },
        { num: 'Art.7', zh: '電子商務管制', en: 'Regulations on Electronic Commerce' },
        { num: 'Art.8', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.19', zh: '以電子方式締結契約', en: 'Conclusion of Contracts by Electronic Means' },
        { num: 'Art.20', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.22', zh: '無紙化貿易管理', en: 'Paperless Trading' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.9', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.10', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.11', zh: '電子商務取得及使用網際網路之原則', en: 'Principles on Access to and Use of the Internet for Electronic Commerce' },
        { num: 'Art.14', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.15', zh: '網路安全', en: 'Cybersecurity' },
        { num: 'Art.23', zh: '網際網路服務提供者', en: 'Internet Service Providers' },
      ],
    },
    {
      theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
      articles: [
        { num: 'Art.21', zh: '透明度', en: 'Transparency' },
        { num: 'Art.24', zh: '合作', en: 'Cooperation' },
      ],
    },
    {
      theme: '例外規定', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.25', zh: '一般例外', en: 'General Exceptions' },
        { num: 'Art.26', zh: '安全例外', en: 'Security Exceptions' },
        { num: 'Art.27', zh: '審慎例外', en: 'Prudential Exceptions' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.28', zh: '諮商', en: 'Consultations' },
        { num: 'Art.29', zh: '一般檢視', en: 'General Review' },
        { num: 'Art.30', zh: '生效、修改及終止', en: 'Entry into Force, Modification and Termination' },
      ],
    },
  ],

  // ─── 美日數位貿易協定 (US–Japan Digital Trade Agreement) ───────────
  'us-japan-dta': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '定義', en: 'Definitions' },
        { num: 'Art.2', zh: '適用範圍', en: 'Scope' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.7', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.8', zh: '數位產品之非歧視待遇', en: 'Non-Discriminatory Treatment of Digital Products' },
        { num: 'Art.17', zh: '原始碼', en: 'Source Code' },
        { num: 'Art.21', zh: '使用密碼學之資通訊科技產品', en: 'ICT Goods that Use Cryptography' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.11', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.12', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.13', zh: '金融服務業運算設施位置', en: 'Location of Financial-Service Computing Facilities' },
        { num: 'Art.20', zh: '開放政府資料', en: 'Open Government Data' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.9', zh: '國內電子交易框架', en: 'Domestic Electronic Transactions Framework' },
        { num: 'Art.10', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.18', zh: '互動式電腦服務', en: 'Interactive Computer Services' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.14', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.15', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.16', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.19', zh: '網路安全', en: 'Cybersecurity' },
      ],
    },
    {
      theme: '例外規定', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.3', zh: '一般例外', en: 'General Exceptions' },
        { num: 'Art.4', zh: '安全例外', en: 'Security Exceptions' },
        { num: 'Art.5', zh: '審慎例外與貨幣匯率政策例外', en: 'Prudential Exception and Monetary and Exchange Rate Policy Exception' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.6', zh: '稅收', en: 'Taxation' },
        { num: 'Art.22', zh: '修正、生效與終止', en: 'Amendment, Entry into Force, and Termination' },
      ],
    },
  ],

  // ─── 星澳數位經濟協定 (Singapore–Australia Digital Economy Agreement) ─
  'singapore-australia-dea': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '定義', en: 'Definitions' },
        { num: 'Art.2', zh: '適用範圍', en: 'Scope' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.5', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.6', zh: '數位產品非歧視待遇', en: 'Non-Discriminatory Treatment of Digital Products' },
        { num: 'Art.7', zh: '使用密碼學之資通訊產品', en: 'ICT Products that Use Cryptography' },
        { num: 'Art.28', zh: '原始碼', en: 'Source Code' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.23', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.24', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.25', zh: '金融服務之運算設施位置', en: 'Location of Computing Facilities for Financial Services' },
        { num: 'Art.27', zh: '開放政府資料', en: 'Open Government Data' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.8', zh: '國內電子交易框架', en: 'Domestic Electronic Transactions Framework' },
        { num: 'Art.9', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.10', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.11', zh: '電子支付', en: 'Electronic Payments' },
        { num: 'Art.12', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.13', zh: '快遞貨件', en: 'Express Shipments' },
        { num: 'Art.20', zh: '電子商務之網際網路接取與使用原則', en: 'Principles on Access to and Use of the Internet for Electronic Commerce' },
        { num: 'Art.22', zh: '海底電信電纜系統', en: 'Submarine Telecommunications Cable Systems' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.15', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.17', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.18', zh: '創造安全的線上環境', en: 'Creating a Safe Online Environment' },
        { num: 'Art.19', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.34', zh: '網路安全', en: 'Cybersecurity' },
      ],
    },
    {
      theme: '新興技術與趨勢', themeEn: 'Emerging Tech & Trends',
      articles: [
        { num: 'Art.16', zh: '競爭政策合作', en: 'Cooperation on Competition Policy' },
        { num: 'Art.21', zh: '網際網路互連費用分攤', en: 'Internet Interconnection Charge Sharing' },
        { num: 'Art.26', zh: '資料創新', en: 'Data Innovation' },
        { num: 'Art.29', zh: '數位身分', en: 'Digital Identities' },
        { num: 'Art.30', zh: '數位貿易之標準與符合性評鑑', en: 'Standards and Conformity Assessment for Digital Trade' },
        { num: 'Art.31', zh: '人工智慧', en: 'Artificial Intelligence' },
        { num: 'Art.32', zh: '金融科技與法規科技合作', en: 'FinTech and RegTech Cooperation' },
      ],
    },
    {
      theme: '數位包容與發展', themeEn: 'Digital Inclusion & Development',
      articles: [
        { num: 'Art.36', zh: '中小企業', en: 'Small and Medium Enterprises' },
        { num: 'Art.37', zh: '能力建設', en: 'Capacity Building' },
      ],
    },
    {
      theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
      articles: [
        { num: 'Art.33', zh: '合作', en: 'Cooperation' },
        { num: 'Art.35', zh: '利害關係人參與', en: 'Stakeholder Engagement' },
      ],
    },
    {
      theme: '例外規定', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.3', zh: '一般例外', en: 'General Exceptions' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.4', zh: '資訊揭露', en: 'Disclosure of Information' },
        { num: 'Art.14', zh: '透明度', en: 'Transparency' },
        { num: 'Art.38', zh: '檢視', en: 'Review' },
      ],
    },
  ],

  // ─── 英國–新加坡數位經濟協定 (UK–Singapore Digital Economy Agreement) ─
  'uk-singapore-dea': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '定義（主協定）', en: 'Definitions' },
        { num: 'Art.8.57', zh: '定義（Annex A）', en: 'Definitions' },
        { num: 'Art.8.58', zh: '目標與適用範圍', en: 'Objectives and Scope' },
        { num: 'Art.8.49', zh: '適用範圍與定義（Annex B）', en: 'Scope and Definitions' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.8.59', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.8.61-J', zh: '使用密碼學之商用資通訊產品', en: 'Commercial ICT Products that Use Cryptography' },
        { num: 'Art.8.61-K', zh: '原始碼', en: 'Source Code' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.8.61-F', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.8.61-G', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.8.61-H', zh: '開放政府資訊', en: 'Open Government Information' },
        { num: 'Art.8.54', zh: '金融資訊（Annex B）', en: 'Financial Information' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.8.60', zh: '國內電子交易框架與電子契約', en: 'Domestic Electronic Transactions Framework and Electronic Contracts' },
        { num: 'Art.8.61', zh: '電子認證', en: 'Electronic Authentication' },
        { num: 'Art.8.61-A', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.8.61-B', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.8.61-C', zh: '物流', en: 'Logistics' },
        { num: 'Art.8.54-A', zh: '電子支付（Annex B）', en: 'Electronic Payments' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.8.61-E', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.8.61-L', zh: '網路安全', en: 'Cyber Security' },
        { num: 'Art.8.61-M', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.8.61-N', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.8.61-O', zh: '線上安全與保安', en: 'Safety and Security Online' },
      ],
    },
    {
      theme: '新興技術與趨勢', themeEn: 'Emerging Tech & Trends',
      articles: [
        { num: 'Art.8.61-D', zh: '標準與符合性評鑑', en: 'Standards and Conformity Assessment' },
        { num: 'Art.8.61-I', zh: '資料創新', en: 'Data Innovation' },
        { num: 'Art.8.61-R', zh: '人工智慧與新興技術', en: 'Artificial Intelligence and Emerging Technologies' },
        { num: 'Art.8.61-S', zh: '數位身分', en: 'Digital Identities' },
        { num: 'Art.8.61-T', zh: '法律科技合作', en: 'Lawtech Cooperation' },
        { num: 'Art.8.61-U', zh: '競爭政策合作', en: 'Cooperation on Competition Policy' },
        { num: 'Art.8.53', zh: '新金融服務（Annex B）', en: 'New Financial Services' },
      ],
    },
    {
      theme: '數位包容與發展', themeEn: 'Digital Inclusion & Development',
      articles: [
        { num: 'Art.8.61-P', zh: '數位包容', en: 'Digital Inclusion' },
        { num: 'Art.8.61-Q', zh: '中小企業', en: 'Small and Medium-sized Enterprises' },
      ],
    },
    {
      theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
      articles: [
        { num: 'Art.3', zh: '合作（主協定）', en: 'Cooperation' },
        { num: 'Art.4', zh: '資訊分享（主協定）', en: 'Information Sharing' },
        { num: 'Art.8.61-V', zh: '利害關係人參與', en: 'Stakeholder Engagement' },
        { num: 'Art.8.61-W', zh: '合作', en: 'Cooperation' },
      ],
    },
    {
      theme: '例外規定', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.8.61-X', zh: '安全、審慎例外與一般例外', en: 'Security, Prudential Carve-out and General Exceptions' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.2', zh: '英星自由貿易協定之修正', en: 'Amendment of the UK-Singapore FTA' },
        { num: 'Art.5', zh: '組成部分', en: 'Integral Parts' },
        { num: 'Art.6', zh: '最終條款', en: 'Final Provisions' },
      ],
    },
  ],

  // ─── 韓星數位夥伴協定 (Korea–Singapore Digital Partnership Agreement) ─
  'korea-singapore-dpa': [
    {
      theme: '定義、目標與範圍', themeEn: 'Definitions, Objectives & Scope',
      articles: [
        { num: 'Art.1', zh: '目標（主協定）', en: 'Objectives' },
        { num: 'Art.2', zh: '一般定義（主協定）', en: 'General Definitions' },
        { num: 'Art.14.1', zh: '定義', en: 'Definitions' },
        { num: 'Art.14.2', zh: '適用範圍', en: 'Scope' },
      ],
    },
    {
      theme: '市場開放', themeEn: 'Market Access',
      articles: [
        { num: 'Art.14.5', zh: '關稅', en: 'Customs Duties' },
        { num: 'Art.14.6', zh: '數位產品非歧視待遇', en: 'Non-Discriminatory Treatment of Digital Products' },
        { num: 'Art.14.18', zh: '使用密碼學之資通訊產品', en: 'ICT Products that Use Cryptography' },
        { num: 'Art.14.19', zh: '原始碼', en: 'Source Code' },
      ],
    },
    {
      theme: '資料流動', themeEn: 'Data Flows',
      articles: [
        { num: 'Art.14.14', zh: '以電子方式跨境傳輸資訊', en: 'Cross-Border Transfer of Information by Electronic Means' },
        { num: 'Art.14.15', zh: '運算設施位置', en: 'Location of Computing Facilities' },
        { num: 'Art.14.16', zh: '金融服務之運算設施位置', en: 'Location of Computing Facilities for Financial Services' },
        { num: 'Art.14.26', zh: '開放政府資料', en: 'Open Government Data' },
      ],
    },
    {
      theme: '數位貿易便捷化', themeEn: 'Digital Trade Facilitation',
      articles: [
        { num: 'Art.7', zh: '電子簽章（主協定）', en: 'Electronic Signature' },
        { num: 'Art.14.7', zh: '電子交易框架', en: 'Electronic Transactions Framework' },
        { num: 'Art.14.8', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.14.9', zh: '物流', en: 'Logistics' },
        { num: 'Art.14.10', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.14.11', zh: '電子支付', en: 'Electronic Payments' },
        { num: 'Art.14.12', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.14.13', zh: '快遞貨件', en: 'Express Shipments' },
        { num: 'Art.14.24', zh: '電子商務之網際網路接取與使用原則', en: 'Principles on Access to and Use of the Internet for Electronic Commerce' },
      ],
    },
    {
      theme: '數位信任', themeEn: 'Digital Trust',
      articles: [
        { num: 'Art.14.17', zh: '個人資訊保護', en: 'Personal Information Protection' },
        { num: 'Art.14.20', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.14.21', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.14.22', zh: '網路安全', en: 'Cybersecurity' },
        { num: 'Art.14.23', zh: '線上安全環境', en: 'Online Safety Environment' },
      ],
    },
    {
      theme: '新興技術與趨勢', themeEn: 'Emerging Tech & Trends',
      articles: [
        { num: 'Art.14.25', zh: '資料創新', en: 'Data Innovation' },
        { num: 'Art.14.27', zh: '競爭政策', en: 'Competition Policy' },
        { num: 'Art.14.28', zh: '人工智慧', en: 'Artificial Intelligence' },
        { num: 'Art.14.29', zh: '金融科技合作', en: 'FinTech Cooperation' },
        { num: 'Art.14.30', zh: '數位身分', en: 'Digital Identities' },
        { num: 'Art.14.31', zh: '標準與符合性評鑑', en: 'Standards and Conformity Assessment' },
      ],
    },
    {
      theme: '數位包容與發展', themeEn: 'Digital Inclusion & Development',
      articles: [
        { num: 'Art.14.32', zh: '中小企業數位化', en: 'SME Digitalisation' },
        { num: 'Art.14.33', zh: '數位包容', en: 'Digital Inclusion' },
      ],
    },
    {
      theme: '合作與對話機制', themeEn: 'Cooperation & Dialogue',
      articles: [
        { num: 'Art.4', zh: '合作（主協定）', en: 'Cooperation' },
        { num: 'Art.14.4', zh: '資訊分享', en: 'Information Sharing' },
        { num: 'Art.14.34', zh: '利害關係人參與', en: 'Stakeholder Engagement' },
      ],
    },
    {
      theme: '協議管理', themeEn: 'Administration',
      articles: [
        { num: 'Art.3', zh: '韓星自由貿易協定之修正（主協定）', en: 'Amendment of the Korea-Singapore FTA' },
        { num: 'Art.5', zh: '生效（主協定）', en: 'Entry into Force' },
        { num: 'Art.6', zh: '修正（主協定）', en: 'Amendments' },
      ],
    },
  ],

  // ─── WTO 電子商務 JSI 穩定文本 (INF/ECOM/87) ─────────────────────────
  'wto-jsi-ecommerce': [
    {
      theme: 'A：範圍與一般規定', themeEn: 'Scope and General Provisions',
      articles: [
        { num: 'Art.1', zh: '適用範圍', en: 'Scope' },
        { num: 'Art.2', zh: '定義', en: 'Definitions' },
        { num: 'Art.3', zh: '與其他協定之關係', en: 'Relation to Other Agreements' },
      ],
    },
    {
      theme: 'B：促進電子商務', themeEn: 'Enabling Electronic Commerce',
      articles: [
        { num: 'Art.4', zh: '電子交易框架', en: 'Electronic Transactions Framework' },
        { num: 'Art.5', zh: '電子認證與電子簽章', en: 'Electronic Authentication and Electronic Signatures' },
        { num: 'Art.6', zh: '電子契約', en: 'Electronic Contracts' },
        { num: 'Art.7', zh: '電子發票', en: 'Electronic Invoicing' },
        { num: 'Art.8', zh: '無紙化貿易', en: 'Paperless Trading' },
        { num: 'Art.9', zh: '單一窗口資料交換與系統互通性', en: 'Single Windows Data Exchange and System Interoperability' },
        { num: 'Art.10', zh: '電子支付', en: 'Electronic Payments' },
      ],
    },
    {
      theme: 'C：開放性與電子商務', themeEn: 'Openness and Electronic Commerce',
      articles: [
        { num: 'Art.11', zh: '電子傳輸關稅', en: 'Customs Duties on Electronic Transmissions' },
        { num: 'Art.12', zh: '開放政府資料', en: 'Open Government Data' },
        { num: 'Art.13', zh: '電子商務之網際網路接取與使用', en: 'Access to and Use of the Internet for Electronic Commerce' },
      ],
    },
    {
      theme: 'D：信任與電子商務', themeEn: 'Trust and Electronic Commerce',
      articles: [
        { num: 'Art.14', zh: '線上消費者保護', en: 'Online Consumer Protection' },
        { num: 'Art.15', zh: '未經請求之商業電子訊息', en: 'Unsolicited Commercial Electronic Messages' },
        { num: 'Art.16', zh: '個人資料保護', en: 'Personal Data Protection' },
        { num: 'Art.17', zh: '網路安全', en: 'Cybersecurity' },
      ],
    },
    {
      theme: 'E：透明度、合作與發展', themeEn: 'Transparency, Cooperation and Development',
      articles: [
        { num: 'Art.18', zh: '透明度', en: 'Transparency' },
        { num: 'Art.19', zh: '合作', en: 'Cooperation' },
        { num: 'Art.20', zh: '發展', en: 'Development' },
      ],
    },
    {
      theme: 'F：電信', themeEn: 'Telecommunications',
      articles: [
        { num: 'Art.21', zh: '電信', en: 'Telecommunications' },
      ],
    },
    {
      theme: 'G：例外', themeEn: 'Exceptions',
      articles: [
        { num: 'Art.22', zh: '一般例外', en: 'General Exceptions' },
        { num: 'Art.23', zh: '安全例外', en: 'Security Exception' },
        { num: 'Art.24', zh: '審慎措施', en: 'Prudential Measures' },
        { num: 'Art.25', zh: '個人資料保護例外', en: 'Personal Data Protection Exception' },
        { num: 'Art.26', zh: '原住民族', en: 'Indigenous Peoples' },
      ],
    },
    {
      theme: 'H：制度安排與最終條款', themeEn: 'Institutional Arrangements and Final Provisions',
      articles: [
        { num: 'Art.27', zh: '爭端解決', en: 'Dispute Settlement' },
        { num: 'Art.28', zh: '電子商務貿易相關層面委員會', en: 'Committee on Trade-Related Aspects of Electronic Commerce' },
        { num: 'Art.29', zh: '接受與生效', en: 'Acceptance and Entry into Force' },
        { num: 'Art.30', zh: '加入', en: 'Accession' },
        { num: 'Art.31', zh: '實施', en: 'Implementation' },
        { num: 'Art.32', zh: '保留', en: 'Reservations' },
        { num: 'Art.33', zh: '修正', en: 'Amendments' },
        { num: 'Art.34', zh: '退出', en: 'Withdrawal' },
        { num: 'Art.35', zh: '特定締約方間不適用本協定', en: 'Non-Application between Specific Parties' },
        { num: 'Art.36', zh: '檢視', en: 'Review' },
        { num: 'Art.37', zh: '秘書處', en: 'Secretariat' },
        { num: 'Art.38', zh: '保存', en: 'Deposit' },
        { num: 'Art.39', zh: '登記', en: 'Registration' },
      ],
    },
  ],
};
