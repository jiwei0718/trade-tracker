import { ARTICLE_STRUCTURES } from '@/data/article-structures';
import type { TradeAgreement } from '@/data/types';

/**
 * Derive granular issue/topic tags for an agreement by combining its base
 * `tags` with topics inferred from its article structure (e.g. an article
 * titled 電子簽章 → tag 'e-signature'). This lets users browse/filter by fine
 * issues such as "電子簽章" or "原始碼".
 */
const KEYWORD_TAGS: [RegExp, string][] = [
  [/電子簽章|電子認證|Electronic Authentication|Electronic Signature/i, 'e-signature'],
  [/原始碼|Source Code/i, 'source-code'],
  [/跨境傳輸|跨境.*資訊|Cross-Border Transfer/i, 'cross-border-data'],
  [/個人資料|個人資訊|Personal (Data|Information)/i, 'data-privacy'],
  [/線上消費者|消費者保護|Consumer Protection/i, 'consumer-protection'],
  [/網路安全|網絡安全|Cybersecurity|Cyber Security/i, 'cybersecurity'],
  [/電子發票|Electronic Invoicing/i, 'e-invoicing'],
  [/無紙化|Paperless/i, 'paperless'],
  [/電子支付|Electronic Payments?/i, 'e-payment'],
  [/人工智慧|Artificial Intelligence/i, 'ai'],
  [/數位身分|Digital Identit/i, 'digital-id'],
  [/金融科技|FinTech/i, 'fintech'],
  [/加密|密碼學|Cryptography|Encryption/i, 'cryptography'],
  [/開放政府資料|Open Government Data/i, 'open-data'],
  [/關稅|電子傳輸關稅|Customs Duties/i, 'customs-moratorium'],
  [/演算法|Algorithm/i, 'algorithm'],
  [/未經請求|Unsolicited/i, 'spam'],
  [/網際網路服務提供者|Internet Service Provider/i, 'isp'],
  [/電子契約|締結契約|Electronic Contract|Conclusion of Contract/i, 'e-contract'],
  [/數位產品|Digital Products/i, 'digital-products'],
  [/算力設施|運算設施|Location of Computing/i, 'data-localisation'],
  [/網際網路接取|Access to and Use of the Internet/i, 'internet-access'],
  [/電子交易框架|Electronic Transactions Framework/i, 'e-transactions'],
  [/中小企業|MSME|SME/i, 'msme'],
  [/物流|Logistics/i, 'logistics'],
  [/單一窗口|Single Window/i, 'single-window'],
  [/標準與符合性|Standards and Conformity/i, 'standards'],
];

const cache = new Map<string, string[]>();

export function getAgreementTags(a: TradeAgreement): string[] {
  if (cache.has(a.id)) return cache.get(a.id)!;
  const set = new Set<string>(a.tags ?? []);
  const struct = a.articleStructure ?? ARTICLE_STRUCTURES[a.id];
  if (struct) {
    for (const g of struct) {
      for (const art of g.articles) {
        const text = `${art.zh} ${art.en}`;
        for (const [re, tag] of KEYWORD_TAGS) {
          if (re.test(text)) set.add(tag);
        }
      }
    }
  }
  const result = Array.from(set);
  cache.set(a.id, result);
  return result;
}
