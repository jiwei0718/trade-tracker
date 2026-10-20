/**
 * Minimal Supabase REST (PostgREST) reader.
 *
 * Uses only the publishable key, so it can read what RLS allows the public to see
 * (agreements, active events, sources, runs, settings) and nothing else.
 * Values come from trade-tracker-mobile/.env and are inlined at bundle time.
 */
const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = !!(URL && KEY);
const TIMEOUT_MS = 15_000;

/** The Supabase dashboard page of this project (where a paused project is restored). */
export const supabaseDashboardUrl = (() => {
  const ref = /^https:\/\/([a-z0-9]+)\.supabase\.co/.exec(URL ?? '')?.[1];
  return ref ? `https://supabase.com/dashboard/project/${ref}` : null;
})();

/** Plain-language reason for a failed database read. */
export function explainDbError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/failed to fetch|network ?error|network request failed|load failed|fetch failed|ENOTFOUND|getaddrinfo/i.test(msg)) {
    return '無法連線到資料庫:可能是沒有網路,或 Supabase 免費專案因 7 天未使用而暫停';
  }
  if (/HTTP 5\d\d/.test(msg)) return `資料庫暫時無法回應(${msg})`;
  return msg;
}

/** Fetch every row of a table/view query, paging with Range headers (PostgREST caps a page at 1000). */
export async function sbSelect<T>(path: string, opts: { pageSize?: number; max?: number } = {}): Promise<T[]> {
  if (!supabaseConfigured) throw new Error('Supabase is not configured');
  const pageSize = opts.pageSize ?? 1000;
  const max = opts.max ?? Infinity;
  const rows: T[] = [];
  for (let from = 0; from < max; from += pageSize) {
    const to = Math.min(from + pageSize, max) - 1;
    // An unreachable database (paused project, no network) should fail fast, not hang the page.
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
    let r: Response;
    try {
      r = await fetch(`${URL}/rest/v1/${path}`, {
        headers: { apikey: KEY!, Range: `${from}-${to}`, 'Range-Unit': 'items' },
        signal: abort.signal,
      });
    } catch (e) {
      throw abort.signal.aborted ? new Error('Failed to fetch (timeout)') : e;
    } finally {
      clearTimeout(timer);
    }
    if (!r.ok) throw new Error(`${path.split('?')[0]}: HTTP ${r.status}`);
    const page = (await r.json()) as T[];
    rows.push(...page);
    if (page.length < to - from + 1) break;
  }
  return rows;
}
