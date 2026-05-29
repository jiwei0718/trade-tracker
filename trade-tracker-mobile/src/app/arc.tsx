import { useMemo, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';

import { STATUS_COLORS, STATUS_LABELS } from '@/data/types';
import type { AgreementStatus } from '@/data/types';
import { Colors } from '@/constants/theme';
import { useData } from '@/lib/data-context';
import { getEffectiveDate } from '@/lib/selectors';
import { getAgreementTags } from '@/lib/issue-tags';
import { tagLabel } from '@/data/tags';
import YearRangeSlider from '@/components/year-range-slider';

// Key parties shown in arc diagram (left column)
const PARTIES = [
  { code: 'EU',    label: '歐盟 (EU)' },
  { code: 'UK',    label: '英國 (UK)' },
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
  { code: 'TW',    label: '臺灣 (TW)' },
  { code: 'VN',    label: '越南 (VN)' },
  { code: 'ID',    label: '印尼 (ID)' },
];

// Which milestone date the year-range filters on.
type EventBasis = 'any' | 'signed' | 'in_force' | 'concluded' | 'started';
const EVENT_OPTIONS: { key: EventBasis; label: string }[] = [
  { key: 'any',       label: '任意里程碑' },
  { key: 'signed',    label: '新簽署' },
  { key: 'in_force',  label: '新生效' },
  { key: 'concluded', label: '新完成談判' },
  { key: 'started',   label: '新啟動談判' },
];

export default function ArcDiagram() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const screenW = Dimensions.get('window').width;
  const { agreements } = useData();
  const [eventBasis, setEventBasis] = useState<EventBasis>('any');
  const [topicTag, setTopicTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const MIN_YEAR = 1947;
  const MAX_YEAR = 2026;
  const [yearFrom, setYearFrom] = useState(MIN_YEAR);
  const [yearTo, setYearTo] = useState(MAX_YEAR);

  // The date used for the year filter, based on the chosen event basis.
  const basisDate = (a: typeof agreements[number]): string | undefined => {
    if (eventBasis === 'any') return getEffectiveDate(a);
    return a.keyDates[eventBasis];
  };

  const filtered = useMemo(() => {
    return agreements.filter(a => {
      if (topicTag && !getAgreementTags(a).includes(topicTag)) return false;
      const d = basisDate(a);
      // When a specific milestone is required, the agreement must have it.
      if (eventBasis !== 'any' && !d) return false;
      if (d) {
        const yr = parseInt(d.split('-')[0], 10);
        if (yr < yearFrom || yr > yearTo) return false;
      }
      return true;
    });
  }, [eventBasis, topicTag, yearFrom, yearTo, agreements]);

  // Topic chips: issue tags present among the parties shown in the arc.
  const topicTags = useMemo(() => {
    const counts: Record<string, number> = {};
    agreements.forEach(a => {
      if (!a.parties.some(p => PARTIES.some(pp => pp.code === p))) return;
      getAgreementTags(a).forEach(t => { counts[t] = (counts[t] ?? 0) + 1; });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 24);
  }, [agreements]);

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
      {/* Event-basis chips: which milestone the year range applies to */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterBar, { backgroundColor: c.backgroundElement }]} contentContainerStyle={{ gap: 6, alignItems: 'center' }}>
        <Text style={{ color: c.textSecondary, fontSize: 11 }}>區間內</Text>
        {EVENT_OPTIONS.map(opt => (
          <Pressable
            key={opt.key}
            onPress={() => setEventBasis(opt.key)}
            style={[
              styles.filterChip,
              eventBasis === opt.key ? { backgroundColor: '#2563eb' } : { backgroundColor: c.background },
            ]}>
            <Text style={{ color: eventBasis === opt.key ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Year range slider */}
      <View style={[styles.sliderBar, { backgroundColor: c.backgroundElement }]}>
        <YearRangeSlider
          min={MIN_YEAR}
          max={MAX_YEAR}
          from={yearFrom}
          to={yearTo}
          onChange={(f, t) => { setYearFrom(f); setYearTo(t); }}
        />
      </View>

      {/* Topic chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterBar, { backgroundColor: c.backgroundElement }]} contentContainerStyle={{ gap: 6, alignItems: 'center' }}>
        <Ionicons name="pricetag" size={12} color={c.textSecondary} />
        <Pressable
          onPress={() => setTopicTag(null)}
          style={[styles.filterChip, !topicTag ? { backgroundColor: '#7c3aed' } : { backgroundColor: c.background }]}>
          <Text style={{ color: !topicTag ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>全部議題</Text>
        </Pressable>
        {topicTags.map(t => (
          <Pressable
            key={t}
            onPress={() => setTopicTag(topicTag === t ? null : t)}
            style={[styles.filterChip, topicTag === t ? { backgroundColor: '#7c3aed' } : { backgroundColor: c.background }]}>
            <Text style={{ color: topicTag === t ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>{tagLabel(t)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Result count */}
      <View style={{ paddingHorizontal: 12, paddingVertical: 4, backgroundColor: c.backgroundElement }}>
        <Text style={{ color: c.textSecondary, fontSize: 11 }}>
          {yearFrom}–{yearTo} 期間
          {eventBasis !== 'any' ? `「${EVENT_OPTIONS.find(o => o.key === eventBasis)?.label}」` : ''}
          {topicTag ? ` · 議題：${tagLabel(topicTag)}` : ''}
          ：{filtered.length} 個協定
        </Text>
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
  sliderBar: { paddingHorizontal: 12, paddingTop: 2, paddingBottom: 6 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingBottom: 6, borderBottomWidth: 1 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  detailBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
