import { useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { getAgreementsForParty, getEffectiveDate } from '@/lib/selectors';
import { STATUS_COLORS, STATUS_LABELS } from '@/data/types';
import { Colors } from '@/constants/theme';
import AgreementCard from '@/components/agreement-card';
import { useData } from '@/lib/data-context';
import { countryDisplay } from '@/data/countries';

export default function CountryProfile() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { agreements } = useData();
  const list = useMemo(() => getAgreementsForParty(code ?? '', agreements), [code, agreements]);

  // Canonical Chinese name from the registry (falls back to stored / code)
  const countryName = useMemo(() => {
    let fallback = code;
    for (const a of list) {
      const i = a.parties.indexOf(code ?? '');
      if (i !== -1) { fallback = a.partyNamesZh[i] ?? code; break; }
    }
    return countryDisplay(code ?? '', fallback);
  }, [list, code]);

  // Status breakdown
  const breakdown: Record<string, number> = {};
  list.forEach(a => { breakdown[a.status] = (breakdown[a.status] ?? 0) + 1; });

  // Sort agreements by date descending — group by year for timeline feel
  const byYear: Record<string, typeof list> = {};
  list.forEach(a => {
    const d = getEffectiveDate(a) ?? '?';
    const year = d.split('-')[0];
    (byYear[year] ??= []).push(a);
  });
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <Stack.Screen options={{ title: String(countryName) }} />
      <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Hero */}
        <View>
          <Text style={[styles.countryName, { color: c.text }]}>{countryName}</Text>
          <Text style={[styles.meta, { color: c.textSecondary }]}>
            共 {list.length} 個協定的締約方
          </Text>
        </View>

        {/* Breakdown chips */}
        <View style={styles.chipsWrap}>
          {Object.entries(breakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([status, count]) => {
              const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS] ?? '#999';
              return (
                <View key={status} style={[styles.chip, { backgroundColor: color + '20', borderColor: color + '40' }]}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
                  <Text style={[styles.chipText, { color }]}>
                    {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}: {count}
                  </Text>
                </View>
              );
            })}
        </View>

        {/* Timeline: agreements grouped by year */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>時間軸</Text>

        {years.map(year => (
          <View key={year} style={styles.yearBlock}>
            <View style={styles.yearHeader}>
              <View style={[styles.yearDot, { backgroundColor: '#2563eb' }]} />
              <Text style={[styles.yearLabel, { color: c.text }]}>{year}</Text>
              <View style={[styles.yearLine, { backgroundColor: c.backgroundElement }]} />
            </View>
            <View style={{ gap: 10, marginLeft: 18 }}>
              {byYear[year].map(a => (
                <AgreementCard key={a.id} agreement={a} compact />
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  countryName: { fontSize: 26, fontWeight: '800' },
  meta: { fontSize: 13, marginTop: 4 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  yearBlock: { gap: 8 },
  yearHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  yearDot: { width: 10, height: 10, borderRadius: 5 },
  yearLabel: { fontSize: 15, fontWeight: '800', minWidth: 56 },
  yearLine: { flex: 1, height: 1 },
});
