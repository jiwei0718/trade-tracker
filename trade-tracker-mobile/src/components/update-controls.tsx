import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import type { PipelineRun, UpdateSetting } from '@/lib/data-source';
import { describeCron } from '@/lib/format';
import { setAutoUpdate, startPipeline } from '@/lib/n8n';

const LABELS: Record<string, string> = { database: '協定資料庫', news: '新聞動態' };
const POLL_MS = 5000;
const MAX_WAIT_MS = 5 * 60 * 1000;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface Props {
  setting: UpdateSetting;
  runs: PipelineRun[];
  refresh: () => Promise<void>;
}

/** 「立即更新」按鈕與自動更新開關(只在這台電腦的網頁上顯示)。 */
export default function UpdateControls({ setting, runs, refresh }: Props) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [busy, setBusy] = useState<'start' | 'toggle' | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  // The polling loop reads the newest runs through a ref (props change between awaits).
  const runsRef = useRef(runs);
  useEffect(() => { runsRef.current = runs; }, [runs]);

  const latest = runs.find(r => r.pipeline === setting.pipeline);
  const running = latest?.status === 'running' && Date.now() - Date.parse(latest.startedAt) < 30 * 60 * 1000;
  const name = LABELS[setting.pipeline] ?? setting.pipeline;

  async function start() {
    setBusy('start');
    setMessage({ text: '已送出,流程執行中…', ok: true });
    const before = latest?.id ?? 0;
    try {
      await startPipeline(setting.pipeline);
      const deadline = Date.now() + MAX_WAIT_MS;
      let done: PipelineRun | undefined;
      while (Date.now() < deadline) {
        await sleep(POLL_MS);
        await refresh();
        done = runsRef.current.find(r => r.pipeline === setting.pipeline && r.id > before && r.status !== 'running');
        if (done) break;
      }
      if (!done) setMessage({ text: '流程還在執行,稍後按「重新整理」查看結果。', ok: true });
      else if (done.status === 'success') setMessage({ text: `完成:新事件 ${done.eventsCount} 筆。`, ok: true });
      else setMessage({ text: `未完成:${done.error ?? done.status}`, ok: false });
    } catch (e) {
      setMessage({ text: `無法啟動:${e instanceof Error ? e.message : String(e)}`, ok: false });
    } finally {
      setBusy(null);
    }
  }

  async function toggle(next: boolean) {
    if (next) {
      const when = describeCron(setting.scheduleCron);
      const extra = setting.pipeline === 'news' ? `,每次最多送 ${setting.maxLlmItems} 則給 AI` : '';
      const ok = typeof window !== 'undefined' && window.confirm(
        `打開「${name}」自動更新?\n\n打開後,${when}會自動執行一次${extra}。電腦與 Docker 需要開著。之後隨時可以在這裡關閉。`);
      if (!ok) return;
    }
    setBusy('toggle');
    try {
      await setAutoUpdate(setting.pipeline, next);
      await refresh();
      setMessage({ text: next ? `已開啟自動更新(${describeCron(setting.scheduleCron)})。` : '已關閉自動更新。', ok: true });
    } catch (e) {
      setMessage({ text: `設定失敗:${e instanceof Error ? e.message : String(e)}`, ok: false });
    } finally {
      setBusy(null);
    }
  }

  return (
    <View style={{ gap: 4 }}>
      <View style={styles.row}>
        <View style={styles.switchWrap}>
          <Switch
            value={setting.autoEnabled}
            onValueChange={toggle}
            disabled={busy !== null}
            accessibilityLabel={`${name}自動更新`}
          />
          <Text style={{ color: c.textSecondary, fontSize: 12 }}>自動更新</Text>
        </View>
        <Pressable
          onPress={start}
          disabled={busy !== null || running}
          style={[styles.button, { backgroundColor: busy || running ? c.backgroundSelected : '#2563eb' }]}>
          {busy === 'start' || running
            ? <ActivityIndicator size="small" color={c.textSecondary} />
            : <Ionicons name="play" size={13} color="#fff" />}
          <Text style={{ color: busy || running ? c.textSecondary : '#fff', fontSize: 12, fontWeight: '700' }}>
            {busy === 'start' || running ? '執行中' : '立即更新'}
          </Text>
        </Pressable>
      </View>
      {!!message && (
        <Text style={{ color: message.ok ? c.textSecondary : '#dc2626', fontSize: 12 }}>{message.text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  switchWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
});
