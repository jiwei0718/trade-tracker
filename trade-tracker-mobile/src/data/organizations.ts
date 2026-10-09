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
  // ── 區域貿易組織:讓國家頁能透過會員身分查到集團名義簽署的協定 ──
  {
    code: 'SACU',
    nameZh: '南部非洲關稅同盟',
    abbrZh: 'SACU',
    name: 'Southern African Customs Union',
    abbr: 'SACU',
    category: 'economic',
    members: ['ZA', 'BW', 'LS', 'NA', 'SZ'],
    founded: '1910',
    hq: '納米比亞溫荷克',
    descriptionZh: '全球現存最古老的關稅同盟,由南非、波札那、賴索托、納米比亞與史瓦帝尼組成,對外適用共同關稅並分配關稅收入。',
    sourceUrl: 'https://www.sacu.int/',
  },
  {
    code: 'CACM',
    nameZh: '中美洲共同市場',
    abbrZh: '中美洲共同市場',
    name: 'Central American Common Market',
    abbr: 'CACM',
    category: 'economic',
    members: ['CR', 'SV', 'GT', 'HN', 'NI', 'PA'],
    founded: '1960',
    hq: '瓜地馬拉瓜地馬拉市(SIECA)',
    descriptionZh: '中美洲經濟整合體系,成員包括哥斯大黎加、薩爾瓦多、瓜地馬拉、宏都拉斯、尼加拉瓜,巴拿馬於 2013 年加入。',
    sourceUrl: 'https://www.sieca.int/',
  },
  {
    code: 'CAN',
    nameZh: '安地斯共同體',
    abbrZh: '安地斯共同體',
    name: 'Andean Community',
    abbr: 'CAN',
    category: 'economic',
    members: ['BO', 'CO', 'EC', 'PE'],
    founded: '1969',
    hq: '秘魯利馬',
    descriptionZh: '南美洲安地斯山區國家的關稅同盟與整合組織,成員為玻利維亞、哥倫比亞、厄瓜多與秘魯。',
    sourceUrl: 'https://www.comunidadandina.org/',
  },
  {
    code: 'CARICOM',
    nameZh: '加勒比共同體',
    abbrZh: '加共體',
    name: 'Caribbean Community',
    abbr: 'CARICOM',
    category: 'economic',
    members: ['AG', 'BS', 'BB', 'BZ', 'DM', 'GD', 'GY', 'HT', 'JM', 'KN', 'LC', 'VC', 'SR', 'TT'],
    founded: '1973',
    hq: '蓋亞那喬治城',
    descriptionZh: '加勒比海國家的共同市場與經濟整合組織(另有英屬蒙特塞拉特為成員,此處只列主權國家)。',
    sourceUrl: 'https://caricom.org/',
  },
  {
    code: 'CARIFORUM',
    nameZh: '加勒比論壇',
    abbrZh: '加勒比論壇',
    name: 'Forum of the Caribbean Group of ACP States',
    abbr: 'CARIFORUM',
    category: 'economic',
    members: ['AG', 'BS', 'BB', 'BZ', 'DM', 'GD', 'GY', 'HT', 'JM', 'KN', 'LC', 'VC', 'SR', 'TT', 'DO'],
    founded: '1992',
    hq: '蓋亞那喬治城',
    descriptionZh: '加勒比共同體國家加上多明尼加,作為與歐盟、英國簽署經濟夥伴協定(EPA)的談判集團。',
    sourceUrl: 'https://www.cariforum.org/',
  },
  {
    code: 'COMESA',
    nameZh: '東南非共同市場',
    abbrZh: '東南非共同市場',
    name: 'Common Market for Eastern and Southern Africa',
    abbr: 'COMESA',
    category: 'economic',
    members: ['BI', 'KM', 'CD', 'DJ', 'EG', 'ER', 'SZ', 'ET', 'KE', 'LY', 'MG', 'MW', 'MU', 'RW', 'SC', 'SO', 'SD', 'TN', 'UG', 'ZM', 'ZW'],
    founded: '1994',
    hq: '尚比亞路沙卡',
    descriptionZh: '由 21 個東部與南部非洲國家組成的自由貿易區,是非洲大陸自由貿易區(AfCFTA)的基礎區域組織之一。',
    sourceUrl: 'https://www.comesa.int/',
  },
  {
    code: 'EAC',
    nameZh: '東非共同體',
    abbrZh: '東非共同體',
    name: 'East African Community',
    abbr: 'EAC',
    category: 'economic',
    members: ['KE', 'UG', 'TZ', 'RW', 'BI', 'SS', 'CD', 'SO'],
    founded: '2000',
    hq: '坦尚尼亞阿魯沙',
    descriptionZh: '東非的關稅同盟與共同市場,剛果民主共和國(2022)與索馬利亞(2024)為最新成員。',
    sourceUrl: 'https://www.eac.int/',
  },
  {
    code: 'SADC',
    nameZh: '南部非洲發展共同體',
    abbrZh: '南共體',
    name: 'Southern African Development Community',
    abbr: 'SADC',
    category: 'economic',
    members: ['AO', 'BW', 'KM', 'CD', 'SZ', 'LS', 'MG', 'MW', 'MU', 'MZ', 'NA', 'SC', 'ZA', 'TZ', 'ZM', 'ZW'],
    founded: '1992',
    hq: '波札那嘉柏隆里',
    descriptionZh: '由 16 個南部非洲國家組成的區域組織,設有自由貿易區,並以集團名義與歐盟簽署經濟夥伴協定。',
    sourceUrl: 'https://www.sadc.int/',
  },
  {
    code: 'ECOWAS',
    nameZh: '西非國家經濟共同體',
    abbrZh: '西共體',
    name: 'Economic Community of West African States',
    abbr: 'ECOWAS',
    category: 'economic',
    members: ['BJ', 'CV', 'CI', 'GM', 'GH', 'GN', 'GW', 'LR', 'NG', 'SN', 'SL', 'TG'],
    founded: '1975',
    hq: '奈及利亞阿布加',
    descriptionZh: '西非的區域經濟組織。馬利、布吉納法索與尼日已於 2025 年 1 月退出,現有 12 個成員。',
    sourceUrl: 'https://ecowas.int/',
  },
  {
    code: 'CEMAC',
    nameZh: '中非經濟暨貨幣共同體',
    abbrZh: '中非經貨共同體',
    name: 'Economic and Monetary Community of Central Africa',
    abbr: 'CEMAC',
    category: 'economic',
    members: ['CM', 'CF', 'TD', 'CG', 'GQ', 'GA'],
    founded: '1994',
    hq: '中非共和國班基',
    descriptionZh: '中部非洲六國的關稅同盟與貨幣同盟,共同使用中非法郎。',
    sourceUrl: 'https://www.cemac.int/',
  },
  {
    code: 'WAEMU',
    aliasCodes: ['UEMOA'],
    nameZh: '西非經濟暨貨幣聯盟',
    abbrZh: '西非經貨聯盟',
    name: 'West African Economic and Monetary Union',
    abbr: 'WAEMU',
    category: 'economic',
    members: ['BJ', 'BF', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG'],
    founded: '1994',
    hq: '布吉納法索瓦加杜古',
    descriptionZh: '西非八國的關稅同盟與貨幣同盟,共同使用西非法郎。',
    sourceUrl: 'https://www.uemoa.int/',
  },
  {
    code: 'EAEU',
    nameZh: '歐亞經濟聯盟',
    abbrZh: '歐亞經濟聯盟',
    name: 'Eurasian Economic Union',
    abbr: 'EAEU',
    category: 'economic',
    members: ['RU', 'BY', 'KZ', 'AM', 'KG'],
    founded: '2015',
    hq: '俄羅斯莫斯科',
    descriptionZh: '俄羅斯、白俄羅斯、哈薩克、亞美尼亞與吉爾吉斯組成的關稅同盟與單一市場,以集團名義對外簽署自由貿易協定。',
    sourceUrl: 'https://eaeunion.org/',
  },
  {
    code: 'SAARC',
    aliasCodes: ['SAFTA'],
    nameZh: '南亞區域合作聯盟',
    abbrZh: '南亞區域合作聯盟',
    name: 'South Asian Association for Regional Cooperation',
    abbr: 'SAARC',
    category: 'economic',
    members: ['AF', 'BD', 'BT', 'IN', 'MV', 'NP', 'PK', 'LK'],
    founded: '1985',
    hq: '尼泊爾加德滿都',
    descriptionZh: '南亞八國的區域組織,成員之間簽有南亞自由貿易協定(SAFTA)。',
    sourceUrl: 'https://www.saarc-sec.org/',
  },
  {
    code: 'APTA',
    nameZh: '亞太貿易協定締約方',
    abbrZh: '亞太貿易協定',
    name: 'Asia-Pacific Trade Agreement',
    abbr: 'APTA',
    category: 'economic',
    members: ['BD', 'CN', 'IN', 'LA', 'KR', 'LK', 'MN'],
    founded: '1975',
    hq: '泰國曼谷(聯合國亞太經社會)',
    descriptionZh: '前身為 1975 年的曼谷協定,是亞太地區最早的優惠貿易協定之一,由聯合國亞太經濟社會委員會擔任秘書處。',
    sourceUrl: 'https://www.unescap.org/content/apta',
  },
  {
    code: 'LAIA',
    aliasCodes: ['ALADI'],
    nameZh: '拉丁美洲整合協會',
    abbrZh: '拉美整合協會',
    name: 'Latin American Integration Association',
    abbr: 'LAIA',
    category: 'economic',
    members: ['AR', 'BO', 'BR', 'CL', 'CO', 'CU', 'EC', 'MX', 'PA', 'PY', 'PE', 'UY', 'VE'],
    founded: '1980',
    hq: '烏拉圭蒙特維多',
    descriptionZh: '拉丁美洲最大的整合組織,作為成員間各項優惠貿易與經濟互補協定的架構。',
    sourceUrl: 'https://www.aladi.org/',
  },
  {
    code: 'CEFTA',
    nameZh: '中歐自由貿易協定締約方',
    abbrZh: '中歐自由貿易協定',
    name: 'Central European Free Trade Agreement',
    abbr: 'CEFTA',
    category: 'economic',
    members: ['AL', 'BA', 'MD', 'ME', 'MK', 'RS', 'XK'],
    founded: '2006',
    hq: '比利時布魯塞爾',
    descriptionZh: '2006 年版中歐自由貿易協定,目前締約方為西巴爾幹國家與摩爾多瓦(早期成員加入歐盟後退出)。',
    sourceUrl: 'https://cefta.int/',
  },
  {
    code: 'PACIFIC-ALLIANCE',
    nameZh: '太平洋聯盟',
    abbrZh: '太平洋聯盟',
    name: 'Pacific Alliance',
    abbr: 'PA',
    category: 'economic',
    members: ['CL', 'CO', 'MX', 'PE'],
    founded: '2011',
    hq: '(輪值主席國)',
    descriptionZh: '智利、哥倫比亞、墨西哥與秘魯的區域整合倡議,以集團名義與新加坡簽署自由貿易協定。',
    sourceUrl: 'https://alianzapacifico.net/',
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
