export type AgreementStatus =
  | 'in_force'
  | 'signed'
  | 'concluded'
  | 'negotiating'
  | 'suspended'
  | 'cancelled'
  | 'proposed'
  | 'superseded'   // 已被新協定取代（歷史用）
  | 'expired';     // 已失效（歷史用）

export type AgreementType =
  | 'bilateral'
  | 'multilateral'
  | 'regional'
  | 'sectoral'
  | 'plurilateral';

export type EraKey =
  | 'pre_gatt'        // 19世紀-1947
  | 'gatt_era'        // 1947-1994
  | 'wto_birth'       // 1994-2000
  | 'fta_boom'        // 2000-2015
  | 'fragmentation'   // 2015-2024
  | 'post_liberation';// 2025+

export interface KeyDates {
  proposed?: string;
  started?: string;
  concluded?: string;
  signed?: string;
  in_force?: string;
  suspended?: string;
  cancelled?: string;
  expired?: string;
  superseded?: string;
}

export interface TradeAgreement {
  id: string;
  name: string;
  nameZh: string;
  shortName?: string;
  type: AgreementType;
  status: AgreementStatus;
  era: EraKey;
  parties: string[];        // ISO-ish codes
  partyNames: string[];
  partyNamesZh: string[];
  keyDates: KeyDates;
  tradeVolume?: number;     // billions USD (last available year)
  description: string;
  descriptionZh: string;
  keyProvisions?: string[];
  tags?: string[];
  supersededBy?: string;    // id of replacement agreement
  significance?: string;    // brief Chinese-language "why it matters"
}

export const STATUS_LABELS: Record<AgreementStatus, string> = {
  in_force:    '已生效',
  signed:      '已簽署',
  concluded:   '談判完成',
  negotiating: '談判中',
  suspended:   '已暫停',
  cancelled:   '已取消',
  proposed:    '提議中',
  superseded:  '已被取代',
  expired:     '已失效',
};

export const STATUS_COLORS: Record<AgreementStatus, string> = {
  in_force:    '#16a34a',
  signed:      '#2563eb',
  concluded:   '#7c3aed',
  negotiating: '#d97706',
  suspended:   '#9ca3af',
  cancelled:   '#ef4444',
  proposed:    '#6b7280',
  superseded:  '#64748b',
  expired:     '#a8a29e',
};

export const TYPE_LABELS: Record<AgreementType, string> = {
  bilateral:     '雙邊',
  multilateral:  '多邊',
  regional:      '區域',
  sectoral:      '特定領域',
  plurilateral:  '複邊',
};

export const ERA_INFO: Record<EraKey, { label: string; range: string; tagline: string; summaryZh: string }> = {
  pre_gatt: {
    label: '前GATT時代',
    range: '1860–1947',
    tagline: '雙邊互惠與帝國優惠制',
    summaryZh: '從Cobden-Chevalier條約建立的最惠國原則開始，到大蕭條時期保護主義興起、二戰前夕的《互惠貿易協定法》。',
  },
  gatt_era: {
    label: 'GATT時代',
    range: '1947–1994',
    tagline: '多邊貿易自由化的黃金時期',
    summaryZh: '《關稅暨貿易總協定》主導的8輪多邊談判（甘迺迪、東京、烏拉圭等），同時區域整合萌芽（EEC、EFTA、NAFTA）。',
  },
  wto_birth: {
    label: 'WTO誕生',
    range: '1994–2000',
    tagline: '從關稅到規則的轉變',
    summaryZh: '烏拉圭回合催生WTO，將服務貿易（GATS）、智財權（TRIPS）納入體系，建立爭端解決機制。',
  },
  fta_boom: {
    label: 'FTA爆發期',
    range: '2000–2015',
    tagline: '杜哈停滯，雙邊崛起',
    summaryZh: '杜哈回合陷入僵局後，各國轉向雙邊與區域FTA。中國加入WTO，美國與韓國、新加坡、智利等簽FTA，EU積極對外簽訂協定。',
  },
  fragmentation: {
    label: '碎片化',
    range: '2015–2024',
    tagline: '巨型FTA與分裂並存',
    summaryZh: 'TPP、RCEP、CPTPP等大型協定相繼登場，Brexit重塑歐洲秩序，美中貿易戰、半導體與供應鏈政治化。',
  },
  post_liberation: {
    label: '解放日後',
    range: '2025–',
    tagline: '繞過美國重建貿易網路',
    summaryZh: '川普2025年4月「解放日」全面關稅後，其他國家加速簽訂彼此間的協定。歐盟與南共市、印度、印尼、澳洲，英國與印度，EFTA與南美等15+項協定一年內完成。',
  },
};
