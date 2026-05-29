import { useState, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ERA_INFO, STATUS_LABELS, STATUS_COLORS } from '@/data/types';
import type { AgreementStatus, EraKey } from '@/data/types';
import { Colors } from '@/constants/theme';
import { getAllParties, search, getEffectiveDate, filterPartiesByQuery } from '@/lib/selectors';
import AgreementCard from '@/components/agreement-card';
import { useData } from '@/lib/data-context';
import { tagLabel } from '@/data/tags';
import { getAgreementTags } from '@/lib/issue-tags';

type Mode = 'agreements' | 'countries' | 'tags';
type SortKey = 'newest' | 'oldest' | 'volume' | 'name';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: '最新→最舊' },
  { key: 'oldest', label: '最舊→最新' },
  { key: 'volume', label: '貿易量' },
  { key: 'name', label: '名稱' },
];

const STATUSES: AgreementStatus[] = ['in_force', 'concluded', 'signed', 'negotiating', 'suspended', 'cancelled', 'superseded'];

export default function Explore() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { agreements } = useData();
  const [mode, setMode] = useState<Mode>('agreements');
  const [query, setQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<Set<AgreementStatus>>(new Set());
  const [eraFilter, setEraFilter] = useState<EraKey | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('newest');

  const parties = useMemo(() => getAllParties(agreements), [agreements]);

  // Most common tags across the dataset, for the tag filter row.
  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    agreements.forEach(a => getAgreementTags(a).forEach(t => { counts[t] = (counts[t] ?? 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 30);
  }, [agreements]);

  const filtered = useMemo(() => {
    let list = query ? search(query, agreements) : agreements.filter(a => !a.parentId);
    if (statusFilters.size) list = list.filter(a => statusFilters.has(a.status));
    if (eraFilter) list = list.filter(a => a.era === eraFilter);
    if (tagFilter) list = list.filter(a => getAgreementTags(a).includes(tagFilter));
    // Sort
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case 'newest': return (getEffectiveDate(b) ?? '').localeCompare(getEffectiveDate(a) ?? '');
        case 'oldest': return (getEffectiveDate(a) ?? '').localeCompare(getEffectiveDate(b) ?? '');
        case 'volume': return (b.tradeVolume ?? 0) - (a.tradeVolume ?? 0);
        case 'name': return a.nameZh.localeCompare(b.nameZh, 'zh-Hant');
        default: return 0;
      }
    });
    return list;
  }, [query, statusFilters, eraFilter, tagFilter, sortKey, agreements]);

  const partyResults = useMemo(() => filterPartiesByQuery(parties, query), [query, parties]);

  // All tags with counts, for the 議題 (topics) mode.
  const tagResults = useMemo(() => {
    const counts: Record<string, number> = {};
    agreements.forEach(a => getAgreementTags(a).forEach(t => { counts[t] = (counts[t] ?? 0) + 1; }));
    let entries = Object.entries(counts).map(([tag, count]) => ({ tag, count, label: tagLabel(tag) }));
    if (query) entries = entries.filter(e => e.label.includes(query) || e.tag.includes(query.toLowerCase()));
    return entries.sort((a, b) => b.count - a.count);
  }, [agreements, query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: c.backgroundElement }]}>
        <Text style={[styles.title, { color: c.text }]}>瀏覽</Text>

        <View style={[styles.tabs, { backgroundColor: c.backgroundElement }]}>
          <Pressable
            onPress={() => setMode('agreements')}
            style={[styles.tab, mode === 'agreements' && { backgroundColor: c.background }]}>
            <Text style={[styles.tabText, { color: mode === 'agreements' ? c.text : c.textSecondary }]}>協定</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('countries')}
            style={[styles.tab, mode === 'countries' && { backgroundColor: c.background }]}>
            <Text style={[styles.tabText, { color: mode === 'countries' ? c.text : c.textSecondary }]}>國家</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('tags')}
            style={[styles.tab, mode === 'tags' && { backgroundColor: c.background }]}>
            <Text style={[styles.tabText, { color: mode === 'tags' ? c.text : c.textSecondary }]}>議題</Text>
          </Pressable>
        </View>

        <View style={[styles.searchBox, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name="search" size={16} color={c.textSecondary} />
          <TextInput
            placeholder={mode === 'agreements' ? '搜尋協定名稱、國家…' : mode === 'tags' ? '搜尋議題…' : '搜尋國家…'}
            placeholderTextColor={c.textSecondary}
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, color: c.text, fontSize: 14 }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={c.textSecondary} />
            </Pressable>
          )}
        </View>

        {mode === 'agreements' && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              <Chip label="所有時期" active={!eraFilter} onPress={() => setEraFilter(null)} />
              {Object.entries(ERA_INFO).map(([key, info]) => (
                <Chip
                  key={key}
                  label={info.label}
                  active={eraFilter === key}
                  onPress={() => setEraFilter(eraFilter === key ? null : (key as EraKey))}
                />
              ))}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {STATUSES.map(s => (
                <StatusChip
                  key={s}
                  status={s}
                  active={statusFilters.has(s)}
                  onPress={() => {
                    const next = new Set(statusFilters);
                    next.has(s) ? next.delete(s) : next.add(s);
                    setStatusFilters(next);
                  }}
                />
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="pricetag" size={13} color={c.textSecondary} />
                <Text style={{ color: c.textSecondary, fontSize: 12, marginRight: 2 }}>標籤</Text>
              </View>
              {topTags.map(t => (
                <Pressable
                  key={t}
                  onPress={() => setTagFilter(tagFilter === t ? null : t)}
                  style={[
                    styles.chip,
                    tagFilter === t ? { backgroundColor: '#7c3aed' } : { backgroundColor: c.backgroundElement },
                  ]}>
                  <Text style={{ color: tagFilter === t ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>
                    {tagLabel(t)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.sortRow}>
              <Ionicons name="swap-vertical" size={14} color={c.textSecondary} />
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>排序：</Text>
              {SORT_OPTIONS.map(opt => (
                <Pressable
                  key={opt.key}
                  onPress={() => setSortKey(opt.key)}
                  style={[
                    styles.sortChip,
                    sortKey === opt.key
                      ? { backgroundColor: '#1e3a5f' }
                      : { backgroundColor: c.backgroundElement },
                  ]}>
                  <Text style={{ color: sortKey === opt.key ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>

      {mode === 'agreements' ? (
        <FlatList
          key="list-agreements"
          data={filtered}
          keyExtractor={a => a.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => <AgreementCard agreement={item} />}
          ListHeaderComponent={
            <Text style={{ color: c.textSecondary, fontSize: 12, marginBottom: 4 }}>
              共 {filtered.length} 個協定{tagFilter ? `（議題：${tagLabel(tagFilter)}）` : ''}
            </Text>
          }
          ListEmptyComponent={
            <Text style={{ color: c.textSecondary, textAlign: 'center', marginTop: 40 }}>沒有符合條件的協定</Text>
          }
        />
      ) : mode === 'tags' ? (
        <FlatList
          key="list-tags-2col"
          data={tagResults}
          keyExtractor={t => t.tag}
          numColumns={2}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => { setTagFilter(item.tag); setQuery(''); setMode('agreements'); }}
              style={({ pressed }) => [
                styles.tagCard,
                { backgroundColor: '#7c3aed15', borderColor: '#7c3aed40', opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.tagCardLabel, { color: c.text }]} numberOfLines={2}>{item.label}</Text>
              <Text style={{ color: '#7c3aed', fontSize: 12, fontWeight: '700', marginTop: 2 }}>{item.count} 個協定</Text>
            </Pressable>
          )}
          ListHeaderComponent={
            <Text style={{ color: c.textSecondary, fontSize: 12, marginBottom: 4 }}>
              依議題瀏覽 · 共 {tagResults.length} 個議題（點選即篩選協定）
            </Text>
          }
        />
      ) : (
        <FlatList
          key="list-countries"
          data={partyResults}
          keyExtractor={p => p.code}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/country/${item.code}`)}
              style={({ pressed }) => [
                styles.countryRow,
                { backgroundColor: c.backgroundElement, opacity: pressed ? 0.7 : 1 },
              ]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.countryName, { color: c.text }]}>{item.nameZh}</Text>
                <Text style={[styles.countryMeta, { color: c.textSecondary }]}>{item.count} 個協定 · {item.code}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
            </Pressable>
          )}
          ListHeaderComponent={
            <Text style={{ color: c.textSecondary, fontSize: 12, marginBottom: 4 }}>
              依協定數量排序 · 共 {partyResults.length} 國
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active ? { backgroundColor: '#2563eb' } : { backgroundColor: c.backgroundElement },
      ]}>
      <Text style={[styles.chipText, { color: active ? '#fff' : c.text }]}>{label}</Text>
    </Pressable>
  );
}

function StatusChip({ status, active, onPress }: { status: AgreementStatus; active: boolean; onPress: () => void }) {
  const color = STATUS_COLORS[status];
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active ? { backgroundColor: color } : { backgroundColor: c.backgroundElement, borderColor: color + '40', borderWidth: 1 },
      ]}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: active ? '#fff' : color, marginRight: 4 }} />
      <Text style={[styles.chipText, { color: active ? '#fff' : color }]}>{STATUS_LABELS[status]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingVertical: 10, gap: 10, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '800' },
  tabs: { flexDirection: 'row', padding: 3, borderRadius: 10 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabText: { fontWeight: '600', fontSize: 14 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  chipsRow: { gap: 6, paddingVertical: 2 },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  sortChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipText: { fontSize: 12, fontWeight: '600' },
  countryRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10 },
  countryName: { fontSize: 15, fontWeight: '700' },
  countryMeta: { fontSize: 12, marginTop: 2 },
  tagCard: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, minHeight: 64, justifyContent: 'center' },
  tagCardLabel: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
});
