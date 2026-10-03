/**
 * Source Tier 來源信任分級表(Phase 1 地基)
 *
 * 用途:
 *   1. backend reconcile 時,依來源網域決定 baseConfidence 與 tier
 *   2. app 端依 tier 顯示對應 chip 顏色 / 圖示 / 中文標籤
 *
 * 後續 Phase 3 自動化會依 tier 決定:
 *   - 是否單一來源即可採信(Tier S 可,Tier C 不可)
 *   - 隔離期長短(Tier C 需更久)
 *   - 衝突仲裁時誰勝出
 *
 * 此表為 single source of truth;Python 端在 backend/source_tiers.py 同步維護。
 */

import type { SourceTier } from './types';

export interface SourceTierEntry {
  tier: SourceTier;
  baseConfidence: number;   // 0.0–1.0
  label: string;             // 顯示用名稱(中英文)
  labelZh?: string;
  domain: string;            // 主網域,用於 URL 比對
}

export const SOURCE_TIERS: readonly SourceTierEntry[] = [
  // ─── Tier S:官方文件(政府機構、國際組織)──────────────
  { tier: 'S', baseConfidence: 0.95, domain: 'wto.org',                       label: 'WTO',                                   labelZh: '世界貿易組織' },
  { tier: 'S', baseConfidence: 0.95, domain: 'docs.wto.org',                  label: 'WTO Documents Online' },
  { tier: 'S', baseConfidence: 0.95, domain: 'rtais.wto.org',                 label: 'WTO RTA-IS' },
  { tier: 'S', baseConfidence: 0.95, domain: 'commission.europa.eu',          label: 'European Commission',                   labelZh: '歐盟執委會' },
  { tier: 'S', baseConfidence: 0.95, domain: 'policy.trade.ec.europa.eu',     label: 'EU DG Trade' },
  { tier: 'S', baseConfidence: 0.95, domain: 'consilium.europa.eu',           label: 'European Council' },
  { tier: 'S', baseConfidence: 0.95, domain: 'european-union.europa.eu',      label: 'EU Official' },
  { tier: 'S', baseConfidence: 0.95, domain: 'ustr.gov',                      label: 'USTR',                                  labelZh: '美國貿易代表署' },
  { tier: 'S', baseConfidence: 0.95, domain: 'commerce.gov',                  label: 'US Department of Commerce' },
  { tier: 'S', baseConfidence: 0.95, domain: 'history.state.gov',             label: 'US Office of the Historian' },
  { tier: 'S', baseConfidence: 0.95, domain: 'trade.gov.tw',                  label: '經濟部國際貿易署' },
  { tier: 'S', baseConfidence: 0.95, domain: 'mofa.gov.tw',                   label: '中華民國外交部' },
  { tier: 'S', baseConfidence: 0.95, domain: 'moea.gov.tw',                   label: '經濟部' },
  { tier: 'S', baseConfidence: 0.95, domain: 'mfat.govt.nz',                  label: 'NZ MFAT',                               labelZh: '紐西蘭外交貿易部' },
  { tier: 'S', baseConfidence: 0.95, domain: 'dfat.gov.au',                   label: 'Australia DFAT',                        labelZh: '澳洲外交貿易部' },
  { tier: 'S', baseConfidence: 0.95, domain: 'mti.gov.sg',                    label: 'Singapore MTI',                         labelZh: '新加坡貿工部' },
  { tier: 'S', baseConfidence: 0.95, domain: 'gov.uk',                        label: 'UK Government',                         labelZh: '英國政府' },
  { tier: 'S', baseConfidence: 0.95, domain: 'commerce.gov.in',               label: 'India Ministry of Commerce',            labelZh: '印度商工部' },
  { tier: 'S', baseConfidence: 0.95, domain: 'fta.mofcom.gov.cn',             label: '中國自由貿易區服務網' },
  { tier: 'S', baseConfidence: 0.95, domain: 'fta.go.kr',                     label: 'Korea FTA',                             labelZh: '韓國 FTA 入口網' },
  { tier: 'S', baseConfidence: 0.95, domain: 'asean.org',                     label: 'ASEAN Secretariat',                     labelZh: '東協秘書處' },
  { tier: 'S', baseConfidence: 0.95, domain: 'apec.org',                      label: 'APEC',                                  labelZh: '亞太經濟合作會議' },
  { tier: 'S', baseConfidence: 0.95, domain: 'efta.int',                      label: 'EFTA',                                  labelZh: '歐洲自由貿易協會' },
  { tier: 'S', baseConfidence: 0.95, domain: 'aladi.org',                     label: 'ALADI',                                 labelZh: '拉丁美洲整合協會' },
  { tier: 'S', baseConfidence: 0.95, domain: 'mercosur.int',                  label: 'Mercosur Secretariat' },
  { tier: 'S', baseConfidence: 0.95, domain: 'au-afcfta.org',                 label: 'AfCFTA Secretariat' },
  { tier: 'S', baseConfidence: 0.95, domain: 'caricom.org',                   label: 'CARICOM Secretariat' },
  { tier: 'S', baseConfidence: 0.95, domain: 'comunidadandina.org',           label: 'Comunidad Andina' },
  { tier: 'S', baseConfidence: 0.95, domain: 'gcc-sg.org',                    label: 'GCC Secretariat' },
  { tier: 'S', baseConfidence: 0.95, domain: 'koryu.or.jp',                   label: '日本台灣交流協會' },
  { tier: 'S', baseConfidence: 0.95, domain: 'eda.admin.ch',                  label: 'Swiss FDFA' },
  { tier: 'S', baseConfidence: 0.95, domain: 'international-partnerships.ec.europa.eu', label: 'EU International Partnerships' },

  // ─── Tier A:學術 / 國際研究機構 ──────────────
  { tier: 'A', baseConfidence: 0.85, domain: 'oecd.org',                      label: 'OECD',                                  labelZh: '經濟合作暨發展組織' },
  { tier: 'A', baseConfidence: 0.85, domain: 'designoftradeagreements.org',   label: 'DESTA' },
  { tier: 'A', baseConfidence: 0.85, domain: 'worldbank.org',                 label: 'World Bank',                            labelZh: '世界銀行' },
  { tier: 'A', baseConfidence: 0.85, domain: 'imf.org',                       label: 'IMF',                                   labelZh: '國際貨幣基金' },
  { tier: 'A', baseConfidence: 0.85, domain: 'wbg.org',                       label: 'WBG' },
  { tier: 'A', baseConfidence: 0.85, domain: 'iif.com',                       label: 'IIF' },
  { tier: 'A', baseConfidence: 0.85, domain: 'piie.com',                      label: 'Peterson Institute (PIIE)' },
  { tier: 'A', baseConfidence: 0.85, domain: 'cfr.org',                       label: 'Council on Foreign Relations (CFR)' },
  { tier: 'A', baseConfidence: 0.85, domain: 'brookings.edu',                 label: 'Brookings Institution' },
  { tier: 'A', baseConfidence: 0.85, domain: 'iif.org',                       label: 'IIF' },
  { tier: 'A', baseConfidence: 0.85, domain: 'cepii.fr',                      label: 'CEPII' },
  { tier: 'A', baseConfidence: 0.85, domain: 'csis.org',                      label: 'CSIS' },
  { tier: 'A', baseConfidence: 0.85, domain: 'unctad.org',                    label: 'UNCTAD' },

  // ─── Tier B:一線財經與國際媒體 ──────────────
  { tier: 'B', baseConfidence: 0.70, domain: 'reuters.com',                   label: 'Reuters',                               labelZh: '路透社' },
  { tier: 'B', baseConfidence: 0.70, domain: 'ft.com',                        label: 'Financial Times',                       labelZh: '金融時報' },
  { tier: 'B', baseConfidence: 0.70, domain: 'bloomberg.com',                 label: 'Bloomberg',                             labelZh: '彭博' },
  { tier: 'B', baseConfidence: 0.70, domain: 'wsj.com',                       label: 'Wall Street Journal',                   labelZh: '華爾街日報' },
  { tier: 'B', baseConfidence: 0.70, domain: 'nikkei.com',                    label: 'Nikkei',                                labelZh: '日經' },
  { tier: 'B', baseConfidence: 0.70, domain: 'asia.nikkei.com',               label: 'Nikkei Asia' },
  { tier: 'B', baseConfidence: 0.70, domain: 'cna.com.tw',                    label: '中央通訊社' },
  { tier: 'B', baseConfidence: 0.70, domain: 'economist.com',                 label: 'The Economist',                         labelZh: '經濟學人' },
  { tier: 'B', baseConfidence: 0.70, domain: 'scmp.com',                      label: 'South China Morning Post',              labelZh: '南華早報' },
  { tier: 'B', baseConfidence: 0.70, domain: 'kyodo.co.jp',                   label: 'Kyodo News' },
  { tier: 'B', baseConfidence: 0.70, domain: 'japantimes.co.jp',              label: 'Japan Times' },
  { tier: 'B', baseConfidence: 0.70, domain: 'koreaherald.com',               label: 'Korea Herald' },
  { tier: 'B', baseConfidence: 0.70, domain: 'thehindu.com',                  label: 'The Hindu' },
  { tier: 'B', baseConfidence: 0.70, domain: 'theaustralian.com.au',          label: 'The Australian' },
  { tier: 'B', baseConfidence: 0.70, domain: 'theguardian.com',               label: 'The Guardian',                          labelZh: '衛報' },
  { tier: 'B', baseConfidence: 0.70, domain: 'bbc.com',                       label: 'BBC' },
  { tier: 'B', baseConfidence: 0.70, domain: 'bbc.co.uk',                     label: 'BBC' },
  { tier: 'B', baseConfidence: 0.70, domain: 'politico.eu',                   label: 'Politico Europe' },
  { tier: 'B', baseConfidence: 0.70, domain: 'politico.com',                  label: 'Politico' },
  { tier: 'B', baseConfidence: 0.70, domain: 'nytimes.com',                   label: 'New York Times',                        labelZh: '紐約時報' },
];

/** 預設值(網域不在表中時)*/
export const DEFAULT_TIER_ENTRY: SourceTierEntry = {
  tier: 'C',
  baseConfidence: 0.40,
  label: 'Unknown source',
  labelZh: '未知來源',
  domain: '',
};

/** 完全未知/未指定 */
export const UNKNOWN_TIER_ENTRY: SourceTierEntry = {
  tier: 'U',
  baseConfidence: 0.30,
  label: 'Unspecified',
  labelZh: '未指定',
  domain: '',
};

/**
 * 依 URL 解析來源 tier。
 *   - 比對主網域(去除 www. 前綴、忽略子網域以下層)
 *   - 找不到時退到 Tier C 預設
 */
export function tierForUrl(url: string | undefined): SourceTierEntry {
  if (!url) return UNKNOWN_TIER_ENTRY;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return DEFAULT_TIER_ENTRY;
  }
  // 由長到短匹配,先嘗試完整匹配,再嘗試父域名
  const candidates = host.split('.').reduce<string[]>((acc, _, i, arr) => {
    acc.push(arr.slice(i).join('.'));
    return acc;
  }, []);
  for (const candidate of candidates) {
    const hit = SOURCE_TIERS.find(e => e.domain === candidate);
    if (hit) return hit;
  }
  return DEFAULT_TIER_ENTRY;
}

/** Tier 對應的顏色(UI 用)*/
export const TIER_COLORS: Record<SourceTier, string> = {
  S: '#16a34a', // 綠 — 官方
  A: '#2563eb', // 藍 — 學術
  B: '#7c3aed', // 紫 — 一線媒體
  C: '#d97706', // 橘 — 一般來源
  U: '#9ca3af', // 灰 — 未指定
};

/** Tier 對應的中文短標籤(UI 用)*/
export const TIER_LABELS_ZH: Record<SourceTier, string> = {
  S: '官方',
  A: '學術',
  B: '媒體',
  C: '一般',
  U: '未指定',
};

/** Tier 對應圖示(@expo/vector-icons / Ionicons)*/
export const TIER_ICONS: Record<SourceTier, string> = {
  S: 'shield-checkmark',
  A: 'school',
  B: 'newspaper',
  C: 'help-circle',
  U: 'help-circle-outline',
};
