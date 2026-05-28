export type AgreementStatus =
  | 'in_force'
  | 'signed'
  | 'concluded'
  | 'negotiating'
  | 'suspended'
  | 'cancelled'
  | 'proposed';

export type AgreementType =
  | 'bilateral'
  | 'multilateral'
  | 'regional'
  | 'sectoral';

export interface KeyDates {
  proposed?: string;    // YYYY-MM
  started?: string;     // negotiations started
  concluded?: string;   // negotiations concluded
  signed?: string;
  in_force?: string;
  suspended?: string;
  cancelled?: string;
}

export interface TradeAgreement {
  id: string;
  name: string;
  nameZh: string;
  shortName?: string;
  type: AgreementType;
  status: AgreementStatus;
  parties: string[];        // country/region codes
  partyNames: string[];     // display names (EN)
  partyNamesZh: string[];   // display names (ZH)
  keyDates: KeyDates;
  tradeVolume?: number;     // billions USD (2024)
  description: string;
  descriptionZh: string;
  keyProvisions?: string[];
  tags?: string[];
}

export interface FilterState {
  status: AgreementStatus[];
  type: AgreementType[];
  country: string;
  search: string;
  dateFrom: string;   // YYYY-MM
  dateTo: string;     // YYYY-MM
}

export type ViewMode = 'arc' | 'list' | 'stats' | 'map';

export const STATUS_LABELS: Record<AgreementStatus, string> = {
  in_force:    '已生效',
  signed:      '已簽署',
  concluded:   '談判完成',
  negotiating: '談判中',
  suspended:   '已暫停',
  cancelled:   '已取消',
  proposed:    '提議中',
};

export const STATUS_COLORS: Record<AgreementStatus, string> = {
  in_force:    '#16a34a',
  signed:      '#2563eb',
  concluded:   '#7c3aed',
  negotiating: '#d97706',
  suspended:   '#9ca3af',
  cancelled:   '#ef4444',
  proposed:    '#6b7280',
};

export const TYPE_LABELS: Record<AgreementType, string> = {
  bilateral:    '雙邊協定',
  multilateral: '多邊協定',
  regional:     '區域協定',
  sectoral:     '特定領域協定',
};
