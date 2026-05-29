/**
 * Canonical country / bloc registry.
 * - code: internationally common abbreviation (UK not GB, US, TW...)
 * - zh:   Taiwan-usage Chinese name (formal). Taiwan = 中華民國(臺灣).
 * - en:   English name
 * - aliases: extra search terms (zh variants, en, abbreviations)
 *
 * Used for display (always show zh) and multi-field search (zh/en/code/alias).
 */
export interface Country {
  code: string;
  zh: string;
  en: string;
  aliases: string[];
}

export const COUNTRIES: Country[] = [
  { code: 'TW', zh: '中華民國(臺灣)', en: 'Taiwan', aliases: ['台灣', '臺灣', '中華民國', 'Taiwan', 'Chinese Taipei', '台', '臺', '台澎金馬', '臺澎金馬'] },
  { code: 'US', zh: '美國', en: 'United States', aliases: ['美國', 'United States', 'USA', 'America', '美'] },
  { code: 'UK', zh: '英國', en: 'United Kingdom', aliases: ['英國', 'United Kingdom', 'UK', 'GB', 'Britain', 'Great Britain', '英'] },
  { code: 'CN', zh: '中國', en: 'China', aliases: ['中國', 'China', 'PRC', '中國大陸', '中'] },
  { code: 'JP', zh: '日本', en: 'Japan', aliases: ['日本', 'Japan', '日'] },
  { code: 'KR', zh: '韓國', en: 'South Korea', aliases: ['韓國', 'Korea', 'South Korea', 'Republic of Korea', '南韓', '大韓民國', '韓'] },
  { code: 'IN', zh: '印度', en: 'India', aliases: ['印度', 'India'] },
  { code: 'EU', zh: '歐盟', en: 'European Union', aliases: ['歐盟', 'European Union', 'EU', '歐洲聯盟', 'EC'] },
  { code: 'EFTA', zh: '歐洲自由貿易聯盟', en: 'EFTA', aliases: ['歐洲自由貿易聯盟', 'EFTA', 'European Free Trade Association'] },
  { code: 'ASEAN', zh: '東協', en: 'ASEAN', aliases: ['東協', 'ASEAN', '東南亞國家協會', '東盟'] },
  { code: 'AU', zh: '澳洲', en: 'Australia', aliases: ['澳洲', 'Australia', '澳大利亞', '澳'] },
  { code: 'NZ', zh: '紐西蘭', en: 'New Zealand', aliases: ['紐西蘭', 'New Zealand', '新西蘭'] },
  { code: 'CA', zh: '加拿大', en: 'Canada', aliases: ['加拿大', 'Canada', '加'] },
  { code: 'MX', zh: '墨西哥', en: 'Mexico', aliases: ['墨西哥', 'Mexico'] },
  { code: 'BR', zh: '巴西', en: 'Brazil', aliases: ['巴西', 'Brazil'] },
  { code: 'AR', zh: '阿根廷', en: 'Argentina', aliases: ['阿根廷', 'Argentina'] },
  { code: 'CL', zh: '智利', en: 'Chile', aliases: ['智利', 'Chile'] },
  { code: 'PE', zh: '秘魯', en: 'Peru', aliases: ['秘魯', 'Peru'] },
  { code: 'CO', zh: '哥倫比亞', en: 'Colombia', aliases: ['哥倫比亞', 'Colombia'] },
  { code: 'UY', zh: '烏拉圭', en: 'Uruguay', aliases: ['烏拉圭', 'Uruguay'] },
  { code: 'PY', zh: '巴拉圭', en: 'Paraguay', aliases: ['巴拉圭', 'Paraguay'] },
  { code: 'EC', zh: '厄瓜多', en: 'Ecuador', aliases: ['厄瓜多', 'Ecuador', '厄瓜多爾'] },
  { code: 'BO', zh: '玻利維亞', en: 'Bolivia', aliases: ['玻利維亞', 'Bolivia'] },
  { code: 'VE', zh: '委內瑞拉', en: 'Venezuela', aliases: ['委內瑞拉', 'Venezuela'] },
  { code: 'SG', zh: '新加坡', en: 'Singapore', aliases: ['新加坡', 'Singapore', '星國', '星'] },
  { code: 'MY', zh: '馬來西亞', en: 'Malaysia', aliases: ['馬來西亞', 'Malaysia', '大馬'] },
  { code: 'TH', zh: '泰國', en: 'Thailand', aliases: ['泰國', 'Thailand', '泰'] },
  { code: 'VN', zh: '越南', en: 'Vietnam', aliases: ['越南', 'Vietnam', 'Viet Nam'] },
  { code: 'ID', zh: '印尼', en: 'Indonesia', aliases: ['印尼', 'Indonesia', '印度尼西亞'] },
  { code: 'PH', zh: '菲律賓', en: 'Philippines', aliases: ['菲律賓', 'Philippines', '菲'] },
  { code: 'BN', zh: '汶萊', en: 'Brunei', aliases: ['汶萊', 'Brunei', '文萊'] },
  { code: 'KH', zh: '柬埔寨', en: 'Cambodia', aliases: ['柬埔寨', 'Cambodia'] },
  { code: 'LA', zh: '寮國', en: 'Laos', aliases: ['寮國', 'Laos', 'Lao'] },
  { code: 'MM', zh: '緬甸', en: 'Myanmar', aliases: ['緬甸', 'Myanmar', 'Burma'] },
  { code: 'HK', zh: '香港', en: 'Hong Kong', aliases: ['香港', 'Hong Kong', '港'] },
  { code: 'MO', zh: '澳門', en: 'Macao', aliases: ['澳門', 'Macao', 'Macau'] },
  { code: 'CH', zh: '瑞士', en: 'Switzerland', aliases: ['瑞士', 'Switzerland'] },
  { code: 'NO', zh: '挪威', en: 'Norway', aliases: ['挪威', 'Norway'] },
  { code: 'IS', zh: '冰島', en: 'Iceland', aliases: ['冰島', 'Iceland'] },
  { code: 'LI', zh: '列支敦斯登', en: 'Liechtenstein', aliases: ['列支敦斯登', 'Liechtenstein'] },
  { code: 'TR', zh: '土耳其', en: 'Türkiye', aliases: ['土耳其', 'Turkey', 'Türkiye'] },
  { code: 'RU', zh: '俄羅斯', en: 'Russia', aliases: ['俄羅斯', 'Russia', 'Russian Federation', '俄'] },
  { code: 'UA', zh: '烏克蘭', en: 'Ukraine', aliases: ['烏克蘭', 'Ukraine'] },
  { code: 'MD', zh: '摩爾多瓦', en: 'Moldova', aliases: ['摩爾多瓦', 'Moldova'] },
  { code: 'GE', zh: '喬治亞', en: 'Georgia', aliases: ['喬治亞', 'Georgia', '格魯吉亞'] },
  { code: 'AM', zh: '亞美尼亞', en: 'Armenia', aliases: ['亞美尼亞', 'Armenia'] },
  { code: 'AZ', zh: '亞塞拜然', en: 'Azerbaijan', aliases: ['亞塞拜然', 'Azerbaijan', '阿塞拜疆'] },
  { code: 'KZ', zh: '哈薩克', en: 'Kazakhstan', aliases: ['哈薩克', 'Kazakhstan'] },
  { code: 'KG', zh: '吉爾吉斯', en: 'Kyrgyzstan', aliases: ['吉爾吉斯', 'Kyrgyz'] },
  { code: 'UZ', zh: '烏茲別克', en: 'Uzbekistan', aliases: ['烏茲別克', 'Uzbekistan'] },
  { code: 'TJ', zh: '塔吉克', en: 'Tajikistan', aliases: ['塔吉克', 'Tajikistan'] },
  { code: 'IL', zh: '以色列', en: 'Israel', aliases: ['以色列', 'Israel'] },
  { code: 'JO', zh: '約旦', en: 'Jordan', aliases: ['約旦', 'Jordan'] },
  { code: 'EG', zh: '埃及', en: 'Egypt', aliases: ['埃及', 'Egypt'] },
  { code: 'MA', zh: '摩洛哥', en: 'Morocco', aliases: ['摩洛哥', 'Morocco'] },
  { code: 'TN', zh: '突尼西亞', en: 'Tunisia', aliases: ['突尼西亞', 'Tunisia'] },
  { code: 'SA', zh: '沙烏地阿拉伯', en: 'Saudi Arabia', aliases: ['沙烏地阿拉伯', 'Saudi Arabia', '沙烏地', '沙地'] },
  { code: 'AE', zh: '阿聯酋', en: 'United Arab Emirates', aliases: ['阿聯酋', 'UAE', 'United Arab Emirates', '阿拉伯聯合大公國'] },
  { code: 'QA', zh: '卡達', en: 'Qatar', aliases: ['卡達', 'Qatar', '卡塔爾'] },
  { code: 'KW', zh: '科威特', en: 'Kuwait', aliases: ['科威特', 'Kuwait'] },
  { code: 'BH', zh: '巴林', en: 'Bahrain', aliases: ['巴林', 'Bahrain'] },
  { code: 'OM', zh: '阿曼', en: 'Oman', aliases: ['阿曼', 'Oman'] },
  { code: 'GCC', zh: '海灣合作委員會', en: 'Gulf Cooperation Council', aliases: ['海灣合作委員會', 'GCC', 'Gulf Cooperation Council', '海合會'] },
  { code: 'ZA', zh: '南非', en: 'South Africa', aliases: ['南非', 'South Africa'] },
  { code: 'NG', zh: '奈及利亞', en: 'Nigeria', aliases: ['奈及利亞', 'Nigeria', '尼日利亞'] },
  { code: 'KE', zh: '肯亞', en: 'Kenya', aliases: ['肯亞', 'Kenya'] },
  { code: 'MU', zh: '模里西斯', en: 'Mauritius', aliases: ['模里西斯', 'Mauritius'] },
  { code: 'PK', zh: '巴基斯坦', en: 'Pakistan', aliases: ['巴基斯坦', 'Pakistan'] },
  { code: 'BD', zh: '孟加拉', en: 'Bangladesh', aliases: ['孟加拉', 'Bangladesh'] },
  { code: 'LK', zh: '斯里蘭卡', en: 'Sri Lanka', aliases: ['斯里蘭卡', 'Sri Lanka'] },
  { code: 'NP', zh: '尼泊爾', en: 'Nepal', aliases: ['尼泊爾', 'Nepal'] },
  { code: 'MN', zh: '蒙古', en: 'Mongolia', aliases: ['蒙古', 'Mongolia'] },
  { code: 'CR', zh: '哥斯大黎加', en: 'Costa Rica', aliases: ['哥斯大黎加', 'Costa Rica', '哥斯達黎加'] },
  { code: 'PA', zh: '巴拿馬', en: 'Panama', aliases: ['巴拿馬', 'Panama'] },
  { code: 'GT', zh: '瓜地馬拉', en: 'Guatemala', aliases: ['瓜地馬拉', 'Guatemala'] },
  { code: 'HN', zh: '宏都拉斯', en: 'Honduras', aliases: ['宏都拉斯', 'Honduras'] },
  { code: 'SV', zh: '薩爾瓦多', en: 'El Salvador', aliases: ['薩爾瓦多', 'El Salvador'] },
  { code: 'NI', zh: '尼加拉瓜', en: 'Nicaragua', aliases: ['尼加拉瓜', 'Nicaragua'] },
  { code: 'DO', zh: '多明尼加', en: 'Dominican Republic', aliases: ['多明尼加', 'Dominican Republic'] },
  { code: 'MERCOSUR', zh: '南方共同市場', en: 'Mercosur', aliases: ['南方共同市場', 'Mercosur', '南共市'] },
  { code: 'CARICOM', zh: '加勒比共同體', en: 'CARICOM', aliases: ['加勒比共同體', 'CARICOM'] },
  { code: 'CPTPP', zh: 'CPTPP 成員', en: 'CPTPP Members', aliases: ['CPTPP', '跨太平洋夥伴全面進步協定'] },
  { code: 'DE', zh: '德國', en: 'Germany', aliases: ['德國', 'Germany', '德'] },
  { code: 'FR', zh: '法國', en: 'France', aliases: ['法國', 'France', '法'] },
  { code: 'IT', zh: '義大利', en: 'Italy', aliases: ['義大利', 'Italy', '意大利'] },
  { code: 'ES', zh: '西班牙', en: 'Spain', aliases: ['西班牙', 'Spain'] },
  { code: 'NL', zh: '荷蘭', en: 'Netherlands', aliases: ['荷蘭', 'Netherlands'] },
  { code: 'BE', zh: '比利時', en: 'Belgium', aliases: ['比利時', 'Belgium'] },
  { code: 'PL', zh: '波蘭', en: 'Poland', aliases: ['波蘭', 'Poland'] },
  { code: 'SE', zh: '瑞典', en: 'Sweden', aliases: ['瑞典', 'Sweden'] },
  { code: 'AT', zh: '奧地利', en: 'Austria', aliases: ['奧地利', 'Austria'] },
  { code: 'DK', zh: '丹麥', en: 'Denmark', aliases: ['丹麥', 'Denmark'] },
  { code: 'FI', zh: '芬蘭', en: 'Finland', aliases: ['芬蘭', 'Finland'] },
  { code: 'IE', zh: '愛爾蘭', en: 'Ireland', aliases: ['愛爾蘭', 'Ireland'] },
  { code: 'PT', zh: '葡萄牙', en: 'Portugal', aliases: ['葡萄牙', 'Portugal'] },
  { code: 'GR', zh: '希臘', en: 'Greece', aliases: ['希臘', 'Greece'] },
];

const BY_CODE = new Map(COUNTRIES.map(c => [c.code, c]));

export function countryByCode(code: string): Country | undefined {
  return BY_CODE.get(code);
}

/** Display name (always Chinese where known). Falls back to provided name or code. */
export function countryDisplay(code: string, fallback?: string): string {
  return BY_CODE.get(code)?.zh ?? fallback ?? code;
}

/** Does the query match this country by code / zh / en / alias (case-insensitive substring)? */
export function countryMatchesQuery(code: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const c = BY_CODE.get(code);
  if (!c) return code.toLowerCase().includes(q);
  if (c.code.toLowerCase().includes(q)) return true;
  if (c.zh.includes(query)) return true;
  if (c.en.toLowerCase().includes(q)) return true;
  return c.aliases.some(a => a.toLowerCase().includes(q) || a.includes(query));
}
