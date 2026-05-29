import { agreements as bundledAgreements } from '@/data/agreements';
import type { TradeAgreement, AgreementStatus, EraKey } from '@/data/types';
import { countryDisplay, countryMatchesQuery } from '@/data/countries';

/**
 * Most selectors now take an explicit `list` argument so we can pass either
 * the bundled seed or the live-fetched list. The legacy zero-arg versions
 * still work for back-compat and use the bundled seed.
 */

export function getAgreementById(id: string, list: TradeAgreement[] = bundledAgreements): TradeAgreement | undefined {
  return list.find(a => a.id === id);
}

/** Top-level agreements only — excludes sub-instruments (e.g. WT/GC/283 under the JSI). */
export function topLevel(list: TradeAgreement[]): TradeAgreement[] {
  return list.filter(a => !a.parentId);
}

export function getEffectiveDate(a: TradeAgreement): string | undefined {
  const d = a.keyDates;
  return d.in_force ?? d.signed ?? d.concluded ?? d.started ?? d.proposed ?? d.suspended ?? d.cancelled ?? d.expired ?? d.superseded;
}

export function getLatestEventDate(a: TradeAgreement): { kind: string; date: string } | null {
  // Explicit latest-progress date wins (e.g. an accession after entry-into-force).
  if (a.latestProgressDate) {
    return { kind: 'latest_progress', date: a.latestProgressDate };
  }
  const events: { kind: string; date: string }[] = [];
  for (const [k, v] of Object.entries(a.keyDates)) {
    if (v) events.push({ kind: k, date: v });
  }
  if (events.length === 0) return null;
  events.sort((x, y) => y.date.localeCompare(x.date));
  return events[0];
}

/** Signing date (簽署日期) if present. */
export function getSignedDate(a: TradeAgreement): string | undefined {
  return a.keyDates.signed;
}

/** Latest progress date (最新進展日期). */
export function getLatestProgressDate(a: TradeAgreement): string | undefined {
  return a.latestProgressDate ?? getLatestEventDate(a)?.date;
}

const SKIP_CODES = new Set(['MULTI', 'WORLD', 'WTO', 'ASEAN', 'EU', 'CPTPP', 'ACP', 'OACPS', 'AU-CONT', 'WTO-JSI']);

export function getAllParties(listIn: TradeAgreement[] = bundledAgreements): { code: string; nameZh: string; count: number }[] {
  const list = topLevel(listIn);
  const map = new Map<string, { nameZh: string; count: number }>();
  list.forEach(a => {
    a.parties.forEach((code, i) => {
      if (SKIP_CODES.has(code)) return;
      // Always prefer the canonical registry Chinese name; fall back to stored.
      const nameZh = countryDisplay(code, a.partyNamesZh[i] ?? code);
      const existing = map.get(code);
      if (existing) existing.count++;
      else map.set(code, { nameZh, count: 1 });
    });
  });
  return Array.from(map.entries())
    .map(([code, v]) => ({ code, ...v }))
    .sort((a, b) => b.count - a.count);
}

/** Filter parties by a query matching code / zh / en / aliases. */
export function filterPartiesByQuery(
  parties: { code: string; nameZh: string; count: number }[],
  query: string,
): { code: string; nameZh: string; count: number }[] {
  if (!query.trim()) return parties;
  return parties.filter(p => countryMatchesQuery(p.code, query) || p.nameZh.includes(query));
}

export function getAgreementsForParty(code: string, list: TradeAgreement[] = bundledAgreements): TradeAgreement[] {
  return topLevel(list)
    .filter(a => a.parties.includes(code))
    .sort((x, y) => {
      const dx = getEffectiveDate(x) ?? '';
      const dy = getEffectiveDate(y) ?? '';
      return dy.localeCompare(dx);
    });
}

export function getAgreementsByEra(era: EraKey, list: TradeAgreement[] = bundledAgreements): TradeAgreement[] {
  return list.filter(a => a.era === era);
}

export function getAgreementsByStatus(status: AgreementStatus, list: TradeAgreement[] = bundledAgreements): TradeAgreement[] {
  return list.filter(a => a.status === status);
}

export function sortByMostRecent(list: TradeAgreement[]): TradeAgreement[] {
  return [...list].sort((a, b) => {
    const ea = getLatestEventDate(a)?.date ?? '';
    const eb = getLatestEventDate(b)?.date ?? '';
    return eb.localeCompare(ea);
  });
}

export function getRecentlyChanged(limit = 8, list: TradeAgreement[] = bundledAgreements): TradeAgreement[] {
  return sortByMostRecent(topLevel(list)).slice(0, limit);
}

export function search(query: string, list: TradeAgreement[] = bundledAgreements): TradeAgreement[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return topLevel(list).filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.nameZh.includes(query) ||
    a.fullNameZh?.includes(query) ||
    a.shortName?.toLowerCase().includes(q) ||
    a.partyNamesZh.some(p => p.includes(query)) ||
    a.partyNames.some(p => p.toLowerCase().includes(q)) ||
    a.parties.some(code => countryMatchesQuery(code, query)) ||
    a.descriptionZh.includes(query),
  );
}

export function getStats(listIn: TradeAgreement[] = bundledAgreements) {
  const list = topLevel(listIn);
  const byStatus: Record<string, number> = {};
  list.forEach(a => { byStatus[a.status] = (byStatus[a.status] ?? 0) + 1; });
  const totalVolume = list.reduce((s, a) => s + (a.tradeVolume ?? 0), 0);
  const activeVolume = list
    .filter(a => ['in_force', 'signed', 'concluded'].includes(a.status))
    .reduce((s, a) => s + (a.tradeVolume ?? 0), 0);
  return { byStatus, totalVolume, activeVolume, total: list.length };
}
