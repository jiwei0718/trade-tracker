/**
 * 3D 地球儀的位置資料。
 *
 * 國家:src/data/geo-points.json(由 scripts/build-geo-points.mjs 從 Natural Earth 計算)。
 * 集團:有總部的用總部所在城市;總部和其他集團重疊或沒有固定總部的,用成員國標示點的中心。
 * 已不存在的國家:用今日對應國家的位置(東德用柏林)。
 * 全球性的締約方(WTO 全體會員、開發中國家全球體系等)沒有單一位置,不畫在地球上。
 */
import geoPoints from './geo-points.json';
import { orgByCode } from './organizations';

export type LatLng = [lat: number, lng: number];

interface GroupAnchor {
  alias?: string;       // drawn as this node (agreements of a predecessor or of the same secretariat)
  zh?: string;          // names for a group outside the organizations registry
  en?: string;
  zhByTool?: true;      // the Chinese name is this tool's translation (same as the RTA name table)
  at?: LatLng;          // fixed point
  near?: string;        // same point as this country
  centroid?: true;      // middle of the members' points
  members?: string[];   // when the organizations registry has no member list
  membersFrom?: string; // reuse another group's members
  place: string;        // shown in the side panel: why the group sits where it does
}

const CENTRAL_AMERICA = ['CR', 'SV', 'GT', 'HN', 'NI', 'PA'];

const GROUPS: Record<string, GroupAnchor> = {
  EU: { at: [50.85, 4.35], place: '總部:比利時布魯塞爾' },
  EFTA: { at: [46.2, 6.14], place: '總部:瑞士日內瓦' },
  ASEAN: { at: [-6.2, 106.85], place: '總部:印尼雅加達' },
  MERCOSUR: { at: [-34.9, -56.16], place: '總部:烏拉圭蒙特維多' },
  GCC: { at: [24.71, 46.68], place: '總部:沙烏地阿拉伯利雅德' },
  EAEU: { at: [55.75, 37.62], place: '總部:俄羅斯莫斯科' },
  SACU: { at: [-22.56, 17.08], place: '總部:納米比亞溫荷克' },
  SADC: { at: [-24.65, 25.91], place: '總部:波札那嘉柏隆里' },
  COMESA: { at: [-15.39, 28.32], place: '總部:尚比亞路沙卡' },
  EAC: { at: [-3.37, 36.68], place: '總部:坦尚尼亞阿魯沙' },
  ECOWAS: { at: [9.06, 7.49], place: '總部:奈及利亞阿布加' },
  CEMAC: { at: [4.36, 18.56], place: '總部:中非共和國班基' },
  WAEMU: { at: [12.37, -1.52], place: '總部:布吉納法索瓦加杜古' },
  'AU-CONT': { at: [9.03, 38.74], place: '總部:衣索比亞阿迪斯阿貝巴' },
  AFCFTA: { at: [5.6, -0.19], membersFrom: 'AU-CONT', place: '秘書處:迦納阿克拉' },
  CAN: { at: [-12.05, -77.04], place: '總部:秘魯利馬' },
  CACM: { at: [14.63, -90.51], place: '總部:瓜地馬拉瓜地馬拉市' },
  CARICOM: { at: [6.8, -58.16], place: '總部:蓋亞那喬治城' },
  APTA: { at: [13.75, 100.5], place: '秘書處:泰國曼谷' },
  SAARC: { at: [27.7, 85.32], place: '總部:尼泊爾加德滿都' },
  // Agreements of one secretariat, or of a predecessor, share one node instead of stacking labels.
  SAFTA: { alias: 'SAARC', membersFrom: 'SAARC', place: '南亞區域合作聯盟總部:尼泊爾加德滿都' },
  SAPTA: { alias: 'SAARC', membersFrom: 'SAARC', place: '南亞區域合作聯盟總部:尼泊爾加德滿都' },
  LAFTA: { alias: 'LAIA', place: '拉丁美洲整合協會的前身' },
  UDE: { alias: 'CEMAC', place: '中非經濟暨貨幣共同體的前身' },
  CARIFTA: { alias: 'CARICOM', membersFrom: 'CARICOM', place: '加勒比共同體的前身' },
  'Arusha Agreement': { alias: 'EAC', place: '簽署地:坦尚尼亞阿魯沙' },
  PICTA: { alias: 'PIF', place: '太平洋島國論壇秘書處:斐濟蘇瓦' },
  'PACER Plus': { alias: 'PIF', place: '太平洋島國論壇秘書處:斐濟蘇瓦' },
  PAFTA: { alias: 'LAS', place: '阿拉伯國家聯盟總部:埃及開羅' },
  'Arab Common Market': { alias: 'LAS', place: '阿拉伯國家聯盟總部:埃及開羅' },
  PIF: {
    zh: '太平洋島國論壇', en: 'Pacific Islands Forum', at: [-18.14, 178.44], place: '秘書處:斐濟蘇瓦',
    members: ['AU', 'NZ', 'FJ', 'PG', 'WS', 'TO', 'VU', 'SB', 'KI', 'TV', 'NR', 'PW', 'MH', 'FM', 'CK', 'NU', 'PF', 'NC'],
  },
  LAS: {
    zh: '阿拉伯國家聯盟', en: 'League of Arab States', at: [30.04, 31.24], place: '總部:埃及開羅',
    members: ['DZ', 'BH', 'KM', 'DJ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MR', 'MA', 'OM', 'PS', 'QA', 'SA', 'SO', 'SD', 'SY', 'TN', 'AE', 'YE'],
  },
  CIS: { zh: '獨立國家國協', en: 'Commonwealth of Independent States', zhByTool: true, at: [53.9, 27.57], place: '執行委員會:白俄羅斯明斯克' },
  ECO: { zh: '經濟合作組織', en: 'Economic Cooperation Organization', zhByTool: true, at: [35.69, 51.39], place: '秘書處:伊朗德黑蘭' },
  BIMSTEC: {
    zh: '孟加拉灣多領域技術及經濟合作倡議', en: 'Bay of Bengal Initiative for Multi-Sectoral Technical and Economic Cooperation',
    zhByTool: true, at: [23.81, 90.41], place: '秘書處:孟加拉達卡' },
  MSG: { zh: '美拉尼西亞先鋒集團', en: 'Melanesian Spearhead Group', zhByTool: true, at: [-17.73, 168.32], place: '秘書處:萬那杜維拉港' },
  'Borneo Free Trade Area': { zh: '婆羅洲自由貿易區', en: 'Borneo Free Trade Area', zhByTool: true, near: 'BN', place: '婆羅洲' },

  // Headquarters shared with another group (or none): the middle of the members instead.
  CARIFORUM: { centroid: true, place: '成員國中心點' },
  CEFTA: { centroid: true, place: '成員國中心點' },
  LAIA: { centroid: true, place: '成員國中心點' },
  'PACIFIC-ALLIANCE': { centroid: true, place: '成員國中心點' },
  OACPS: { centroid: true, place: '成員國中心點' },
  CPTPP: { centroid: true, members: ['AU', 'BN', 'CA', 'CL', 'JP', 'MY', 'MX', 'NZ', 'PE', 'SG', 'VN', 'UK'], place: '成員國中心點' },
  'CENTRAL-AMERICA': { en: 'Central America', centroid: true, members: CENTRAL_AMERICA, place: '成員國中心點' },
  'NORTHERN-TRIANGLE': { en: 'Northern Triangle', centroid: true, members: ['SV', 'GT', 'HN'], place: '成員國中心點' },
  'PACIFIC-STATES': { en: 'Pacific States', centroid: true, members: ['PG', 'FJ', 'WS', 'SB'], place: '成員國中心點' },
  ESA: { en: 'Eastern and Southern Africa States', centroid: true, members: ['MG', 'MU', 'SC', 'ZW', 'KM'], place: '成員國中心點' },
  'WEST-AFRICA': {
    en: 'West Africa', centroid: true, place: '成員國中心點',
    members: ['BJ', 'BF', 'CV', 'CI', 'GM', 'GH', 'GN', 'GW', 'LR', 'ML', 'MR', 'NE', 'NG', 'SN', 'SL', 'TG'],
  },
  CEZ: { zh: '共同經濟區', en: 'Common Economic Zone', zhByTool: true, centroid: true, members: ['RU', 'BY', 'KZ', 'UA'], place: '成員國中心點' },
  EAEC: { zh: '歐亞經濟共同體', en: 'Eurasian Economic Community', zhByTool: true, centroid: true, members: ['BY', 'KZ', 'KG', 'RU', 'TJ'], place: '成員國中心點' },
  AASM: {
    zh: '非洲及馬達加斯加聯繫國', en: 'Associated African and Malagasy States', zhByTool: true, centroid: true, place: '成員國中心點',
    members: ['BI', 'CM', 'CF', 'TD', 'CG', 'CD', 'BJ', 'GA', 'BF', 'CI', 'MG', 'ML', 'MR', 'NE', 'RW', 'SN', 'SO', 'TG'],
  },
  'African Common Market': { zh: '非洲共同市場', en: 'African Common Market', zhByTool: true, centroid: true, members: ['EG', 'GH', 'GN', 'ML', 'MA'], place: '成員國中心點' },

  // States that no longer exist: today's corresponding country.
  CS: { near: 'RS', place: '塞爾維亞與蒙特內哥羅,以今日塞爾維亞的位置表示' },
  YU: { near: 'RS', place: '南斯拉夫,以今日塞爾維亞的位置表示' },
  CSK: { near: 'CZ', place: '捷克斯洛伐克,以今日捷克的位置表示' },
  DDR: { at: [52.52, 13.4], place: '東德,以柏林的位置表示' },
};

/** Parties with no single place: global memberships and scattered territories. */
const NOT_ON_GLOBE: Record<string, string> = {
  MULTI: '全球多邊協定',
  WORLD: '全球多邊協定',
  WTO: '全球多邊協定',
  'WTO-JSI': '全球多邊協定',
  GSTP: '開發中國家的全球性協定',
  PTN: '開發中國家的全球性協定',
  OCT: '海外國家與領地分散各地',
};

const COUNTRY_POINTS = geoPoints.points as unknown as Record<string, LatLng>;
const FEATURE_CODES = geoPoints.n3 as Record<string, string>;
const NAME_CODES = geoPoints.nameToCode as Record<string, string>;

/** Organization alias codes (ACP → OACPS) resolve to the registry's main code. */
function canonical(code: string): string {
  return orgByCode(code)?.code ?? code;
}

/** The node a party is drawn as: itself, or the group it is filed under (SAFTA → SAARC). */
export function nodeCode(code: string): string {
  const c = canonical(code);
  const alias = GROUPS[c]?.alias;
  return alias ? nodeCode(alias) : c;
}

/** Names of a group that is not in the organizations registry (Pacific Islands Forum...). */
export function groupNames(code: string): { zh?: string; en?: string; zhByTool?: boolean } {
  const g = GROUPS[canonical(code)];
  return { zh: g?.zh, en: g?.en, zhByTool: g?.zhByTool };
}

export function groupMembers(code: string): string[] {
  const c = canonical(code);
  const g = GROUPS[c];
  if (g?.members) return g.members;
  return orgByCode(g?.membersFrom ?? c)?.members ?? [];
}

/** A bloc whose members can be shown (not a country, not a former state). */
export function isGroup(code: string): boolean {
  const c = canonical(code);
  return !COUNTRY_POINTS[c] && groupMembers(c).length > 0;
}

function centroid(codes: string[]): LatLng | null {
  let x = 0, y = 0, z = 0, n = 0;
  for (const code of codes) {
    const p = COUNTRY_POINTS[code];
    if (!p) continue;
    const lat = (p[0] * Math.PI) / 180, lng = (p[1] * Math.PI) / 180;
    x += Math.cos(lat) * Math.cos(lng); y += Math.cos(lat) * Math.sin(lng); z += Math.sin(lat);
    n++;
  }
  if (!n) return null;
  const lng = Math.atan2(y, x), lat = Math.atan2(z, Math.hypot(x, y));
  return [Math.round((lat * 18000) / Math.PI) / 100, Math.round((lng * 18000) / Math.PI) / 100];
}

const cache = new Map<string, LatLng | null>();

export function pointOf(code: string): LatLng | null {
  if (cache.has(code)) return cache.get(code)!;
  const c = canonical(code);
  let p: LatLng | null = null;
  if (GROUPS[c]?.alias) p = pointOf(GROUPS[c].alias!);
  else if (NOT_ON_GLOBE[c]) p = null;
  else if (COUNTRY_POINTS[c]) p = COUNTRY_POINTS[c];
  else if (GROUPS[c]?.at) p = GROUPS[c].at!;
  else if (GROUPS[c]?.near) p = COUNTRY_POINTS[GROUPS[c].near!] ?? null;
  else p = centroid(groupMembers(c));   // listed centroid groups, and any other registry organization
  cache.set(code, p);
  return p;
}

/** Why a party is drawn where it is (groups and former states only). */
export function placeNote(code: string): string | undefined {
  return GROUPS[canonical(code)]?.place;
}

/** Why a party is not on the globe, if it is not. */
export function notOnGlobeReason(code: string): string | undefined {
  return NOT_ON_GLOBE[canonical(code)];
}

/** Tool country code for a world-atlas feature (numeric ISO id, or name when it has none). */
export function codeForFeature(id: string | number | undefined, name: string | undefined): string | undefined {
  if (id != null && FEATURE_CODES[String(id)]) return FEATURE_CODES[String(id)];
  return name ? NAME_CODES[name] : undefined;
}

export const GEO_SOURCE = geoPoints.source;
