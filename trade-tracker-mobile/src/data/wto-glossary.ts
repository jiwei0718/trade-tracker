/**
 * 經濟部國際貿易署《WTO小辭典》(政府資料開放平臺,依政府資料開放授權條款第1版使用)。
 * wto-glossary.json 由 backend/build_wto_glossary.py 從官方 CSV 產生,請勿手動修改。
 */
import data from './wto-glossary.json';
import type { TermSource } from './terms';

export interface WtoGlossaryEntry {
  id: string;          // wto-<英文名稱>
  en: string;
  zh: string;
  definition: string;  // 官方名詞解釋全文
}

export const WTO_GLOSSARY = data as WtoGlossaryEntry[];

export const WTO_GLOSSARY_SOURCE: TermSource = {
  apa: '經濟部國際貿易署(2025)。WTO小辭典〔資料集〕。政府資料開放平臺。依政府資料開放授權條款第1版使用。https://data.gov.tw/dataset/22660',
  url: 'https://data.gov.tw/dataset/22660',
  tier: 'official',
};

const BY_ID = new Map(WTO_GLOSSARY.map(e => [e.id, e]));
const BY_EN = new Map(WTO_GLOSSARY.map(e => [e.en.toLowerCase(), e]));

export const wtoEntryById = (id: string) => BY_ID.get(id);
export const wtoEntryByEn = (en: string) => BY_EN.get(en.toLowerCase());
