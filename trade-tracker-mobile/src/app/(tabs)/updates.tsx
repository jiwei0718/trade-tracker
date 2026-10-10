import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useData } from '@/lib/data-context';
import { byEventDateDesc, isNewsworthy, type AgreementEvent } from '@/lib/data-source';
import { timeAgo } from '@/lib/format';
import { usePageWidth } from '@/hooks/use-desktop';
import EventRow from '@/components/event-row';
import { TermScope } from '@/components/term-text';

type Filter = 'all' | 'documents' | 'news' | 'changes';

const FILTERS: { key: Filter; label: string; match: (e: AgreementEvent) => boolean }[] = [
  { key: 'all', label: '全部', match: () => true },
  { key: 'documents', label: '官方文件', match: e => e.type === 'new_document' },
  { key: 'news', label: '新聞與會議', match: e => ['news', 'ministerial', 'accession'].includes(e.type) },
  { key: 'changes', label: '狀態與日期變更', match: e => ['status_change', 'date_added', 'signed', 'in_force', 'concluded'].includes(e.type) },
];

export default function Updates() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const page = usePageWidth(900);
  const { events, agreements, loading, refresh, fetchedAt } = useData();
  const [filter, setFilter] = useState<Filter>('all');
  const [includeImports, setIncludeImports] = useState(false);

  const byId = useMemo(() => new Map(agreements.map(a => [a.id, a])), [agreements]);
  const list = useMemo(() => {
    const match = FILTERS.find(f => f.key === filter)!.match;
    return events
      .filter(e => !e.isRelated && (includeImports || isNewsworthy(e)) && match(e))
      .sort(byEventDateDesc);
  }, [events, filter, includeImports]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <TermScope resetKey={fetchedAt}>
      <View style={[styles.header, { borderBottomColor: c.backgroundElement }]}>
        <View style={page}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: c.text }]}>動態</Text>
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>
                追蹤流程找到的官方文件、新聞與狀態變更 · 資料更新於 {timeAgo(fetchedAt)}
              </Text>
            </View>
            <Pressable onPress={refresh} style={[styles.refresh, { backgroundColor: c.backgroundElement }]}>
              <Ionicons name="refresh" size={14} color={c.text} />
              <Text style={{ color: c.text, fontSize: 12, fontWeight: '600' }}>{loading ? '更新中…' : '重新整理'}</Text>
            </Pressable>
          </View>
          <View style={styles.chips}>
            {FILTERS.map(f => (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.chip, { backgroundColor: filter === f.key ? '#2563eb' : c.backgroundElement }]}>
                <Text style={{ color: filter === f.key ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>{f.label}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setIncludeImports(v => !v)} style={styles.toggle}>
              <Ionicons name={includeImports ? 'checkbox' : 'square-outline'} size={16} color={c.textSecondary} />
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>包含資料庫匯入與更正紀錄</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        data={list}
        keyExtractor={e => String(e.id)}
        contentContainerStyle={[{ paddingHorizontal: 16, paddingBottom: 32 }, page]}
        ListHeaderComponent={
          <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 10 }}>
            共 {list.length} 筆 · 只顯示通過品質檢查的動態,待確認的不會出現在這裡
          </Text>
        }
        renderItem={({ item }) => <EventRow event={item} agreement={item.agreementId ? byId.get(item.agreementId) : undefined} />}
        ListEmptyComponent={
          <Text style={{ color: c.textSecondary, textAlign: 'center', marginTop: 40 }}>
            {loading ? '載入中…' : '目前沒有符合條件的動態'}
          </Text>
        }
      />
      </TermScope>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  refresh: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 6 },
});
