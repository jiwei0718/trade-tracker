import { useMemo, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

import { Colors } from '@/constants/theme';
import { getAllParties, getEffectiveDate } from '@/lib/selectors';
import { useData } from '@/lib/data-context';
import { membersOf } from '@/data/organizations';
import { useIsDesktop, usePageWidth } from '@/hooks/use-desktop';
import YearRangeSlider from '@/components/year-range-slider';

// Country and regional-bloc codes per region. Bloc member lists come from the
// organizations registry so whole continents are covered (not a hand-picked few).
const REGIONS: { key: string; name: string; color: string; codes: Set<string> }[] = [
  { key: 'europe', name: '歐洲', color: '#3b82f6', codes: new Set([
    ...membersOf('EU'), ...membersOf('EFTA'), 'EU', 'EFTA', 'UK', 'TR', 'RU', 'UA', 'BY', 'MD', 'GE', 'AM', 'AZ',
    'RS', 'BA', 'ME', 'MK', 'AL', 'XK', 'AD', 'SM', 'MC', 'FO']) },
  { key: 'n_america', name: '北美', color: '#f59e0b', codes: new Set(['US', 'CA', 'MX']) },
  { key: 'latin', name: '中南美洲', color: '#10b981', codes: new Set([
    ...membersOf('MERCOSUR'), 'MERCOSUR', 'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'PY', 'EC', 'BO', 'VE', 'CR', 'SV', 'GT',
    'HN', 'NI', 'DO', 'PA', 'CU', 'JM', 'TT', 'BB', 'BS', 'BZ', 'GY', 'SR', 'HT', 'AG', 'DM', 'GD', 'KN', 'LC', 'VC']) },
  { key: 'asia', name: '亞洲', color: '#8b5cf6', codes: new Set([
    ...membersOf('ASEAN'), 'ASEAN', 'CN', 'JP', 'KR', 'IN', 'TW', 'HK', 'MO', 'PK', 'BD', 'LK', 'NP', 'BT', 'MV', 'MN',
    'KZ', 'KG', 'TJ', 'UZ', 'TM', 'AF', 'TL']) },
  { key: 'oceania', name: '大洋洲', color: '#06b6d4', codes: new Set([
    'AU', 'NZ', 'PG', 'FJ', 'WS', 'TO', 'VU', 'SB', 'KI', 'TV', 'NR', 'PW', 'MH', 'FM', 'CK', 'NU']) },
  { key: 'middle_east', name: '中東', color: '#ef4444', codes: new Set([
    ...membersOf('GCC'), 'GCC', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'IL', 'JO', 'LB', 'SY', 'IQ', 'IR', 'YE', 'PS']) },
  { key: 'africa', name: '非洲', color: '#a16207', codes: new Set([...membersOf('AU-CONT'), 'AU-CONT']) },
];

const LABEL_W = 70;   // region name column in the bar chart
const VALUE_W = 80;   // count label after each bar

export default function MapTab() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const desktop = useIsDesktop();
  const page = usePageWidth(1200);
  const { agreements } = useData();
  // Measure the real space available (the window width includes the desktop sidebar).
  // Until the first layout pass reports a width, draw with a conservative estimate.
  const { width: windowW } = useWindowDimensions();
  const [measuredW, setMeasuredW] = useState(0);
  const chartW = measuredW || (desktop ? 420 : Math.max(0, windowW - 32));

  const MIN_YEAR = 1947;
  const MAX_YEAR = 2026;
  const [yearFrom, setYearFrom] = useState(MIN_YEAR);
  const [yearTo, setYearTo] = useState(MAX_YEAR);

  // Agreements whose effective date falls within the selected year range
  const inRange = useMemo(() => {
    return agreements.filter(a => {
      const d = getEffectiveDate(a);
      if (!d) return false;
      const yr = parseInt(d.split('-')[0], 10);
      return yr >= yearFrom && yr <= yearTo;
    });
  }, [agreements, yearFrom, yearTo]);

  const parties = useMemo(() => getAllParties(inRange), [inRange]);

  // Count agreements per party within range
  const partyCounts = useMemo(() => {
    const m = new Map<string, number>();
    inRange.forEach(a => a.parties.forEach(code => m.set(code, (m.get(code) ?? 0) + 1)));
    return m;
  }, [inRange]);

  // Per region: distinct agreements with at least one party there (each agreement counted once).
  const regionGroups = useMemo(() => REGIONS.map(r => {
    const items = parties
      .filter(p => r.codes.has(p.code))
      .map(p => ({ ...p, count: partyCounts.get(p.code) ?? 0 }))
      .sort((a, b) => b.count - a.count);
    const agreementCount = inRange.filter(a => a.parties.some(code => r.codes.has(code))).length;
    return { ...r, items, agreementCount };
  }), [parties, partyCounts, inRange]);

  const maxCount = Math.max(1, ...regionGroups.map(r => r.agreementCount));
  const barMax = Math.max(0, chartW - LABEL_W - VALUE_W);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: c.backgroundElement }]}>
        <View style={page}>
          <Text style={[styles.title, { color: c.text }]}>貿易地圖</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>依地區與國家檢視協定覆蓋程度</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[{ padding: 16, gap: 16 }, page]}>
        <View style={desktop ? styles.topRow : { gap: 16 }}>
          {/* Year range slider */}
          <View style={[styles.sliderCard, { backgroundColor: c.backgroundElement }, desktop && { flex: 1 }]}>
            <Text style={[styles.sliderTitle, { color: c.text }]}>時間區間</Text>
            <YearRangeSlider
              min={MIN_YEAR}
              max={MAX_YEAR}
              from={yearFrom}
              to={yearTo}
              onChange={(f, t) => { setYearFrom(f); setYearTo(t); }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={{ color: c.textSecondary, fontSize: 12 }}>
                此區間內 <Text style={{ color: c.text, fontWeight: '800' }}>{inRange.length}</Text> 個協定
              </Text>
              {(yearFrom !== MIN_YEAR || yearTo !== MAX_YEAR) && (
                <Pressable onPress={() => { setYearFrom(MIN_YEAR); setYearTo(MAX_YEAR); }}>
                  <Text style={{ color: '#2563eb', fontSize: 12, fontWeight: '600' }}>重置</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Agreements per region */}
          <View style={desktop && { flex: 1 }} onLayout={e => setMeasuredW(e.nativeEvent.layout.width)}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>各區域參與的協定數</Text>
            <Text style={{ color: c.textSecondary, fontSize: 11, marginTop: 2 }}>
              跨區域協定(例如歐盟–日本)會同時計入兩個區域
            </Text>
            {chartW > 0 && (
              <Svg width={chartW} height={regionGroups.length * 34 + 6} style={{ marginTop: 8 }}>
                {regionGroups.map((r, i) => {
                  const barW = (r.agreementCount / maxCount) * barMax;
                  const y = i * 34 + 4;
                  return (
                    <G key={r.key}>
                      <SvgText x={0} y={y + 17} fontSize={12} fill={c.text} fontWeight="600">{r.name}</SvgText>
                      <Rect x={LABEL_W} y={y + 5} width={Math.max(barW, 2)} height={18} fill={r.color} rx={4} />
                      <SvgText x={LABEL_W + barW + 6} y={y + 18} fontSize={11} fill={c.textSecondary}>
                        {r.agreementCount} 個協定
                      </SvgText>
                    </G>
                  );
                })}
              </Svg>
            )}
          </View>
        </View>

        {/* Region cards */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>區域國家</Text>
        <View style={styles.regionGrid}>
          {regionGroups.map(r => (
            <View
              key={r.key}
              style={[styles.regionCard, { backgroundColor: c.backgroundElement }, desktop ? styles.regionCardDesktop : { width: '100%' }]}>
              <View style={[styles.regionHeader, { borderBottomColor: c.background }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: r.color }} />
                  <Text style={[styles.regionName, { color: c.text }]}>{r.name}</Text>
                </View>
                <Text style={{ color: c.textSecondary, fontSize: 11 }}>{r.items.length} 個國家/組織</Text>
              </View>
              <View style={{ gap: 4, padding: 10 }}>
                {r.items.slice(0, 6).map(item => (
                  <Pressable
                    key={item.code}
                    onPress={() => router.push(`/country/${item.code}`)}
                    style={styles.countryItem}>
                    <Text style={{ color: c.text, fontSize: 13, flex: 1 }}>{item.nameZh}</Text>
                    <Text style={{ color: c.textSecondary, fontSize: 11 }}>{item.count} 個協定</Text>
                    <Ionicons name="chevron-forward" size={14} color={c.textSecondary} />
                  </Pressable>
                ))}
                {r.items.length === 0 && (
                  <Text style={{ color: c.textSecondary, fontSize: 12, padding: 6 }}>此區間內沒有協定</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Arc CTA */}
        <Pressable
          onPress={() => router.push('/arc')}
          style={[styles.arcCta, { backgroundColor: '#7c3aed' }]}>
          <Ionicons name="git-network" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700' }}>查看貿易協定關聯圖</Text>
          <Text style={{ color: '#fff', fontSize: 11, opacity: 0.8 }}>（經濟學人風格）</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  topRow: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  sliderCard: { padding: 14, borderRadius: 12, gap: 6 },
  sliderTitle: { fontSize: 14, fontWeight: '800' },
  regionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  regionCard: { borderRadius: 12, overflow: 'hidden' },
  regionCardDesktop: { flexBasis: '31%', flexGrow: 1, minWidth: 280 },
  regionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1 },
  regionName: { fontSize: 15, fontWeight: '700' },
  countryItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 6, paddingVertical: 6 },
  arcCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12 },
});
