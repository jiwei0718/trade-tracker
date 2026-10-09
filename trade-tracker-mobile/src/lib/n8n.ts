import { Platform } from 'react-native';

/**
 * Controls for the n8n flows running on this computer (資料狀態 page).
 *
 * The page calls n8n webhooks that require the X-TT-Key header and accept only pages on
 * localhost (CORS). On a phone, or with the variables unset, the controls are hidden.
 */
const N8N_URL = process.env.EXPO_PUBLIC_N8N_URL;
const RUN_KEY = process.env.EXPO_PUBLIC_N8N_RUN_KEY;

const RUN_PATHS: Record<string, string> = { database: 'tt-run-wto-rta-sync', news: 'tt-run-jsi-ecom' };

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

/** Start a pipeline now (the run is recorded as manual). Returns once n8n has accepted it. */
export function startPipeline(pipeline: string) {
  const path = RUN_PATHS[pipeline];
  if (!path) throw new Error(`沒有這條流程:${pipeline}`);
  return post(path, { trigger: 'manual' });
}

/** Turn scheduled updates for a pipeline on or off (update_settings.auto_enabled). */
export function setAutoUpdate(pipeline: string, enabled: boolean) {
  return post('tt-settings', { pipeline, auto_enabled: enabled });
}
