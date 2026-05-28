import { ScrollView, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { ERA_INFO } from '@/data/types';
import type { EraKey } from '@/data/types';
import { Colors } from '@/constants/theme';
import { getAgreementsByEra, getEffectiveDate } from '@/lib/selectors';
import AgreementCard from '@/components/agreement-card';
import { useData } from '@/lib/data-context';

export default function EraDetail() {
  const { key } = useLocalSearchParams<{ key: EraKey }>();
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { agreements } = useData();
  const info = ERA_INFO[key];
  const list = getAgreementsByEra(key, agreements);
  list.sort((a, b) => (getEffectiveDate(a) ?? '').localeCompare(getEffectiveDate(b) ?? ''));

  if (!info) {
    return <Text style={{ padding: 20, color: c.text }}>無此時期資料</Text>;
  }

  return (
    <>
      <Stack.Screen options={{ title: info.label }} />
      <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: '#2563eb15', borderColor: '#2563eb40' }]}>
          <Text style={[styles.range, { color: '#2563eb' }]}>{info.range}</Text>
          <Text style={[styles.label, { color: c.text }]}>{info.label}</Text>
          <Text style={[styles.tagline, { color: '#2563eb' }]}>{info.tagline}</Text>
          <Text style={[styles.summary, { color: c.text }]}>{info.summaryZh}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: c.text }]}>本時期協定（{list.length}）</Text>

        <View style={{ gap: 10 }}>
          {list.map(a => <AgreementCard key={a.id} agreement={a} />)}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  heroCard: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 6 },
  range: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  label: { fontSize: 22, fontWeight: '800' },
  tagline: { fontSize: 14, fontWeight: '600', fontStyle: 'italic' },
  summary: { fontSize: 13, lineHeight: 22, marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
});
