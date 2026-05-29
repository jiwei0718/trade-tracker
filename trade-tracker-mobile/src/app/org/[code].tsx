import { useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, Linking, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { orgByCode, ORG_CATEGORY_LABELS } from '@/data/organizations';
import { countryDisplay } from '@/data/countries';
import { getAgreementsForOrg } from '@/lib/selectors';
import { Colors } from '@/constants/theme';
import AgreementCard from '@/components/agreement-card';
import { useData } from '@/lib/data-context';

export default function OrgProfile() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { agreements } = useData();
  const org = orgByCode(code ?? '');
  const related = useMemo(() => (org ? getAgreementsForOrg(org.code, agreements) : []), [org, agreements]);

  if (!org) {
    return (
      <>
        <Stack.Screen options={{ title: '國際組織' }} />
        <View style={{ flex: 1, backgroundColor: c.background, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: c.textSecondary }}>找不到此組織（{code}）</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: org.abbrZh ?? org.nameZh }} />
      <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Hero */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <View style={[styles.badge, { backgroundColor: '#0ea5e9' }]}>
              <Text style={styles.badgeText}>{ORG_CATEGORY_LABELS[org.category]}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: c.backgroundElement }]}>
              <Text style={[styles.badgeText, { color: c.textSecondary }]}>國際組織</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: c.text }]}>{org.nameZh}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{org.name}（{org.abbr}）</Text>
        </View>

        {/* Facts */}
        <View style={[styles.factCard, { backgroundColor: c.backgroundElement }]}>
          {!!org.founded && <Fact c={c} icon="calendar-outline" label="成立" value={`${org.founded} 年`} />}
          {!!org.hq && <Fact c={c} icon="location-outline" label="總部" value={org.hq} />}
          <Fact c={c} icon="people-outline" label="會員" value={org.members.length > 0 ? `${org.members.length} 個會員國` : '近乎全球'} />
        </View>

        {/* Description */}
        <Text style={{ color: c.text, fontSize: 14, lineHeight: 22 }}>{org.descriptionZh}</Text>

        {/* Source link */}
        {!!org.sourceUrl && (
          <Pressable
            onPress={() => org.sourceUrl && Linking.openURL(org.sourceUrl)}
            style={[styles.docRow, { backgroundColor: '#0ea5e915', borderColor: '#0ea5e940', borderWidth: 1 }]}>
            <Ionicons name="link-outline" size={16} color="#0ea5e9" />
            <Text style={{ color: '#0369a1', fontSize: 13, fontWeight: '600', flex: 1 }} numberOfLines={1}>官方網站</Text>
            <Ionicons name="open-outline" size={15} color="#0ea5e9" />
          </Pressable>
        )}

        {/* Members */}
        {org.members.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: c.text }]}>會員國（{org.members.length}）</Text>
            <View style={styles.chipsWrap}>
              {org.members.map(m => (
                <Pressable
                  key={m}
                  onPress={() => router.push(`/country/${m}`)}
                  style={[styles.party, { backgroundColor: c.backgroundElement }]}>
                  <Text style={{ color: c.text, fontSize: 13 }}>{countryDisplay(m, m)}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Related agreements */}
        <View>
          <Text style={[styles.sectionTitle, { color: c.text }]}>相關協定（{related.length}）</Text>
          {related.length === 0 ? (
            <Text style={{ color: c.textSecondary, fontSize: 13 }}>本組織未直接作為任何協定的締約方。</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {related.map(a => <AgreementCard key={a.id} agreement={a} compact />)}
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

function Fact({ c, icon, label, value }: { c: any; icon: any; label: string; value: string }) {
  return (
    <View style={styles.factRow}>
      <Ionicons name={icon} size={15} color={c.textSecondary} />
      <Text style={{ color: c.textSecondary, fontSize: 13, width: 44 }}>{label}</Text>
      <Text style={{ color: c.text, fontSize: 13, fontWeight: '600', flex: 1 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  factCard: { borderRadius: 12, padding: 12, gap: 8 },
  factRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  party: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10 },
});
