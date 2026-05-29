/**
 * 國際組織 (International Organizations) registry — bundled in-app.
 *
 * 這些是「機構」而非「協定」。協定 (agreements.ts) 與組織在概念上分開：
 * 組織有會員國 (members)，並可作為協定的締約方 (party code，如 DEFA 的締約方為 ASEAN)。
 *
 * 翻譯優先序：台灣官方 (外交部／經濟部) → 研究／學術機構 → 媒體 → 由本工具翻譯。
 * 中文名稱後以半形括號附原文／縮寫。
 *
 * 會員國 members：
 *  - 經濟／區域組織完整列出國家代碼 (ISO 兩碼)，用以驅動「從會員國頁面反查協定」。
 *  - 全球型組織 (WTO/UN/WHO/IMF/WB) members 留空（近乎全球，反查無實益）。
 */

export type OrgCategory = 'economic' | 'political' | 'financial' | 'security' | 'health' | 'global';

export interface Organization {
  code: string;            // 主要代碼（與 agreements 締約方代碼一致）
  aliasCodes?: string[];   // 其他在資料中使用的代碼（如 ACP→OACPS）
  nameZh: string;          // 中文全名
  abbrZh?: string;         // 中文簡稱（如 東協）
  name: string;            // 英文全名
  abbr: string;            // 英文縮寫
  category: OrgCategory;
  members: string[];       // 會員國 ISO 代碼
  founded?: string;        // 成立年份
  hq?: string;             // 總部
  descriptionZh: string;
  sourceUrl?: string;
}

export const ORG_CATEGORY_LABELS: Record<OrgCategory, string> = {
  economic:  '經濟／貿易',
  political:  '政治／區域整合',
  financial: '金融',
  security:  '安全／防務',
  health:    '衛生',
  global:    '全球治理',
};

const EU_MEMBERS = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const ASEAN_MEMBERS = ['BN','KH','ID','LA','MY','MM','PH','SG','TH','VN'];
const EFTA_MEMBERS = ['CH','NO','IS','LI'];
const MERCOSUR_MEMBERS = ['AR','BR','PY','UY','BO'];
const APEC_MEMBERS = ['AU','BN','CA','CL','CN','HK','ID','JP','KR','MY','MX','NZ','PG','PE','PH','RU','SG','TW','TH','US','VN'];
const GCC_MEMBERS = ['SA','AE','QA','KW','BH','OM'];
const OECD_MEMBERS = ['AU','AT','BE','CA','CL','CO','CR','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IL','IT','JP','KR','LV','LT','LU','MX','NL','NZ','NO','PL','PT','SK','SI','ES','SE','CH','TR','UK','US'];
const NATO_MEMBERS = ['AL','BE','BG','CA','HR','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IT','LV','LT','LU','ME','NL','MK','NO','PL','PT','RO','SK','SI','ES','SE','TR','UK','US'];
const AU_MEMBERS = ['DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER','SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ','NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'];
const OACPS_MEMBERS = ['NG','GH','CI','SN','KE','TZ','UG','ZM','ZW','MZ','AO','ET','CM','JM','TT','BB','BS','GY','SR','HT','DO','FJ','PG','WS','TO','VU','SB'];

export const ORGANIZATIONS: Organization[] = [
  {
    code: 'ASEAN',
    nameZh: '東南亞國家協會', abbrZh: '東協',
    name: 'Association of Southeast Asian Nations', abbr: 'ASEAN',
    category: 'political', members: ASEAN_MEMBERS,
    founded: '1967', hq: '印尼雅加達',
    descriptionZh: '由 10 個東南亞國家組成的區域政治與經濟組織，致力於區域整合與經濟合作，並對外簽署多項區域貿易與數位經濟協定（如 RCEP、DEFA）。',
    sourceUrl: 'https://asean.org/',
  },
  {
    code: 'EU',
    nameZh: '歐洲聯盟', abbrZh: '歐盟',
    name: 'European Union', abbr: 'EU',
    category: 'political', members: EU_MEMBERS,
    founded: '1993', hq: '比利時布魯塞爾',
    descriptionZh: '由 27 個歐洲國家組成的政治經濟聯盟，擁有單一市場與共同貿易政策，對外以單一主體簽署貿易協定。',
    sourceUrl: 'https://european-union.europa.eu/',
  },
  {
    code: 'EFTA',
    nameZh: '歐洲自由貿易協會', abbrZh: 'EFTA',
    name: 'European Free Trade Association', abbr: 'EFTA',
    category: 'economic', members: EFTA_MEMBERS,
    founded: '1960', hq: '瑞士日內瓦',
    descriptionZh: '由瑞士、挪威、冰島、列支敦斯登組成的自由貿易組織，未加入歐盟但與其維持密切經貿關係，並對外簽署 FTA。',
    sourceUrl: 'https://www.efta.int/',
  },
  {
    code: 'MERCOSUR',
    nameZh: '南方共同市場', abbrZh: 'Mercosur',
    name: 'Southern Common Market', abbr: 'MERCOSUR',
    category: 'economic', members: MERCOSUR_MEMBERS,
    founded: '1991', hq: '烏拉圭蒙特維多',
    descriptionZh: '南美洲關稅同盟，正式會員為阿根廷、巴西、巴拉圭、烏拉圭（玻利維亞加入中、委內瑞拉遭暫停會籍）。2024 年與歐盟達成歷史性貿易協議。',
    sourceUrl: 'https://www.mercosur.int/',
  },
  {
    code: 'APEC',
    nameZh: '亞太經濟合作會議', abbrZh: 'APEC',
    name: 'Asia-Pacific Economic Cooperation', abbr: 'APEC',
    category: 'economic', members: APEC_MEMBERS,
    founded: '1989', hq: '新加坡（秘書處）',
    descriptionZh: '由 21 個環太平洋經濟體組成的論壇型組織，以非拘束性方式推動區域貿易與投資自由化；我國以「中華臺北」名義為會員。',
    sourceUrl: 'https://www.apec.org/',
  },
  {
    code: 'GCC',
    nameZh: '海灣阿拉伯國家合作委員會', abbrZh: '海合會',
    name: 'Gulf Cooperation Council', abbr: 'GCC',
    category: 'economic', members: GCC_MEMBERS,
    founded: '1981', hq: '沙烏地阿拉伯利雅德',
    descriptionZh: '由 6 個波斯灣阿拉伯產油國組成的區域組織，設有關稅同盟與共同市場，並對外進行 FTA 談判。',
    sourceUrl: 'https://www.gcc-sg.org/',
  },
  {
    code: 'AU-CONT', aliasCodes: ['AU-CONT'],
    nameZh: '非洲聯盟', abbrZh: '非盟',
    name: 'African Union', abbr: 'AU',
    category: 'political', members: AU_MEMBERS,
    founded: '2002', hq: '衣索比亞阿迪斯阿貝巴',
    descriptionZh: '由 55 個非洲國家組成的大陸組織，推動非洲政治與經濟整合，主導非洲大陸自由貿易區（AfCFTA）。',
    sourceUrl: 'https://au.int/',
  },
  {
    code: 'OACPS', aliasCodes: ['ACP'],
    nameZh: '非洲、加勒比海及太平洋國家組織', abbrZh: 'OACPS（原 ACP）',
    name: 'Organisation of African, Caribbean and Pacific States', abbr: 'OACPS',
    category: 'political', members: OACPS_MEMBERS,
    founded: '1975', hq: '比利時布魯塞爾',
    descriptionZh: '由非洲、加勒比海與太平洋地區國家組成的政府間組織，長期與歐盟維持發展與貿易夥伴關係（洛梅公約、科托努協定、薩摩亞協定）。',
    sourceUrl: 'https://www.oacps.org/',
  },
  {
    code: 'OECD',
    nameZh: '經濟合作暨發展組織', abbrZh: 'OECD',
    name: 'Organisation for Economic Co-operation and Development', abbr: 'OECD',
    category: 'economic', members: OECD_MEMBERS,
    founded: '1961', hq: '法國巴黎',
    descriptionZh: '由 38 個主要為高所得國家組成的政府間組織，在貿易、數位經濟（如 INDIGO 指數）、稅務、投資領域制定具影響力的標準與分析。本應用的 INDIGO 數位貿易指數即出自 OECD。',
    sourceUrl: 'https://www.oecd.org/',
  },
  {
    code: 'WTO',
    nameZh: '世界貿易組織', abbrZh: 'WTO',
    name: 'World Trade Organization', abbr: 'WTO',
    category: 'global', members: [],
    founded: '1995', hq: '瑞士日內瓦',
    descriptionZh: '全球多邊貿易體系的核心組織，管理貨品（GATT）、服務（GATS）、智財權（TRIPS）規則並提供爭端解決機制，會員涵蓋近乎全球。我國以「臺澎金馬個別關稅領域」名義為會員。',
    sourceUrl: 'https://www.wto.org/',
  },
  {
    code: 'UN',
    nameZh: '聯合國', abbrZh: 'UN',
    name: 'United Nations', abbr: 'UN',
    category: 'global', members: [],
    founded: '1945', hq: '美國紐約',
    descriptionZh: '最大的政府間國際組織，宗旨為維護國際和平與安全、促進國際合作，會員近乎全球（193 國）。',
    sourceUrl: 'https://www.un.org/',
  },
  {
    code: 'WHO',
    nameZh: '世界衛生組織', abbrZh: 'WHO',
    name: 'World Health Organization', abbr: 'WHO',
    category: 'health', members: [],
    founded: '1948', hq: '瑞士日內瓦',
    descriptionZh: '聯合國轄下負責國際公共衛生事務的專門機構，協調全球衛生政策、疾病防治與緊急應變。',
    sourceUrl: 'https://www.who.int/',
  },
  {
    code: 'IMF',
    nameZh: '國際貨幣基金組織', abbrZh: 'IMF',
    name: 'International Monetary Fund', abbr: 'IMF',
    category: 'financial', members: [],
    founded: '1945', hq: '美國華盛頓特區',
    descriptionZh: '布列敦森林體系下的國際金融機構，維護全球金融穩定、提供成員國國際收支融資與政策諮詢。',
    sourceUrl: 'https://www.imf.org/',
  },
  {
    code: 'WB',
    nameZh: '世界銀行', abbrZh: 'WB',
    name: 'World Bank', abbr: 'WB',
    category: 'financial', members: [],
    founded: '1944', hq: '美國華盛頓特區',
    descriptionZh: '提供開發中國家貸款與發展援助的國際金融機構，與 IMF 同屬布列敦森林體系。',
    sourceUrl: 'https://www.worldbank.org/',
  },
  {
    code: 'NATO',
    nameZh: '北大西洋公約組織', abbrZh: '北約',
    name: 'North Atlantic Treaty Organization', abbr: 'NATO',
    category: 'security', members: NATO_MEMBERS,
    founded: '1949', hq: '比利時布魯塞爾',
    descriptionZh: '跨大西洋的政治與軍事聯盟，以集體防禦（《北大西洋公約》第 5 條）為核心，現有 32 個會員國。',
    sourceUrl: 'https://www.nato.int/',
  },
];

const BY_CODE = new Map<string, Organization>();
for (const o of ORGANIZATIONS) {
  BY_CODE.set(o.code, o);
  o.aliasCodes?.forEach(a => BY_CODE.set(a, o));
}

export function orgByCode(code: string): Organization | undefined {
  return BY_CODE.get(code);
}

export function isOrgCode(code: string): boolean {
  return BY_CODE.has(code);
}

/** "東協 (ASEAN)" — prefers Chinese abbreviation. */
export function orgDisplay(code: string, fallback?: string): string {
  const o = BY_CODE.get(code);
  if (!o) return fallback ?? code;
  return `${o.abbrZh ?? o.nameZh} (${o.abbr})`;
}

export function membersOf(code: string): string[] {
  return BY_CODE.get(code)?.members ?? [];
}
