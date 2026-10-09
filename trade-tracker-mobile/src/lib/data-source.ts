/**
 * Data loading.
 *
 * Fetch order:
 *   1. AsyncStorage cache (if fresh, < 10 min old)
 *   2. Supabase (the live agreement database)
 *   3. Stale cache, then the bundled seed in src/data/agreements.ts
 *
 * Long curated content that rarely changes (article structures, full clause text)
 * still comes from the bundle; everything else comes from the database.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AgreementDetail, SourceTier, TradeAgreement } from '@/data/types';
import { agreements as bundledAgreements } from '@/data/agreements';
import { taipeiDate } from './format';
import { sbSelect, supabaseConfigured } from './supabase';

// Bump the version whenever the mapped snapshot shape changes, so stale caches are ignored.
const CACHE_KEY = 'tt:snapshot-v5';
const CACHE_KEY_LAST_SEEN = 'tt:last-seen-at';
const CACHE_TTL_MS = 10 * 60 * 1000;

export interface AgreementEvent {
  id: number;
  agreementId: string | null;
  type: string;
  eventDate: string | null;
  summaryZh: string | null;
  sourceId: string | null;
  sourceUrl: string | null;
  confidence: number | null;
  byTool: string | null;
  detectedAt: string;
  oldValue: unknown;
  newValue: unknown;
  title?: string;
  publisher?: string;
  tier?: SourceTier;
  symbol?: string;
  /** Events reporting the same development share a story key (set by the n8n flows). */
  storyKey?: string;
  /** On the story's most trustworthy event: the other reports of the same development. */
  related?: AgreementEvent[];
  /** Another report of a story whose main event is shown instead. */
  isRelated?: boolean;
}

export interface SourceHealth {
  sourceId: string;
  name: string;
  nameZh: string | null;
  pipeline: 'database' | 'news';
  kind: string;
  tier: SourceTier;
  enabled: boolean;
  lastRunAt: string | null;
  lastStatus: string | null;
  consecutiveFailures: number;
  health: 'green' | 'yellow' | 'red' | 'disabled' | 'never_run';
  url: string | null;
  notes: string | null;
}

export interface PipelineRun {
  id: number;
  pipeline: string;
  trigger: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  llmItems: number;
  eventsCount: number;
  error: string | null;
  runner: string | null;
}

export interface UpdateSetting {
  pipeline: 'database' | 'news';
  autoEnabled: boolean;
  scheduleCron: string;
  maxLlmItems: number;
}

export interface DataSnapshot {
  agreements: TradeAgreement[];
  details: Record<string, AgreementDetail>;
  events: AgreementEvent[];
  sources: SourceHealth[];
  runs: PipelineRun[];
  settings: UpdateSetting[];
  source: 'live' | 'cache' | 'bundled';
  fetchedAt: string;
  error?: string;
}

// Sources whose items are official documents (tier S) even when the event row has no tier.
const OFFICIAL_SOURCES = new Set(['wto-rta-is', 'wto-jsi-pages', 'wto-docs-ecom', 'wto-news-rss']);

const AGREEMENT_COLUMNS = [
  'id', 'name', 'name_zh', 'full_name_zh', 'short_name', 'type', 'status', 'era', 'key_dates',
  'latest_progress_date', 'latest_progress_note', 'trade_volume', 'description', 'description_zh',
  'key_provisions', 'tags', 'superseded_by', 'parent_id', 'related_ids', 'significance',
  'latest_status', 'indigo', 'source_docs', 'data_as_of', 'parties', 'party_names', 'party_names_zh',
].join(',');

const opt = <T,>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);

function toAgreement(r: any): TradeAgreement {
  // Party name arrays can contain nulls (party rows without a name); the app expects strings.
  const parties: string[] = r.parties ?? [];
  const names: (string | null)[] = r.party_names ?? [];
  const namesZh: (string | null)[] = r.party_names_zh ?? [];
  return {
    id: r.id,
    name: r.name,
    nameZh: r.name_zh ?? r.name,
    fullNameZh: opt(r.full_name_zh),
    shortName: opt(r.short_name),
    type: r.type,
    status: r.status,
    era: r.era ?? 'fragmentation',
    parties,
    partyNames: parties.map((code, i) => names[i] ?? code),
    partyNamesZh: parties.map((code, i) => namesZh[i] ?? names[i] ?? code),
    keyDates: r.key_dates ?? {},
    latestProgressDate: opt(r.latest_progress_date),
    latestProgressNote: opt(r.latest_progress_note),
    tradeVolume: opt(r.trade_volume),
    description: r.description ?? '',
    descriptionZh: r.description_zh ?? '',
    keyProvisions: r.key_provisions ?? [],
    tags: r.tags ?? [],
    supersededBy: opt(r.superseded_by),
    parentId: opt(r.parent_id),
    relatedIds: r.related_ids?.length ? r.related_ids : undefined,
    significance: opt(r.significance),
    dataAsOf: opt(r.data_as_of),
  };
}

function toDetail(r: any): AgreementDetail | null {
  if (!r.latest_status && !r.indigo && !(r.source_docs?.length)) return null;
  return {
    latestStatus: opt(r.latest_status),
    indigo: opt(r.indigo),
    sourceDocs: r.source_docs?.length ? r.source_docs : undefined,
  };
}

function toEvent(r: any): AgreementEvent {
  const meta = r.new_value && typeof r.new_value === 'object' && !Array.isArray(r.new_value) ? r.new_value : {};
  return {
    id: r.id,
    agreementId: r.agreement_id,
    type: r.event_type,
    eventDate: r.event_date,
    summaryZh: r.summary_zh,
    sourceId: r.source_id,
    sourceUrl: r.source_url,
    confidence: r.confidence,
    byTool: r.by_tool,
    detectedAt: r.detected_at,
    oldValue: r.old_value,
    newValue: r.new_value,
    title: meta.title ?? undefined,
    publisher: meta.publisher || undefined,
    tier: meta.tier ?? (r.source_id && OFFICIAL_SOURCES.has(r.source_id) ? 'S' : undefined),
    symbol: meta.symbol ?? undefined,
    storyKey: r.story_key ?? undefined,
  };
}

async function fetchLive(): Promise<DataSnapshot> {
  const [agreementRows, eventRows, healthRows, sourceRows, runRows, settingRows] = await Promise.all([
    // Agreements the WTO no longer lists (mostly old names of renamed RTAs) are kept in the
    // database with this tag but not shown.
    sbSelect<any>(`agreements_full?select=${AGREEMENT_COLUMNS}&tags=not.cs.%7Bwto-delisted%7D&order=id`),
    sbSelect<any>(
      'events?select=id,agreement_id,event_type,event_date,old_value,new_value,summary_zh,source_id,source_url,confidence,by_tool,detected_at,story_key&order=detected_at.desc,id.desc',
      { max: 3000 },
    ),
    sbSelect<any>('source_health?select=*'),
    sbSelect<any>('sources?select=id,url,notes'),
    sbSelect<any>('pipeline_runs?select=*&order=id.desc', { max: 30 }),
    sbSelect<any>('update_settings?select=*&order=pipeline'),
  ]);

  const details: Record<string, AgreementDetail> = {};
  for (const r of agreementRows) {
    const d = toDetail(r);
    if (d) details[r.id] = d;
  }
  const extra = new Map(sourceRows.map((s: any) => [s.id, s]));

  return {
    agreements: agreementRows.map(toAgreement),
    details,
    events: linkStories(eventRows.map(toEvent)),
    sources: healthRows.map((h: any) => ({
      sourceId: h.source_id, name: h.name, nameZh: h.name_zh, pipeline: h.pipeline, kind: h.kind,
      tier: h.tier, enabled: h.enabled, lastRunAt: h.last_run_at, lastStatus: h.last_status,
      consecutiveFailures: h.consecutive_failures, health: h.health,
      url: extra.get(h.source_id)?.url ?? null, notes: extra.get(h.source_id)?.notes ?? null,
    })),
    runs: runRows.map((r: any) => ({
      id: r.id, pipeline: r.pipeline, trigger: r.trigger, status: r.status, startedAt: r.started_at,
      finishedAt: r.finished_at, llmItems: r.llm_items, eventsCount: r.events_count, error: r.error, runner: r.runner,
    })),
    settings: settingRows.map((s: any) => ({
      pipeline: s.pipeline, autoEnabled: s.auto_enabled, scheduleCron: s.schedule_cron, maxLlmItems: s.max_llm_items,
    })),
    source: 'live',
    fetchedAt: new Date().toISOString(),
  };
}

const bundledSnapshot = (error?: string): DataSnapshot => ({
  agreements: bundledAgreements,
  details: {},
  events: [],
  sources: [],
  runs: [],
  settings: [],
  source: 'bundled',
  fetchedAt: new Date().toISOString(),
  error,
});

async function readCache(): Promise<{ data: DataSnapshot; ts: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as { data: DataSnapshot; ts: number }) : null;
  } catch {
    return null;
  }
}

async function writeCache(data: DataSnapshot): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export async function loadData(opts: { force?: boolean } = {}): Promise<DataSnapshot> {
  const cached = await readCache();
  if (!opts.force && cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return { ...cached.data, source: 'cache', fetchedAt: new Date(cached.ts).toISOString() };
  }
  if (!supabaseConfigured) return bundledSnapshot('尚未設定資料庫連線');
  try {
    const live = await fetchLive();
    await writeCache(live);
    return live;
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    if (cached) return { ...cached.data, source: 'cache', fetchedAt: new Date(cached.ts).toISOString(), error };
    return bundledSnapshot(error);
  }
}

/** Mark "now" as the user's last-seen timestamp. Used to compute unread events. */
export async function markSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY_LAST_SEEN, new Date().toISOString());
  } catch {}
}

export async function getLastSeen(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(CACHE_KEY_LAST_SEEN);
  } catch {
    return null;
  }
}

/** Database-import bookkeeping ("new agreement added to the dataset") is not news. */
export const isNewsworthy = (e: AgreementEvent) => e.type !== 'new_agreement' && !e.isRelated;

const TIER_RANK: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };

/**
 * Group events that report the same development. The most trustworthy one (official
 * first, then documents before news, then the earliest) stays in the lists and carries
 * the others in `related`; the others are marked `isRelated` and skipped by the lists.
 */
export function linkStories(events: AgreementEvent[]): AgreementEvent[] {
  const groups = new Map<string, AgreementEvent[]>();
  for (const e of events) {
    if (!e.storyKey) continue;
    const g = groups.get(e.storyKey);
    if (g) g.push(e);
    else groups.set(e.storyKey, [e]);
  }
  const rank = (e: AgreementEvent) => TIER_RANK[e.tier ?? 'C'] ?? 4;
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const [main, ...rest] = [...g].sort((a, b) =>
      rank(a) - rank(b)
      || Number(a.type === 'news') - Number(b.type === 'news')
      || eventSortDate(a).localeCompare(eventSortDate(b))
      || a.id - b.id);
    main.related = rest.sort(byEventDateDesc);
    for (const r of rest) r.isRelated = true;
  }
  return events;
}

/** Newest real-world date first (falls back to when it was detected). */
export const eventSortDate = (e: AgreementEvent) => e.eventDate ?? taipeiDate(e.detectedAt);
export const byEventDateDesc = (a: AgreementEvent, b: AgreementEvent) =>
  eventSortDate(b).localeCompare(eventSortDate(a)) || b.id - a.id;

/** Events the user hasn't acknowledged yet. */
export function unseenEvents(events: AgreementEvent[], lastSeen: string | null): AgreementEvent[] {
  const news = events.filter(isNewsworthy);
  if (!lastSeen) return news.slice(0, 20);
  return news.filter(e => e.detectedAt > lastSeen);
}
