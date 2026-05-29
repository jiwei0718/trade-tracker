/**
 * 標籤系統 (tags)。每個標籤都以「中文 (English)」呈現。
 *
 * 標籤分為五類 (tagCategory)：
 *  - type     協定類型      (FTA、數位經濟協定、複邊、聯合聲明倡議…)
 *  - domain   議題領域      (數位、商品、服務、投資、汽車、氣候…)
 *  - issue    內容關注議題  (電子簽章、無紙化、電子支付、中小企業…多為自條文衍生)
 *  - org      國際組織      (東協、歐盟、WTO…)
 *  - special  特殊／臺灣    (臺灣、解放日後、地緣政治、里程碑…)
 *
 * 國家標籤已移除——國家可於「國家」分頁查詢；僅保留 `taiwan` 標籤。
 */
export type TagCategory = 'type' | 'domain' | 'issue' | 'org' | 'special';

interface TagDef { zh: string; en: string; cat: TagCategory; }

const TAG_LABELS: Record<string, TagDef> = {
  // ── 協定類型 (type) ──
  'fta': { zh: '自由貿易協定', en: 'FTA', cat: 'type' },
  'dea': { zh: '數位經濟協定', en: 'DEA', cat: 'type' },
  'bilateral': { zh: '雙邊', en: 'Bilateral', cat: 'type' },
  'multilateral': { zh: '多邊', en: 'Multilateral', cat: 'type' },
  'regional': { zh: '區域', en: 'Regional', cat: 'type' },
  'plurilateral': { zh: '複邊', en: 'Plurilateral', cat: 'type' },
  'jsi': { zh: '聯合聲明倡議', en: 'JSI', cat: 'type' },
  'joint-statement': { zh: '聯合聲明', en: 'Joint Statement', cat: 'type' },
  'framework': { zh: '框架協定', en: 'Framework', cat: 'type' },
  'customs-union': { zh: '關稅同盟', en: 'Customs Union', cat: 'type' },
  'forum': { zh: '論壇', en: 'Forum', cat: 'type' },
  'non-binding': { zh: '非拘束性', en: 'Non-Binding', cat: 'type' },
  'sectoral': { zh: '特定領域', en: 'Sectoral', cat: 'type' },
  'preferential': { zh: '優惠貿易', en: 'Preferential', cat: 'type' },
  'regional-integration': { zh: '區域整合', en: 'Regional Integration', cat: 'type' },
  'multilateral-cornerstone': { zh: '多邊基石', en: 'Multilateral Cornerstone', cat: 'type' },
  'wto-notified': { zh: 'WTO 已通報', en: 'WTO-Notified', cat: 'type' },

  // ── 議題領域 (domain) ──
  'digital': { zh: '數位貿易', en: 'Digital Trade', cat: 'domain' },
  'goods': { zh: '商品', en: 'Goods', cat: 'domain' },
  'services': { zh: '服務', en: 'Services', cat: 'domain' },
  'investment': { zh: '投資', en: 'Investment', cat: 'domain' },
  'investment-facilitation': { zh: '投資便利化', en: 'Investment Facilitation', cat: 'domain' },
  'IP': { zh: '智慧財產', en: 'Intellectual Property', cat: 'domain' },
  'agriculture': { zh: '農業', en: 'Agriculture', cat: 'domain' },
  'minerals': { zh: '關鍵礦產', en: 'Critical Minerals', cat: 'domain' },
  'energy': { zh: '能源', en: 'Energy', cat: 'domain' },
  'automotive': { zh: '汽車', en: 'Automotive', cat: 'domain' },
  'mobility': { zh: '人員流動', en: 'Mobility', cat: 'domain' },
  'fisheries': { zh: '漁業', en: 'Fisheries', cat: 'domain' },
  'procurement': { zh: '政府採購', en: 'Government Procurement', cat: 'domain' },
  'dispute-settlement': { zh: '爭端解決', en: 'Dispute Settlement', cat: 'domain' },
  'sustainability': { zh: '永續發展', en: 'Sustainability', cat: 'domain' },
  'green economy': { zh: '綠色經濟', en: 'Green Economy', cat: 'domain' },
  'financial-services': { zh: '金融服務', en: 'Financial Services', cat: 'domain' },
  'IT': { zh: '資訊科技', en: 'IT', cat: 'domain' },
  'labour': { zh: '勞工', en: 'Labour', cat: 'domain' },
  'environment': { zh: '環境', en: 'Environment', cat: 'domain' },

  // ── 內容關注議題 (issue) ──
  'data flows': { zh: '資料流動', en: 'Data Flows', cat: 'issue' },
  'e-commerce': { zh: '電子商務', en: 'E-Commerce', cat: 'issue' },
  'e-signature': { zh: '電子簽章', en: 'E-Signature', cat: 'issue' },
  'e-payment': { zh: '電子支付', en: 'E-Payment', cat: 'issue' },
  'e-invoicing': { zh: '電子發票', en: 'E-Invoicing', cat: 'issue' },
  'e-contract': { zh: '電子契約', en: 'Electronic Contracts', cat: 'issue' },
  'e-transactions': { zh: '電子交易框架', en: 'Electronic Transactions', cat: 'issue' },
  'paperless': { zh: '無紙化貿易', en: 'Paperless Trading', cat: 'issue' },
  'cross-border-data': { zh: '跨境資料傳輸', en: 'Cross-Border Data', cat: 'issue' },
  'data-privacy': { zh: '個人資料保護', en: 'Data Privacy', cat: 'issue' },
  'data-localisation': { zh: '資料在地化／算力設施', en: 'Data Localisation', cat: 'issue' },
  'source-code': { zh: '原始碼', en: 'Source Code', cat: 'issue' },
  'cryptography': { zh: '密碼學產品', en: 'Cryptography', cat: 'issue' },
  'consumer-protection': { zh: '消費者保護', en: 'Consumer Protection', cat: 'issue' },
  'cybersecurity': { zh: '網路安全', en: 'Cybersecurity', cat: 'issue' },
  'digital-id': { zh: '數位身分', en: 'Digital Identity', cat: 'issue' },
  'digital-products': { zh: '數位產品', en: 'Digital Products', cat: 'issue' },
  'ai': { zh: '人工智慧', en: 'Artificial Intelligence', cat: 'issue' },
  'AI': { zh: '人工智慧', en: 'AI', cat: 'issue' },
  'fintech': { zh: '金融科技', en: 'FinTech', cat: 'issue' },
  'open-data': { zh: '開放政府資料', en: 'Open Government Data', cat: 'issue' },
  'customs-moratorium': { zh: '電子傳輸關稅', en: 'Customs on E-Transmissions', cat: 'issue' },
  'algorithm': { zh: '演算法', en: 'Algorithm', cat: 'issue' },
  'spam': { zh: '未經請求電子訊息', en: 'Unsolicited Messages', cat: 'issue' },
  'isp': { zh: '網路服務提供者', en: 'Internet Service Providers', cat: 'issue' },
  'internet-access': { zh: '網際網路接取', en: 'Internet Access', cat: 'issue' },
  'single-window': { zh: '單一窗口', en: 'Single Window', cat: 'issue' },
  'standards': { zh: '標準與符合性評鑑', en: 'Standards & Conformity', cat: 'issue' },
  'msme': { zh: '中小微企業', en: 'MSME', cat: 'issue' },
  'logistics': { zh: '物流', en: 'Logistics', cat: 'issue' },

  // ── 國際組織 (org) ──
  'asean': { zh: '東協', en: 'ASEAN', cat: 'org' },
  'eu': { zh: '歐盟', en: 'EU', cat: 'org' },
  'efta': { zh: '歐洲自由貿易協會', en: 'EFTA', cat: 'org' },
  'mercosur': { zh: '南方共同市場', en: 'Mercosur', cat: 'org' },
  'apec': { zh: '亞太經合會', en: 'APEC', cat: 'org' },
  'gcc': { zh: '海合會', en: 'GCC', cat: 'org' },
  'wto': { zh: '世界貿易組織', en: 'WTO', cat: 'org' },
  'oecd': { zh: '經濟合作暨發展組織', en: 'OECD', cat: 'org' },
  'au': { zh: '非洲聯盟', en: 'AU', cat: 'org' },
  'oacps': { zh: '非加太國家組織', en: 'OACPS', cat: 'org' },

  // ── 特殊／臺灣 (special) ──
  'taiwan': { zh: '臺灣', en: 'Taiwan', cat: 'special' },
  'post-liberation-day': { zh: '解放日後', en: 'Post-Liberation Day', cat: 'special' },
  'mile-stone': { zh: '里程碑', en: 'Milestone', cat: 'special' },
  'brexit': { zh: '脫歐', en: 'Brexit', cat: 'special' },
  'geopolitics': { zh: '地緣政治', en: 'Geopolitics', cat: 'special' },
  'historical': { zh: '歷史', en: 'Historical', cat: 'special' },
  'protectionism': { zh: '保護主義', en: 'Protectionism', cat: 'special' },
  'colonial': { zh: '殖民時期', en: 'Colonial', cat: 'special' },
  'great-depression': { zh: '大蕭條', en: 'Great Depression', cat: 'special' },
  'us-trade-policy': { zh: '美國貿易政策', en: 'US Trade Policy', cat: 'special' },
  'pre-war': { zh: '戰前', en: 'Pre-War', cat: 'special' },
  'pre-accession': { zh: '入盟前', en: 'Pre-Accession', cat: 'special' },
  'development': { zh: '發展', en: 'Development', cat: 'special' },
  'first-of-kind': { zh: '首創', en: 'First of Kind', cat: 'special' },
  'first-asia': { zh: '亞洲首例', en: 'First in Asia', cat: 'special' },
  'first-asia-eu': { zh: '歐盟亞洲首例', en: 'EU First in Asia', cat: 'special' },
  'flagship': { zh: '旗艦協定', en: 'Flagship', cat: 'special' },
  'regional-expansion': { zh: '區域擴展', en: 'Regional Expansion', cat: 'special' },
  'suspended': { zh: '已暫停', en: 'Suspended', cat: 'special' },
  'negotiating': { zh: '談判中', en: 'Negotiating', cat: 'special' },
  'trump': { zh: '川普', en: 'Trump', cat: 'special' },
  'wto-crisis': { zh: 'WTO 危機', en: 'WTO Crisis', cat: 'special' },
  'wto-genesis': { zh: 'WTO 起源', en: 'WTO Genesis', cat: 'special' },
  'wto-birth': { zh: 'WTO 誕生', en: 'WTO Birth', cat: 'special' },
};

export const TAG_CATEGORY_LABELS: Record<TagCategory, string> = {
  type:    '協定類型',
  domain:  '議題領域',
  issue:   '內容關注議題',
  org:     '國際組織',
  special: '特殊／臺灣',
};

export const TAG_CATEGORY_ORDER: TagCategory[] = ['type', 'domain', 'issue', 'org', 'special'];

export function tagLabel(tag: string): string {
  const t = TAG_LABELS[tag];
  return t ? `${t.zh} (${t.en})` : tag;
}

export function tagCategory(tag: string): TagCategory {
  return TAG_LABELS[tag]?.cat ?? 'special';
}
