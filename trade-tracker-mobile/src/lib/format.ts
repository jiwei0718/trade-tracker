export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '尚無紀錄';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '剛剛';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`;
  return `${Math.floor(diff / 86400)} 天前`;
}

const DATE_TIME = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
});

/** "2026/10/03 19:15" in Taipei time. */
export function formatDateTime(iso: string | null | undefined): string {
  return iso ? DATE_TIME.format(new Date(iso)) : '—';
}

/** Human-readable version of the few cron expressions the control panel uses. */
export function describeCron(cron: string): string {
  const m = cron.match(/^(\d+) (\d+) \* \* \*$/);
  if (m) return `每天 ${m[2].padStart(2, '0')}:${m[1].padStart(2, '0')}(臺北時間)`;
  return cron;
}
