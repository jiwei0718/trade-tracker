import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Colors } from '@/constants/theme';
import AgreementCard from '@/components/agreement-card';
import { useWatchlist } from '@/lib/watchlist';
import { useData } from '@/lib/data-context';
import { STATUS_LABELS } from '@/data/types';

export default function WatchlistTab() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { ids, snapshots, setSnapshot } = useWatchlist();
  const { agreements, events, loading, refresh, unseenCount, acknowledgeAll } = useData();

  const list = agreements.filter(a => ids.has(a.id));
  // Local snapshot diffs (legacy "mark as seen" mechanism)
  const localChanges = list.filter(a => snapshots[a.id] && snapshots[a.id] !== a.status);
  // Server-side detected events for this user's watched agreements
  const serverEvents = events.filter(e => ids.has(e.agreement_id));

  const simulateChange = () => {
    if (list.length === 0) {
      Alert.alert('提示', '請先加入一些追蹤項目');
      return;
    }
    // Pick first watched agreement and record its CURRENT status as old snapshot
    // (simulating that it was different before)
    const target = list[0];
    const oldStatus = target.status === 'in_force' ? 'negotiating' : 'in_force';
    setSnapshot(target.id, oldStatus);
    Alert.alert(
      '已模擬狀態變更',
      `「${target.nameZh}」的狀態從「${STATUS_LABELS[oldStatus]}」變為「${STATUS_LABELS[target.status]}」。\n首頁與此頁面會顯示變動提醒。`,
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: c.backgroundElement }]}>
        <View>
          <Text style={[styles.title, { color: c.text }]}>追蹤清單</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{list.length} 個追蹤協定</Text>
        </View>

        <Pressable onPress={simulateChange} style={[styles.simBtn, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name="play" size={14} color={c.text} />
          <Text style={{ color: c.text, fontSize: 12, fontWeight: '600' }}>模擬通知</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.textSecondary} />}>
        {/* Empty state */}
        {list.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="star-outline" size={48} color={c.textSecondary} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>還沒有追蹤的協定</Text>
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>
              在任何協定卡片右上角點擊「☆」即可加入追蹤。當該協定狀態變化（如從「談判中」變為「已簽署」），這裡會通知你。
            </Text>
          </View>
        )}

        {/* Server-detected events (from the daily pipeline) */}
        {serverEvents.length > 0 && (
          <View style={[styles.changesCard, { backgroundColor: '#dcfce7', borderColor: '#16a34a' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="cloud-done" size={16} color="#14532d" />
              <Text style={{ fontWeight: '800', color: '#14532d' }}>後端偵測到的變動</Text>
              {unseenCount > 0 && (
                <View style={{ backgroundColor: '#dc2626', borderRadius: 999, paddingHorizontal: 6 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{unseenCount}</Text>
                </View>
              )}
            </View>
            {serverEvents.slice(0, 8).map(e => {
              const a = agreements.find(x => x.id === e.agreement_id);
              return (
                <Pressable key={e.id} onPress={() => a && router.push(`/agreement/${a.id}`)}>
                  <Text style={{ color: '#14532d', fontSize: 13, lineHeight: 18 }}>
                    • {a?.nameZh ?? e.agreement_id}：
                    {e.kind === 'status_change' && (
                      <>
                        <Text style={{ textDecorationLine: 'line-through' }}>
                          {STATUS_LABELS[e.from_value as keyof typeof STATUS_LABELS] ?? e.from_value ?? '?'}
                        </Text>
                        {' → '}
                        <Text style={{ fontWeight: '700' }}>
                          {STATUS_LABELS[e.to_value as keyof typeof STATUS_LABELS] ?? e.to_value}
                        </Text>
                      </>
                    )}
                    {e.kind === 'new_agreement' && <Text style={{ fontWeight: '700' }}>新加入追蹤體系</Text>}
                    {e.kind === 'date_added' && <Text style={{ fontWeight: '700' }}>新日期：{e.to_value}</Text>}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable onPress={acknowledgeAll} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              <Text style={{ color: '#14532d', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>
                標記為已讀
              </Text>
            </Pressable>
          </View>
        )}

        {/* Legacy local snapshot diffs (used by 「模擬通知」按鈕) */}
        {localChanges.length > 0 && (
          <View style={[styles.changesCard, { backgroundColor: '#fef3c7', borderColor: '#fbbf24' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="notifications" size={16} color="#92400e" />
              <Text style={{ fontWeight: '800', color: '#92400e' }}>本地模擬變更</Text>
            </View>
            {localChanges.map(a => (
              <Text key={a.id} style={{ color: '#78350f', fontSize: 13 }}>
                • {a.nameZh}：
                <Text style={{ textDecorationLine: 'line-through' }}>{STATUS_LABELS[snapshots[a.id] as keyof typeof STATUS_LABELS]}</Text>
                {' → '}
                <Text style={{ fontWeight: '700' }}>{STATUS_LABELS[a.status]}</Text>
              </Text>
            ))}
            <Pressable
              onPress={() => localChanges.forEach(a => setSnapshot(a.id, a.status))}
              style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              <Text style={{ color: '#92400e', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>標記為已讀</Text>
            </Pressable>
          </View>
        )}

        {/* All watched */}
        {list.map(a => <AgreementCard key={a.id} agreement={a} />)}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  simBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  emptyCard: { alignItems: 'center', padding: 32, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },
  changesCard: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 4 },
});
