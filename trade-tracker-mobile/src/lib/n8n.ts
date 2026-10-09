import { Platform } from 'react-native';

/**
 * Controls for the n8n flows running on this computer (資料狀態 page).
 *
 * The page calls n8n webhooks that require the X-TT-Key header and accept only pages on
 * localhost (CORS). On a phone, or with the variables unset, the controls are hidden.
 */
const N8N_URL = process.env.EXPO_PUBLIC_N8N_URL;
const RUN_KEY = process.env.EXPO_PUBLIC_N8N_RUN_KEY;

// 「立即更新」starts every flow of the pipeline (news = e-commerce JSI tracking + global agreement news).
const RUN_PATHS: Record<string, string[]> = {
  database: ['tt-run-wto-rta-sync'],
  news: ['tt-run-jsi-ecom', 'tt-run-global-news'],
};

export const controlsAvailable =
  Platform.OS === 'web' &&
  !!N8N_URL && !!RUN_KEY &&
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

async function post(path: string, body: object): Promise<any> {
  const res = await fetch(`${N8N_URL}/webhook/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-TT-Key': RUN_KEY! },
    body: JSON.stringify(body),
  });
  if (res.status === 404) throw new Error('n8n 找不到這條流程,可能尚未發布(publish)');
  if (!res.ok) throw new Error(`n8n 回應 ${res.status}`);
  return res.json().catch(() => ({}));
}

/** Start a pipeline now (runs are recorded as manual). Resolves to the number of flows started. */
export async function startPipeline(pipeline: string): Promise<number> {
  const paths = RUN_PATHS[pipeline];
  if (!paths) throw new Error(`沒有這條流程:${pipeline}`);
  await Promise.all(paths.map(p => post(p, { trigger: 'manual' })));
  return paths.length;
}

export interface PendingEvent {
  id: number;
  agreement_id: string | null;
  event_type: string;
  event_date: string | null;
  summary_zh: string | null;
  source_id: string | null;
  source_url: string | null;
  story_key: string | null;
  detected_at: string;
  new_value: {
    title?: string; publisher?: string; tier?: 'S' | 'A' | 'B' | 'C'; proposed_name?: string | null;
    // events kept from the old pipeline's unverified AI extraction (see import_to_supabase.py)
    proposed_agreement_id?: string; value?: unknown;
  } | null;
}

/** Events waiting for review (status pending, last 120 days). */
export async function listPending(): Promise<PendingEvent[]> {
  const res = await post('tt-review-list', {});
  return Array.isArray(res?.events) ? res.events : [];
}

/** Approve (shown in 動態) or reject (retracted) pending events. */
export function decideEvents(ids: number[], decision: 'approve' | 'reject') {
  return post('tt-review-decide', { ids, decision });
}

/** Turn scheduled updates for a pipeline on or off (update_settings.auto_enabled). */
export function setAutoUpdate(pipeline: string, enabled: boolean) {
  return post('tt-settings', { pipeline, auto_enabled: enabled });
}
