import { useMemo, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';

import { STATUS_COLORS, STATUS_LABELS } from '@/data/types';
import type { AgreementStatus } from '@/data/types';
import { Colors } from '@/constants/theme';
import { useData } from '@/lib/data-context';

// Key parties shown in arc diagram (left column)
const PARTIES = [
  { code: 'EU',    label: '歐盟 (EU)' },
  { code: 'GB',    label: '英國 (UK)' },
  { code: 'US',    label: '美國 (US)' },
  { code: 'CA',    label: '加拿大 (CA)' },
  { code: 'MX',    label: '墨西哥 (MX)' },
  { code: 'BR',    label: '巴西 (BR)' },
  { code: 'AR',    label: '阿根廷 (AR)' },
  { code: 'CN',    label: '中國 (CN)' },
  { code: 'JP',    label: '日本 (JP)' },
  { code: 'KR',    label: '韓國 (KR)' },
  { code: 'IN',    label: '印度 (IN)' },
  { code: 'AU',    label: '澳洲 (AU)' },
  { code: 'NZ',    label: '紐西蘭 (NZ)' },
  { code: 'SG',    label: '新加坡 (SG)' },
  { code: 'ASEAN', label: '東協 (ASEAN)' },
  { code: 'CH',    label: '瑞士 (CH)' },
  { code: 'SA',    label: '沙烏地 (SA)' },
  { code: 'AE',    label: '阿聯酋 (AE)' },
  { code: 'TW',    label: '台灣 (TW)' },
  { code: 'VN',    label: '越南 (VN)' },
  { code: 'ID',    label: '印尼 (ID)' },
];

const FILTER_OPTIONS: { key: 'all' | 'post_lib' | 'in_force' | 'negotiating'; label: string }[] = [
  { key: 'all',         label: '全部' },
  { key: 'post_lib',    label: '解放日後' },
  { key: 'in_force',    label: '已生效' },
  { key: 'negotiating', label: '談判中' },
];

export default function ArcDiagram() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const screenW = Dimensions.get('window').width;
  const { agreements } = useData();
  const [filter, setFilter] = useState<'all' | 'post_lib' | 'in_force' | 'negotiating'>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return agreements.filter(a => {
      if (filter === 'post_lib') return a.tags?.includes('post-liberation-day');
      if (filter === 'in_force') return a.status === 'in_force';
      if (filter === 'negotiating') return a.status === 'negotiating';
      return true;
    });
  }, [filter]);

  // Layout: vertical list of parties on the left, arcs curving right.
  const labelW = 100;
  const arcsX = labelW + 6;
  const rightPad = 16;
  const arcWidth = screenW - arcsX - rightPad;
  const rowH = 28;
  const partyY = (code: string) => {
    const i = PARTIES.findIndex(p => p.code === code);
    return i === -1 ? -1 : i * rowH + rowH / 2 + 10;
  };

  // Build pair list from filtered agreements
  type Pair = { agreementId: string; aCode: string; bCode: string; status: AgreementStatus; vol: number };
  const pairs: Pair[] = [];
  filtered.forEach(a => {
    const codes = a.parties.filter(p => PARTIES.some(pp => pp.code === p));
    for (let i = 0; i < codes.length; i++) {
      for (let j = i + 1; j < Math.min(codes.length, 5); j++) {
        pairs.push({
          agreementId: a.id,
          aCode: codes[i],
          bCode: codes[j],
          status: a.status,
          vol: a.tradeVolume ?? 10,
        });
      }
    }
  });

  const svgHeight = PARTIES.length * rowH + 30;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {/* Filter chips */}
      <View style={[styles.filterBar, { backgroundColor: c.backgroundElement }]}>
        {FILTER_OPTIONS.map(opt => (
          <Pressable
            key={opt.key}
            onPress={() => setFilter(opt.key)}
            style={[
              styles.filterChip,
              filter === opt.key ? { backgroundColor: '#2563eb' } : { backgroundColor: c.background },
            ]}>
            <Text style={{ color: filter === opt.key ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.legend, { borderBottomColor: c.backgroundElement }]}>
        {(['in_force', 'concluded', 'signed', 'negotiating', 'suspended'] as AgreementStatus[]).map(s => (
          <View key={s} style={styles.legendItem}>
            <View style={{ width: 12, height: 3, backgroundColor: STATUS_COLORS[s], borderRadius: 2 }} />
            <Text style={{ color: c.textSecondary, fontSize: 10 }}>{STATUS_LABELS[s]}</Text>
          </View>
        ))}
      </View>

      <ScrollView>
        <Svg width={screenW} height={svgHeight} style={{ marginTop: 6 }}>
          {/* Arcs first (background) */}
          {pairs.map((p, i) => {
            const y1 = partyY(p.aCode);
            const y2 = partyY(p.bCode);
            if (y1 < 0 || y2 < 0) return null;
            const span = Math.abs(y2 - y1);
            const curve = Math.min(span * 0.6, arcWidth * 0.85);
            const color = STATUS_COLORS[p.status];
            const sw = Math.max(0.8, Math.min(4, Math.log10(p.vol + 1) * 1.1));
            const isSelected = selected === p.agreementId;
            return (
              <Path
                key={i}
                d={`M ${arcsX} ${y1} C ${arcsX + curve} ${y1}, ${arcsX + curve} ${y2}, ${arcsX} ${y2}`}
                fill="none"
                stroke={color}
                strokeWidth={isSelected ? sw + 1.5 : sw}
                strokeOpacity={selected ? (isSelected ? 0.95 : 0.12) : 0.5}
                onPress={() => setSelected(p.agreementId)}
              />
            );
          })}

          {/* Dots + labels */}
          {PARTIES.map((p, i) => {
            const y = i * rowH + rowH / 2 + 10;
            return (
              <G key={p.code} onPress={() => router.push(`/country/${p.code}`)}>
                <SvgText x={labelW - 4} y={y + 3} fontSize={11} textAnchor="end" fill={c.text}>
                  {p.label}
                </SvgText>
                <Circle cx={arcsX} cy={y} r={3.5} fill={c.text} />
              </G>
            );
          })}
        </Svg>
      </ScrollView>

      {/* Detail bar at bottom when selected */}
      {selected && (() => {
        const a = agreements.find(x => x.id === selected);
        if (!a) return null;
        return (
          <Pressable
            onPress={() => router.push(`/agreement/${a.id}`)}
            style={[styles.detailBar, { backgroundColor: c.backgroundElement }]}>
            <View style={[styles.dot, { backgroundColor: STATUS_COLORS[a.status] }]} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.text, fontWeight: '700', fontSize: 13 }} numberOfLines={1}>
                {a.nameZh}
              </Text>
              <Text style={{ color: c.textSecondary, fontSize: 11 }} numberOfLines={1}>
                {a.partyNamesZh.slice(0, 3).join(' · ')} · {STATUS_LABELS[a.status]}
                {a.tradeVolume ? ` · $${a.tradeVolume.toLocaleString()}億` : ''}
              </Text>
            </View>
            <Pressable onPress={() => setSelected(null)} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: c.textSecondary, fontSize: 18 }}>✕</Text>
            </Pressable>
          </Pressable>
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: { flexDirection: 'row', gap: 6, padding: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingBottom: 6, borderBottomWidth: 1 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  detailBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
