import { Linking, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useData } from '@/lib/data-context';
import type { SourceHealth } from '@/lib/data-source';
import { describeCron, formatDateTime, timeAgo } from '@/lib/format';
import { usePageWidth } from '@/hooks/use-desktop';
import TierChip from '@/components/tier-chip';

const PIPELINE_LABELS: Record<string, string> = { database: '協定資料庫', news: '新聞動態', all: '全部' };

const HEALTH: Record<SourceHealth['health'], { color: string; label: string }> = {
  green: { color: '#16a34a', label: '正常' },
  yellow: { color: '#d97706', label: '最近失敗' },
  red: { color: '#dc2626', label: '連續失敗' },
  disabled: { color: '#9ca3af', label: '已停用' },
  never_run: { color: '#cbd5e1', label: '尚未執行' },
};

const RUN_STATUS: Record<string, { color: string; label: string }> = {
  success: { color: '#16a34a', label: '成功' },
  partial: { color: '#d97706', label: '部分失敗' },
  failed: { color: '#dc2626', label: '失敗' },
  running: { color: '#2563eb', label: '執行中' },
};

const HEALTH_ORDER = ['red', 'yellow', 'green', 'never_run', 'disabled'];

export default function Status() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const page = usePageWidth(1000);
  const { settings, sources, runs, source, fetchedAt, error, loading, refresh, agreements, events } = useData();

  const sortedSources = [...sources].sort((a, b) =>
    HEALTH_ORDER.indexOf(a.health) - HEALTH_ORDER.indexOf(b.health) || a.pipeline.localeCompare(b.pipeline));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <ScrollView contentContainerStyle={[{ padding: 16, gap: 16 }, page]}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: c.text }]}>資料狀態</Text>
            <Text style={{ color: c.textSecondary, fontSize: 12 }}>
              {source === 'live' ? '已連線資料庫' : source === 'cache' ? '使用暫存資料' : '使用內建資料(未連線)'}
              {' · '}{agreements.length} 個協定 · {events.length} 筆事件 · 讀取於 {timeAgo(fetchedAt)}
            </Text>
            {!!error && <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 2 }}>連線問題:{error}</Text>}
          </View>
          <Pressable onPress={refresh} style={[styles.button, { backgroundColor: c.backgroundElement }]}>
            <Ionicons name="refresh" size={14} color={c.text} />
            <Text style={{ color: c.text, fontSize: 12, fontWeight: '600' }}>{loading ? '更新中…' : '重新整理'}</Text>
          </Pressable>
        </View>

        {/* Update settings */}
        <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>更新方式</Text>
          {settings.map(s => (
            <View key={s.pipeline} style={styles.settingRow}>
              <Text style={[styles.settingName, { color: c.text }]}>{PIPELINE_LABELS[s.pipeline]}</Text>
              <View style={[styles.pill, { backgroundColor: s.autoEnabled ? '#dcfce7' : '#f1f5f9' }]}>
                <Text style={{ color: s.autoEnabled ? '#15803d' : '#475569', fontSize: 12, fontWeight: '700' }}>
                  自動更新:{s.autoEnabled ? '開啟' : '關閉'}
                </Text>
              </View>
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>
                {s.autoEnabled ? describeCron(s.scheduleCron) : '只在手動執行時更新'} · 每次最多送 {s.maxLlmItems} 則給 AI
              </Text>
            </View>
          ))}
          {settings.length === 0 && <Text style={{ color: c.textSecondary, fontSize: 12 }}>尚未讀到設定。</Text>}
          <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 }}>
            目前請在 n8n(http://localhost:5678)手動執行流程。這裡的開關與「立即更新」按鈕,會在加上登入功能後開放,只有管理者能操作。
          </Text>
        </View>

        {/* Source health */}
        <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>資料來源({sources.length})</Text>
          {sortedSources.map(s => {
            const h = HEALTH[s.health];
            return (
              <View key={s.sourceId} style={[styles.sourceRow, { borderTopColor: c.backgroundSelected }]}>
                <View style={[styles.dot, { backgroundColor: h.color }]} />
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={styles.inline}>
                    <Text style={{ color: c.text, fontSize: 14, fontWeight: '700' }}>{s.nameZh ?? s.name}</Text>
                    <TierChip tier={s.tier} />
                    <Text style={{ color: c.textSecondary, fontSize: 11 }}>{PIPELINE_LABELS[s.pipeline]}</Text>
                  </View>
                  <Text style={{ color: c.textSecondary, fontSize: 12 }}>
                    {h.label}
                    {s.consecutiveFailures > 0 ? ` · 連續 ${s.consecutiveFailures} 次沒抓到或失敗` : ''}
                    {s.lastRunAt ? ` · 上次執行 ${timeAgo(s.lastRunAt)}` : ''}
                  </Text>
                  {!!s.notes && <Text style={{ color: c.textSecondary, fontSize: 12 }}>{s.notes}</Text>}
                </View>
                {!!s.url && (
                  <Pressable onPress={() => Linking.openURL(s.url!)} hitSlop={8}>
                    <Ionicons name="open-outline" size={16} color={c.textSecondary} />
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>

        {/* Recent runs */}
        <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>最近的執行紀錄</Text>
          {runs.length === 0 && <Text style={{ color: c.textSecondary, fontSize: 12 }}>還沒有執行紀錄。</Text>}
          {runs.map(r => {
            const st = RUN_STATUS[r.status] ?? { color: '#64748b', label: r.status };
            return (
              <View key={r.id} style={[styles.runRow, { borderTopColor: c.backgroundSelected }]}>
                <Text style={{ color: c.textSecondary, fontSize: 12, width: 36 }}>#{r.id}</Text>
                <Text style={{ color: c.text, fontSize: 12, width: 130 }}>{formatDateTime(r.startedAt)}</Text>
                <Text style={{ color: st.color, fontSize: 12, fontWeight: '700', width: 64 }}>{st.label}</Text>
                <Text style={{ color: c.textSecondary, fontSize: 12, flex: 1 }}>
                  {r.trigger === 'manual' ? '手動' : '排程'} · {PIPELINE_LABELS[r.pipeline] ?? r.pipeline}
                  {' · '}AI 處理 {r.llmItems} 則 · 新事件 {r.eventsCount} 筆{r.runner ? ` · ${r.runner}` : ''}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  button: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  card: { borderRadius: 12, padding: 14, gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '800' },
  settingRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  settingName: { fontSize: 14, fontWeight: '700', width: 80 },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  sourceRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingTop: 10, borderTopWidth: 1 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  runRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8, borderTopWidth: 1, flexWrap: 'wrap' },
});
