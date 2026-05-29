/**
 * Live data fetcher.
 *
 * Fetch order:
 *   1. AsyncStorage cache (if fresh, < 6h old)
 *   2. Remote URL (GitHub raw content)
 *   3. Bundled fallback (the static seed in src/data/agreements.ts)
 *
 * The remote URL is set by REMOTE_DATA_URL below; user must update this
 * after pushing to GitHub. Until then, the app uses only the bundled seed.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TradeAgreement } from '@/data/types';
import { agreements as bundledAgreements } from '@/data/agreements';

// Live data published by the GitHub Actions pipeline (jiwei0718/trade-tracker).
const REMOTE_AGREEMENTS_URL =
  'https://raw.githubusercontent.com/jiwei0718/trade-tracker/main/data/agreements.json';
const REMOTE_EVENTS_URL =
  'https://raw.githubusercontent.com/jiwei0718/trade-tracker/main/data/events.json';
const REMOTE_META_URL =
  'https://raw.githubusercontent.com/jiwei0718/trade-tracker/main/data/meta.json';

const CACHE_KEY_AGREEMENTS = 'tt:agreements-v1';
const CACHE_KEY_EVENTS = 'tt:events-v1';
const CACHE_KEY_META = 'tt:meta-v1';
const CACHE_KEY_LAST_SEEN = 'tt:last-seen-at';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;   // 6 hours

export interface Meta {
  last_run_at: string;
  agreement_count: number;
  event_count_this_run: number;
  source_counts?: Record<string, number>;
}

export interface ChangeEvent {
  id: string;
  agreement_id: string;
  kind: 'status_change' | 'new_agreement' | 'date_added';
  from_value: string | null;
  to_value: string;
  detected_at: string;
  effective_date: string | null;
  sources?: { name: string; url: string; fetched_at: string }[];
}

export interface DataSnapshot {
  agreements: TradeAgreement[];
  events: ChangeEvent[];
  meta: Meta | null;
  source: 'remote' | 'cache' | 'bundled';
  fetchedAt: string;
}

/**
 * Merge remote agreements with bundled ones. Remote wins on conflicts (by id);
 * bundled-only agreements (e.g. newly added digital trade agreements not yet in
 * the pipeline output) are appended so they always appear. Article structures
 * and other bundled-only fields are backfilled onto matching remote records.
 */
function mergeWithBundled(remote: TradeAgreement[]): TradeAgreement[] {
  const bundledById = new Map(bundledAgreements.map(a => [a.id, a]));
  const remoteIds = new Set(remote.map(a => a.id));
  const merged = remote.map(a => {
    const b = bundledById.get(a.id);
    // Backfill article structure / significance from bundled if remote lacks them
    if (b) {
      return {
        ...a,
        articleStructure: a.articleStructure ?? b.articleStructure,
        significance: a.significance ?? b.significance,
      };
    }
    return a;
  });
  // Append bundled-only agreements
  for (const b of bundledAgreements) {
    if (!remoteIds.has(b.id)) merged.push(b);
  }
  return merged;
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  if (url.includes('<USERNAME>')) return null;     // not configured yet
  try {
    const r = await fetch(url, { signal });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

async function readCache<T>(key: string): Promise<{ data: T; ts: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as { data: T; ts: number };
  } catch {
    return null;
  }
}

async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

const seedAsSnapshot = (): DataSnapshot => ({
  agreements: bundledAgreements,
  events: [],
  meta: null,
  source: 'bundled',
  fetchedAt: new Date().toISOString(),
});

export async function loadData(opts: { force?: boolean } = {}): Promise<DataSnapshot> {
  const force = opts.force ?? false;

  // 1. Try fresh remote (always when force, else only if cache stale)
  if (force) return await fetchRemoteOrFallback();

  // 2. Try cache
  const [aCache, eCache, mCache] = await Promise.all([
    readCache<{ agreements: TradeAgreement[] }>(CACHE_KEY_AGREEMENTS),
    readCache<{ events: ChangeEvent[] }>(CACHE_KEY_EVENTS),
    readCache<Meta>(CACHE_KEY_META),
  ]);
  if (aCache && Date.now() - aCache.ts < CACHE_TTL_MS) {
    return {
      agreements: aCache.data.agreements,
      events: eCache?.data.events ?? [],
      meta: mCache?.data ?? null,
      source: 'cache',
      fetchedAt: new Date(aCache.ts).toISOString(),
    };
  }

  // 3. Cache stale or missing → remote
  return await fetchRemoteOrFallback(aCache?.data.agreements);
}

async function fetchRemoteOrFallback(staleAgreements?: TradeAgreement[]): Promise<DataSnapshot> {
  const [agreementsResp, eventsResp, metaResp] = await Promise.all([
    fetchJson<{ agreements: TradeAgreement[] }>(REMOTE_AGREEMENTS_URL),
    fetchJson<{ events: ChangeEvent[] }>(REMOTE_EVENTS_URL),
    fetchJson<Meta>(REMOTE_META_URL),
  ]);

  if (agreementsResp?.agreements) {
    const merged = mergeWithBundled(agreementsResp.agreements);
    // Cache, then return
    await Promise.all([
      writeCache(CACHE_KEY_AGREEMENTS, { agreements: merged }),
      writeCache(CACHE_KEY_EVENTS, { events: eventsResp?.events ?? [] }),
      writeCache(CACHE_KEY_META, metaResp ?? null),
    ]);
    return {
      agreements: merged,
      events: eventsResp?.events ?? [],
      meta: metaResp ?? null,
      source: 'remote',
      fetchedAt: new Date().toISOString(),
    };
  }

  // Remote failed: stale cache (if any), else bundled
  if (staleAgreements) {
    return {
      agreements: staleAgreements,
      events: [],
      meta: null,
      source: 'cache',
      fetchedAt: new Date().toISOString(),
    };
  }
  return seedAsSnapshot();
}

/** Mark "now" as the user's last-seen timestamp. Used to compute unread events. */
export async function markSeen(): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY_LAST_SEEN, new Date().toISOString());
}

export async function getLastSeen(): Promise<string | null> {
  return await AsyncStorage.getItem(CACHE_KEY_LAST_SEEN);
}

/** Events the user hasn't acknowledged yet. */
export function unseenEvents(events: ChangeEvent[], lastSeen: string | null): ChangeEvent[] {
  if (!lastSeen) return events.slice(0, 20);
  return events.filter(e => e.detected_at > lastSeen);
}
