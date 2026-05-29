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
import { tagLabel, tagCategory, TAG_CATEGORY_LABELS, TAG_CATEGORY_ORDER } from '@/data/tags';
import type { TagCategory } from '@/data/tags';
import { getAgreementTags } from '@/lib/issue-tags';
import { ORGANIZATIONS, ORG_CATEGORY_LABELS } from '@/data/organizations';

type Mode = 'agreements' | 'orgs' | 'countries' | 'tags';
type SortKey = 'newest' | 'oldest' | 'volume' | 'name';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: '最新→最舊' },
  { key: 'oldest', label: '最舊→最新' },
  { key: 'volume', label: '貿易量' },
  { key: 'name', label: '名稱' },
];

const STATUSES: AgreementStatus[] = ['in_force', 'concluded', 'signed', 'negotiating', 'suspended', 'cancelled', 'superseded'];

const MODE_TABS: { key: Mode; label: string }[] = [
  { key: 'agreements', label: '協定' },
  { key: 'orgs', label: '組織' },
  { key: 'countries', label: '國家' },
  { key: 'tags', label: '議題' },
];

export default function Explore() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { agreements } = useData();
  const [mode, setMode] = useState<Mode>('agreements');
  const [query, setQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<Set<AgreementStatus>>(new Set());
  const [eraFilter, setEraFilter] = useState<EraKey | null>(null);
  const [tagFilters, setTagFilters] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('newest');

  const parties = useMemo(() => getAllParties(agreements), [agreements]);

  const toggleTag = (t: string) =>
    setTagFilters(prev => {
      const n = new Set(prev);
      n.has(t) ? n.delete(t) : n.add(t);
      return n;
    });
  const addTag = (t: string) =>
    setTagFilters(prev => {
      const n = new Set(prev);
      n.add(t);
      return n;
    });

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
    if (tagFilters.size) {
      const wanted = [...tagFilters];
      list = list.filter(a => { const t = getAgreementTags(a); return wanted.every(w => t.includes(w)); });
    }
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
  }, [query, statusFilters, eraFilter, tagFilters, sortKey, agreements]);

  const partyResults = useMemo(() => filterPartiesByQuery(parties, query), [query, parties]);

  const orgResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORGANIZATIONS.filter(o =>
      !q || o.nameZh.includes(query) || (o.abbrZh ?? '').includes(query) ||
      o.name.toLowerCase().includes(q) || o.abbr.toLowerCase().includes(q) || o.code.toLowerCase().includes(q),
    );
  }, [query]);

  // All tags with counts, grouped by category, for the 議題 (topics) mode.
  const tagsByCat = useMemo(() => {
    const counts: Record<string, number> = {};
    agreements.forEach(a => getAgreementTags(a).forEach(t => { counts[t] = (counts[t] ?? 0) + 1; }));
    let entries = Object.entries(counts).map(([tag, count]) => ({ tag, count, label: tagLabel(tag), cat: tagCategory(tag) }));
    if (query) entries = entries.filter(e => e.label.includes(query) || e.tag.includes(query.toLowerCase()));
    entries.sort((a, b) => b.count - a.count);
    const groups = {} as Record<TagCategory, { tag: string; count: number; label: string }[]>;
    entries.forEach(e => { (groups[e.cat] ??= []).push(e); });
    const total = entries.length;
    return { groups, total };
  }, [agreements, query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: c.backgroundElement }]}>
        <Text style={[styles.title, { color: c.text }]}>瀏覽</Text>

        <View style={[styles.tabs, { backgroundColor: c.backgroundElement }]}>
          {MODE_TABS.map(t => (
            <Pressable
              key={t.key}
              onPress={() => setMode(t.key)}
              style={[styles.tab, mode === t.key && { backgroundColor: c.background }]}>
              <Text style={[styles.tabText, { color: mode === t.key ? c.text : c.textSecondary }]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.searchBox, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name="search" size={16} color={c.textSecondary} />
          <TextInput
            placeholder={
              mode === 'agreements' ? '搜尋協定名稱、國家…'
              : mode === 'tags' ? '搜尋議題…'
              : mode === 'orgs' ? '搜尋國際組織…'
              : '搜尋國家…'}
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
                  onPress={() => toggleTag(t)}
                  style={[
                    styles.chip,
                    tagFilters.has(t) ? { backgroundColor: '#7c3aed' } : { backgroundColor: c.backgroundElement },
                  ]}>
                  <Text style={{ color: tagFilters.has(t) ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>
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
            <View style={{ marginBottom: 4, gap: 8 }}>
              {tagFilters.size > 0 && (
                <View style={styles.activeBar}>
                  <Text style={{ color: c.textSecondary, fontSize: 12 }}>篩選中：</Text>
                  {[...tagFilters].map(t => (
                    <Pressable key={t} onPress={() => toggleTag(t)} style={styles.activePill}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{tagLabel(t)}</Text>
                      <Ionicons name="close" size={13} color="#fff" />
                    </Pressable>
                  ))}
                  <Pressable onPress={() => setTagFilters(new Set())} hitSlop={6}>
                    <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '700' }}>清除全部</Text>
                  </Pressable>
                </View>
              )}
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>共 {filtered.length} 個協定</Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={{ color: c.textSecondary, textAlign: 'center', marginTop: 40 }}>沒有符合條件的協定</Text>
          }
        />
      ) : mode === 'orgs' ? (
        <FlatList
          key="list-orgs"
          data={orgResults}
          keyExtractor={o => o.code}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/org/${item.code}`)}
              style={({ pressed }) => [
                styles.countryRow,
                { backgroundColor: c.backgroundElement, opacity: pressed ? 0.7 : 1 },
              ]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.countryName, { color: c.text }]}>{item.nameZh}（{item.abbr}）</Text>
                <Text style={[styles.countryMeta, { color: c.textSecondary }]}>
                  {ORG_CATEGORY_LABELS[item.category]} · {item.members.length > 0 ? `${item.members.length} 會員國` : '近乎全球'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
            </Pressable>
          )}
          ListHeaderComponent={
            <Text style={{ color: c.textSecondary, fontSize: 12, marginBottom: 4 }}>
              國際組織 · 共 {orgResults.length} 個（點選查看會員國與相關協定）
            </Text>
          }
        />
      ) : mode === 'tags' ? (
        <ScrollView key="list-tags-cat" contentContainerStyle={{ padding: 16, gap: 16 }}>
          <Text style={{ color: c.textSecondary, fontSize: 12 }}>
            依議題瀏覽 · 共 {tagsByCat.total} 個議題（點選即加入篩選；可多選）
          </Text>
          {TAG_CATEGORY_ORDER.map(cat => {
            const items = tagsByCat.groups[cat];
            if (!items || items.length === 0) return null;
            return (
              <View key={cat} style={{ gap: 8 }}>
                <Text style={[styles.catTitle, { color: c.text }]}>{TAG_CATEGORY_LABELS[cat]}</Text>
                <View style={styles.tagFlow}>
                  {items.map(item => (
                    <Pressable
                      key={item.tag}
                      onPress={() => { addTag(item.tag); setQuery(''); setMode('agreements'); }}
                      style={({ pressed }) => [
                        styles.tagFlowCard,
                        {
                          backgroundColor: tagFilters.has(item.tag) ? '#7c3aed' : '#7c3aed15',
                          borderColor: '#7c3aed40',
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}>
                      <Text style={{ color: tagFilters.has(item.tag) ? '#fff' : c.text, fontSize: 13, fontWeight: '600' }}>
                        {item.label}
                      </Text>
                      <Text style={{ color: tagFilters.has(item.tag) ? '#e9d5ff' : '#7c3aed', fontSize: 12, fontWeight: '700' }}>
                        {item.count}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          })}
          <View style={{ height: 24 }} />
        </ScrollView>
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
  activeBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#7c3aed', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  countryRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10 },
  countryName: { fontSize: 15, fontWeight: '700' },
  countryMeta: { fontSize: 12, marginTop: 2 },
  catTitle: { fontSize: 15, fontWeight: '800' },
  tagFlow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagFlowCard: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
});
