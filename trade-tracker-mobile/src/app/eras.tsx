import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ERA_INFO } from '@/data/types';
import { Colors } from '@/constants/theme';
import { getAgreementsByEra } from '@/lib/selectors';
import { useData } from '@/lib/data-context';

export default function Eras() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { agreements } = useData();

  const eras = Object.entries(ERA_INFO);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={[styles.intro, { color: c.text }]}>
        全球貿易協定的歷史可分為六個時期。每個時期反映當時的政治經濟氛圍與制度創新。
      </Text>

      {eras.map(([key, info]) => {
        const count = getAgreementsByEra(key as any, agreements).length;
        return (
          <Pressable
            key={key}
            onPress={() => router.push(`/era/${key}`)}
            style={[styles.eraCard, { backgroundColor: c.backgroundElement }]}>
            <View style={styles.eraHead}>
              <View>
                <Text style={[styles.eraLabel, { color: c.text }]}>{info.label}</Text>
                <Text style={[styles.eraRange, { color: c.textSecondary }]}>{info.range}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[styles.eraCount, { color: c.text }]}>{count}</Text>
                <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
              </View>
            </View>
            <Text style={[styles.eraTagline, { color: '#2563eb' }]}>{info.tagline}</Text>
            <Text style={[styles.eraSummary, { color: c.textSecondary }]} numberOfLines={3}>
              {info.summaryZh}
            </Text>
          </Pressable>
        );
      })}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, lineHeight: 22 },
  eraCard: { padding: 14, borderRadius: 12, gap: 6 },
  eraHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  eraLabel: { fontSize: 16, fontWeight: '800' },
  eraRange: { fontSize: 12, marginTop: 2 },
  eraCount: { fontSize: 18, fontWeight: '800' },
  eraTagline: { fontSize: 13, fontWeight: '600', fontStyle: 'italic' },
  eraSummary: { fontSize: 12, lineHeight: 18, marginTop: 4 },
});
