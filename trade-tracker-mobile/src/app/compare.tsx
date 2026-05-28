import { useState, useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, TextInput, useColorScheme, FlatList, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getAgreementById, search } from '@/lib/selectors';
import { useData } from '@/lib/data-context';
import { STATUS_LABELS, TYPE_LABELS } from '@/data/types';
import { Colors } from '@/constants/theme';
import StatusBadge from '@/components/status-badge';

export default function Compare() {
  const { seed } = useLocalSearchParams<{ seed?: string }>();
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { agreements } = useData();
  const [picked, setPicked] = useState<string[]>(seed ? [seed] : []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const compareList = useMemo(
    () => picked.map(id => getAgreementById(id, agreements)!).filter(Boolean),
    [picked, agreements],
  );

  const searchResults = useMemo(() => {
    let list = query ? search(query, agreements) : agreements.slice(0, 30);
    return list.filter(a => !picked.includes(a.id));
  }, [query, picked, agreements]);

  const add = (id: string) => {
    if (picked.length >= 3) return;
    setPicked([...picked, id]);
    setPickerOpen(false);
    setQuery('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} horizontal={false}>
        <Text style={[styles.intro, { color: c.textSecondary }]}>
          選擇 2-3 個協定，並列比較它們的狀態、覆蓋範圍、貿易量。
        </Text>

        {compareList.length === 0 && (
          <View style={[styles.emptyBox, { backgroundColor: c.backgroundElement }]}>
            <Ionicons name="swap-horizontal" size={36} color={c.textSecondary} />
            <Text style={{ color: c.text, fontWeight: '700', marginTop: 8 }}>從新增協定開始</Text>
            <Text style={{ color: c.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 4 }}>
              點下方按鈕加入第一個協定
            </Text>
          </View>
        )}

        {/* Comparison columns: horizontal scroll */}
        {compareList.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
            {compareList.map(a => (
              <View key={a.id} style={[styles.col, { backgroundColor: c.backgroundElement }]}>
                <Pressable
                  onPress={() => setPicked(picked.filter(id => id !== a.id))}
                  style={styles.closeBtn}
                  hitSlop={8}>
                  <Ionicons name="close-circle" size={20} color={c.textSecondary} />
                </Pressable>
                <Text style={[styles.colTitle, { color: c.text }]} numberOfLines={3}>{a.nameZh}</Text>
                {a.shortName && (
                  <Text style={[styles.colSub, { color: c.textSecondary }]}>{a.shortName}</Text>
                )}
                <View style={{ marginTop: 4 }}><StatusBadge status={a.status} size="s" /></View>

                <Row k="類型" v={TYPE_LABELS[a.type]} c={c} />
                <Row k="締約方" v={`${a.partyNamesZh.length} 方`} c={c} />
                <Row k="貿易量" v={a.tradeVolume ? `$${a.tradeVolume.toLocaleString()}億` : '—'} c={c} />
                <Row k="談判啟動" v={a.keyDates.started ?? '—'} c={c} />
                <Row k="簽署" v={a.keyDates.signed ?? '—'} c={c} />
                <Row k="生效" v={a.keyDates.in_force ?? '—'} c={c} />
                <Row k="條款數" v={String(a.keyProvisions?.length ?? 0)} c={c} />

                <Text style={[styles.colDesc, { color: c.textSecondary }]} numberOfLines={6}>
                  {a.descriptionZh}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Add button */}
        {picked.length < 3 && (
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={[styles.addBtn, { borderColor: c.backgroundElement, backgroundColor: c.backgroundElement }]}>
            <Ionicons name="add-circle" size={20} color="#2563eb" />
            <Text style={{ color: '#2563eb', fontWeight: '700' }}>
              新增協定（最多 3 個）
            </Text>
          </Pressable>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Picker modal */}
      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={{ flex: 1, backgroundColor: c.background, paddingTop: 40 }}>
          <View style={[styles.modalHeader, { borderBottomColor: c.backgroundElement }]}>
            <Pressable onPress={() => setPickerOpen(false)} hitSlop={10}>
              <Text style={{ color: '#2563eb', fontSize: 15 }}>取消</Text>
            </Pressable>
            <Text style={{ color: c.text, fontWeight: '800', fontSize: 16 }}>選擇協定</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={{ padding: 12 }}>
            <View style={[styles.searchBox, { backgroundColor: c.backgroundElement }]}>
              <Ionicons name="search" size={16} color={c.textSecondary} />
              <TextInput
                placeholder="搜尋協定…"
                placeholderTextColor={c.textSecondary}
                value={query}
                onChangeText={setQuery}
                style={{ flex: 1, color: c.text, fontSize: 14 }}
                autoFocus
              />
            </View>
          </View>
          <FlatList
            data={searchResults}
            keyExtractor={a => a.id}
            contentContainerStyle={{ padding: 12, gap: 6 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => add(item.id)} style={[styles.pickerRow, { backgroundColor: c.backgroundElement }]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: c.text, fontWeight: '600', fontSize: 14 }} numberOfLines={1}>
                    {item.nameZh}
                  </Text>
                  <Text style={{ color: c.textSecondary, fontSize: 11, marginTop: 2 }}>
                    {STATUS_LABELS[item.status]} · {item.partyNamesZh.slice(0, 3).join('、')}
                  </Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color="#2563eb" />
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

function Row({ k, v, c }: { k: string; v: string; c: any }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowKey, { color: c.textSecondary }]}>{k}</Text>
      <Text style={[styles.rowVal, { color: c.text }]}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 13 },
  emptyBox: { padding: 40, borderRadius: 14, alignItems: 'center' },
  col: { width: 260, padding: 14, borderRadius: 12, gap: 8 },
  closeBtn: { position: 'absolute', top: 8, right: 8, zIndex: 10 },
  colTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20, paddingRight: 22 },
  colSub: { fontSize: 11 },
  colDesc: { fontSize: 12, lineHeight: 18, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb' },
  rowKey: { fontSize: 11 },
  rowVal: { fontSize: 12, fontWeight: '600' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10 },
});
