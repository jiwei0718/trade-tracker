import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getRecentlyChanged, getStats } from '@/lib/selectors';
import { ERA_INFO } from '@/data/types';
import { Colors } from '@/constants/theme';
import AgreementCard from '@/components/agreement-card';
import { useWatchlist } from '@/lib/watchlist';
import { useData } from '@/lib/data-context';

function timeAgo(iso: string): string {
  if (!iso) return '尚未更新';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '剛剛';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`;
  return `${Math.floor(diff / 86400)} 天前`;
}

export default function Home() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { agreements, events, meta, source, loading, refresh, unseenCount } = useData();
  const recent = getRecentlyChanged(6, agreements);
  const stats = getStats(agreements);
  const { snapshots, hasItem } = useWatchlist();

  const watchlistChanges = agreements.filter(a => hasItem(a.id) && snapshots[a.id] && snapshots[a.id] !== a.status);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.textSecondary} />}>
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: c.text }]}>全球貿易協定追蹤</Text>
          <Text style={[styles.appSub, { color: c.textSecondary }]}>
            1860 — 2026 · {agreements.length} 個協定
          </Text>
          <View style={styles.dataStatus}>
            <View style={[styles.dataDot, { backgroundColor: source === 'remote' ? '#16a34a' : source === 'cache' ? '#f59e0b' : '#9ca3af' }]} />
            <Text style={{ color: c.textSecondary, fontSize: 11 }}>
              {source === 'remote' ? '即時資料' : source === 'cache' ? '快取資料' : '內建範例資料'}
              {meta?.last_run_at ? ` · 後端 ${timeAgo(meta.last_run_at)}` : ''}
              {unseenCount > 0 ? ` · 有 ${unseenCount} 則新動態` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="總協定數" value={String(stats.total)} icon="document-text" color="#3b82f6" />
          <StatCard label="生效中" value={String(stats.byStatus['in_force'] ?? 0)} icon="checkmark-circle" color="#16a34a" />
          <StatCard label="談判中" value={String(stats.byStatus['negotiating'] ?? 0)} icon="time" color="#d97706" />
          <StatCard label="已暫停/取消" value={String((stats.byStatus['suspended'] ?? 0) + (stats.byStatus['cancelled'] ?? 0))} icon="pause-circle" color="#9ca3af" />
        </View>

        {watchlistChanges.length > 0 && (
          <View style={[styles.alertCard, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="notifications" size={16} color="#92400e" />
              <Text style={{ fontWeight: '700', color: '#92400e' }}>你的追蹤協定有變動</Text>
            </View>
            {watchlistChanges.slice(0, 3).map(a => (
              <Text key={a.id} style={{ color: '#78350f', fontSize: 13 }}>• {a.nameZh} → 新狀態</Text>
            ))}
          </View>
        )}

        <View style={[styles.featureCard, { backgroundColor: '#dc262615', borderColor: '#dc262640' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Ionicons name="flash" size={18} color="#dc2626" />
            <Text style={{ fontWeight: '800', color: '#dc2626', fontSize: 15 }}>解放日後的世界</Text>
          </View>
          <Text style={{ color: c.text, fontSize: 13, lineHeight: 18, marginBottom: 8 }}>
            2025年4月川普「解放日」全面關稅後，其他國家加速簽訂彼此間的協定。一年內已完成15+項，繞過美國重建貿易網路。
          </Text>
          <Pressable
            onPress={() => router.push('/era/post_liberation')}
            style={{ alignSelf: 'flex-start', backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>查看完整故事 →</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>最近動態</Text>
          <Pressable onPress={() => router.push('/(tabs)/explore')}>
            <Text style={{ color: '#2563eb', fontSize: 12 }}>查看全部 →</Text>
          </Pressable>
        </View>
        <View style={{ gap: 10 }}>
          {recent.map(a => <AgreementCard key={a.id} agreement={a} compact />)}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>快速功能</Text>
        </View>
        <View style={styles.actionsRow}>
          <ActionTile icon="git-network" label="關聯圖" onPress={() => router.push('/arc')} color="#7c3aed" />
          <ActionTile icon="swap-horizontal" label="協定比較" onPress={() => router.push('/compare')} color="#16a34a" />
        </View>
        <View style={styles.actionsRow}>
          <ActionTile icon="time" label="歷史時期" onPress={() => router.push('/eras')} color="#0ea5e9" />
          <ActionTile icon="book" label="名詞對照" onPress={() => router.push('/glossary')} color="#f59e0b" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>歷史時期</Text>
        </View>
        <View style={{ gap: 8 }}>
          {Object.entries(ERA_INFO).map(([key, info]) => (
            <Pressable
              key={key}
              onPress={() => router.push(`/era/${key}`)}
              style={[styles.eraRow, { backgroundColor: c.backgroundElement }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.eraTitle, { color: c.text }]}>{info.label}</Text>
                <Text style={[styles.eraMeta, { color: c.textSecondary }]}>{info.range} · {info.tagline}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: any; color: string }) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <View style={[styles.statCard, { backgroundColor: c.backgroundElement }]}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[styles.statValue, { color: c.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.textSecondary }]}>{label}</Text>
    </View>
  );
}

function ActionTile({ icon, label, onPress, color }: { icon: any; label: string; onPress: () => void; color: string }) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <Pressable onPress={onPress} style={[styles.actionTile, { backgroundColor: c.backgroundElement }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.actionLabel, { color: c.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 14 },
  header: { marginBottom: 4 },
  appTitle: { fontSize: 22, fontWeight: '800' },
  appSub: { fontSize: 12, marginTop: 2 },
  dataStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  dataDot: { width: 6, height: 6, borderRadius: 3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: { flex: 1, minWidth: '46%', padding: 12, borderRadius: 12, gap: 4 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11 },
  alertCard: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 4 },
  featureCard: { padding: 14, borderRadius: 14, borderWidth: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionTile: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', gap: 6 },
  actionLabel: { fontSize: 13, fontWeight: '600' },
  eraRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10 },
  eraTitle: { fontSize: 14, fontWeight: '700' },
  eraMeta: { fontSize: 11, marginTop: 2 },
});
