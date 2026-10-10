/**
 * Find linkable words in Chinese text: glossary terms, international organisations and
 * agreement abbreviations. Used by <TermText>.
 */
import { TERMS } from '@/data/terms';
import { ORGANIZATIONS } from '@/data/organizations';
import { agreements as bundledAgreements } from '@/data/agreements';

export type LinkKind = 'term' | 'org' | 'agreement';

export interface LinkTarget {
  kind: LinkKind;
  id: string;
  /** Shown in half-width parentheses the first time the word appears on a page. */
  original: string | null;
}

export type Segment =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; target: LinkTarget };

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const latin = (s: string) => /^[A-Za-z0-9 .&/-]+$/.test(s);

function build() {
  const entries: { text: string; target: LinkTarget }[] = [];
  for (const t of TERMS) {
    if (t.linkInText === false) continue;
    const original = t.abbr ? `${t.original}, ${t.abbr}` : t.original;
    entries.push({ text: t.zh, target: { kind: 'term', id: t.id, original } });
    for (const a of t.aliases ?? []) {
      entries.push(typeof a === 'string'
        ? { text: a, target: { kind: 'term', id: t.id, original } }
        : { text: a.zh, target: { kind: 'term', id: t.id, original: a.original } });
    }
    // A term's own abbreviation (WTO, GATT, MFN…) also links to it.
    if (t.abbr && t.abbr.length >= 3) entries.push({ text: t.abbr, target: { kind: 'term', id: t.id, original } });
  }
  const termAbbrs = new Set(TERMS.map(t => t.abbr).filter(Boolean));
  for (const o of ORGANIZATIONS) {
    if (termAbbrs.has(o.abbr)) continue;   // e.g. WTO: the glossary term explains it
    const original = o.abbr && o.abbr !== o.name ? `${o.name}, ${o.abbr}` : o.name;
    for (const text of [o.nameZh, o.abbrZh]) {
      if (text && text.length >= 2 && !/[（(]/.test(text)) entries.push({ text, target: { kind: 'org', id: o.code, original } });
    }
  }
  // Agreement abbreviations that are distinctive on their own (CPTPP, RCEP, USMCA…).
  for (const a of bundledAgreements) {
    const s = a.shortName;
    if (s && latin(s) && /^[A-Z][A-Z0-9-]{3,}$/.test(s)) entries.push({ text: s, target: { kind: 'agreement', id: a.id, original: null } });
  }
  // Full Chinese agreement names link to the agreement (with its original name), so a glossary
  // word inside a name — 「經濟合作協定」 in 「臺巴拉圭經濟合作協定」 — is not linked on its own.
  // Names that are just a glossary term or an organisation (世界貿易組織 (WTO)) keep those links.
  const taken = new Set(entries.map(e => e.text));
  for (const a of bundledAgreements) {
    const base = a.nameZh.replace(/\s*[(（][^()（）]*[)）]/g, '').trim();
    if (a.parentId || base.length < 5 || !/[一-鿿]/.test(base) || taken.has(base)) continue;
    const target: LinkTarget = { kind: 'agreement', id: a.id, original: a.name !== a.nameZh ? a.name : null };
    entries.push({ text: a.nameZh, target });
    if (base !== a.nameZh) entries.push({ text: base, target });
  }
  // Longest first, so 「關稅及貿易總協定第24條」 wins over 「關稅及貿易總協定」.
  const seen = new Set<string>();
  const unique = entries.filter(e => !seen.has(e.text) && seen.add(e.text)).sort((x, y) => y.text.length - x.text.length);
  const byText = new Map(unique.map(e => [e.text, e.target]));
  const alts = unique.map(e => (latin(e.text) ? `(?<![A-Za-z])${esc(e.text)}(?![A-Za-z])` : esc(e.text)));
  // An original already written after the word — "(Most-Favoured-Nation, MFN)" — is absorbed.
  const pattern = new RegExp(`(${alts.join('|')})(\\s?[(（][A-Za-z][^()（）]{0,80}[)）])?`, 'g');
  return { byText, pattern };
}

let cache: ReturnType<typeof build> | null = null;

export function splitTerms(text: string): Segment[] {
  if (!text) return [];
  cache ??= build();
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(cache.pattern)) {
    const word = m[1];
    const target = cache.byText.get(word);
    if (!target || m.index === undefined) continue;
    if (m.index > last) out.push({ type: 'text', text: text.slice(last, m.index) });
    out.push({ type: 'link', text: word, target });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
  return out;
}

export const linkHref = (t: LinkTarget) =>
  t.kind === 'term' ? `/term/${t.id}` : t.kind === 'org' ? `/org/${t.id}` : `/agreement/${t.id}`;
