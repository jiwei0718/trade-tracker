import { agreements as bundledAgreements } from '@/data/agreements';
import type { TradeAgreement, AgreementStatus, EraKey } from '@/data/types';

/**
 * Most selectors now take an explicit `list` argument so we can pass either
 * the bundled seed or the live-fetched list. The legacy zero-arg versions
 * still work for back-compat and use the bundled seed.
 */

export function getAgreementById(id: string, list: TradeAgreement[] = bundledAgreements): TradeAgreement | undefined {
  return list.find(a => a.id === id);
}

export function getEffectiveDate(a: TradeAgreement): string | undefined {
  const d = a.keyDates;
  return d.in_force ?? d.signed ?? d.concluded ?? d.started ?? d.proposed ?? d.suspended ?? d.cancelled ?? d.expired ?? d.superseded;
}

export function getLatestEventDate(a: TradeAgreement): { kind: string; date: string } | null {
  const events: { kind: string; date: string }[] = [];
  for (const [k, v] of Object.entries(a.keyDates)) {
    if (v) events.push({ kind: k, date: v });
  }
  if (events.length === 0) return null;
  events.sort((x, y) => y.date.localeCompare(x.date));
  return events[0];
}

const SKIP_CODES = new Set(['MULTI', 'WORLD', 'WTO', 'ASEAN', 'EU', 'CPTPP', 'ACP', 'OACPS', 'AU-CONT', 'WTO-JSI']);

export function getAllParties(list: TradeAgreement[] = bundledAgreements): { code: string; nameZh: string; count: number }[] {
  const map = new Map<string, { nameZh: string; count: number }>();
  list.forEach(a => {
    a.parties.forEach((code, i) => {
      if (SKIP_CODES.has(code)) return;
      const nameZh = a.partyNamesZh[i] ?? code;
      const existing = map.get(code);
      if (existing) existing.count++;
      else map.set(code, { nameZh, count: 1 });
    });
  });
  return Array.from(map.entries())
    .map(([code, v]) => ({ code, ...v }))
    .sort((a, b) => b.count - a.count);
}

export function getAgreementsForParty(code: string, list: TradeAgreement[] = bundledAgreements): TradeAgreement[] {
  return list
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
  return sortByMostRecent([...list]).slice(0, limit);
}

export function search(query: string, list: TradeAgreement[] = bundledAgreements): TradeAgreement[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return list.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.nameZh.includes(query) ||
    a.shortName?.toLowerCase().includes(q) ||
    a.partyNamesZh.some(p => p.includes(query)) ||
    a.partyNames.some(p => p.toLowerCase().includes(q)) ||
    a.descriptionZh.includes(query),
  );
}

export function getStats(list: TradeAgreement[] = bundledAgreements) {
  const byStatus: Record<string, number> = {};
  list.forEach(a => { byStatus[a.status] = (byStatus[a.status] ?? 0) + 1; });
  const totalVolume = list.reduce((s, a) => s + (a.tradeVolume ?? 0), 0);
  const activeVolume = list
    .filter(a => ['in_force', 'signed', 'concluded'].includes(a.status))
    .reduce((s, a) => s + (a.tradeVolume ?? 0), 0);
  return { byStatus, totalVolume, activeVolume, total: list.length };
}
