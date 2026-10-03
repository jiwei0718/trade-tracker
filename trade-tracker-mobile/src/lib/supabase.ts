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

/** Fetch every row of a table/view query, paging with Range headers (PostgREST caps a page at 1000). */
export async function sbSelect<T>(path: string, opts: { pageSize?: number; max?: number } = {}): Promise<T[]> {
  if (!supabaseConfigured) throw new Error('Supabase is not configured');
  const pageSize = opts.pageSize ?? 1000;
  const max = opts.max ?? Infinity;
  const rows: T[] = [];
  for (let from = 0; from < max; from += pageSize) {
    const to = Math.min(from + pageSize, max) - 1;
    const r = await fetch(`${URL}/rest/v1/${path}`, {
      headers: { apikey: KEY!, Range: `${from}-${to}`, 'Range-Unit': 'items' },
    });
    if (!r.ok) throw new Error(`${path.split('?')[0]}: HTTP ${r.status}`);
    const page = (await r.json()) as T[];
    rows.push(...page);
    if (page.length < to - from + 1) break;
  }
  return rows;
}
