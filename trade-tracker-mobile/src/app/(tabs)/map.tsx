import { useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, useColorScheme, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

import { Colors } from '@/constants/theme';
import { getAllParties } from '@/lib/selectors';
import { useData } from '@/lib/data-context';

const REGIONS: Record<string, { name: string; codes: string[]; color: string }> = {
  Europe:      { name: '歐洲',     codes: ['EU', 'GB', 'CH', 'NO', 'IS', 'LI', 'TR', 'FR', 'DE', 'IT', 'BE', 'NL', 'LU'], color: '#3b82f6' },
  N_America:   { name: '北美',     codes: ['US', 'CA', 'MX'], color: '#f59e0b' },
  S_America:   { name: '南美',     codes: ['BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'PY', 'EC', 'BO', 'VE', 'CR', 'SV', 'GT', 'HN', 'NI', 'DO', 'PA'], color: '#10b981' },
  Asia:        { name: '亞洲',     codes: ['CN', 'JP', 'KR', 'IN', 'SG', 'VN', 'MY', 'TH', 'PH', 'ID', 'BN', 'HK', 'TW', 'PK', 'LA', 'KH', 'MM', 'ASEAN'], color: '#8b5cf6' },
  Oceania:     { name: '大洋洲',   codes: ['AU', 'NZ', 'PG'], color: '#06b6d4' },
  Middle_East: { name: '中東',     codes: ['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'IL', 'JO'], color: '#ef4444' },
  Africa:      { name: '非洲',     codes: ['ZA', 'AU-CONT', 'ACP', 'OACPS'], color: '#a16207' },
};

export default function MapTab() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const screenW = Dimensions.get('window').width;
  const { agreements } = useData();

  const parties = useMemo(() => getAllParties(agreements), [agreements]);

  // Group parties by region & compute aggregate trade volume per country
  const partyVolumes = useMemo(() => {
    const map = new Map<string, number>();
    agreements.forEach(a => {
      const vol = a.tradeVolume ?? 0;
      a.parties.forEach(code => {
        map.set(code, (map.get(code) ?? 0) + vol);
      });
    });
    return map;
  }, [agreements]);

  const regionGroups = useMemo(() => {
    return Object.entries(REGIONS).map(([key, info]) => {
      const items = parties
        .filter(p => info.codes.includes(p.code))
        .map(p => ({ ...p, volume: partyVolumes.get(p.code) ?? 0 }))
        .sort((a, b) => b.volume - a.volume);
      const totalVol = items.reduce((s, x) => s + x.volume, 0);
      return { key, ...info, items, totalVol };
    });
  }, [parties, partyVolumes]);

  const maxVol = Math.max(...regionGroups.map(r => r.totalVol));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: c.backgroundElement }]}>
        <Text style={[styles.title, { color: c.text }]}>貿易地圖</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>依地區與國家檢視協定覆蓋程度</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Region volume bars */}
        <View>
          <Text style={[styles.sectionTitle, { color: c.text }]}>各區域協定貿易總量</Text>
          <Svg width={screenW - 32} height={regionGroups.length * 38 + 10} style={{ marginTop: 8 }}>
            {regionGroups.map((r, i) => {
              const barW = (r.totalVol / maxVol) * (screenW - 180);
              const y = i * 38 + 6;
              return (
                <G key={r.key}>
                  <SvgText x={0} y={y + 16} fontSize={12} fill={c.text} fontWeight="600">{r.name}</SvgText>
                  <Rect x={62} y={y + 6} width={barW} height={18} fill={r.color} rx={4} />
                  <SvgText x={Math.max(barW + 68, 80)} y={y + 19} fontSize={10} fill={c.textSecondary}>
                    ${Math.round(r.totalVol / 1000)}兆 USD
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>

        {/* Region cards */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>區域國家</Text>
        {regionGroups.map(r => (
          <View key={r.key} style={[styles.regionCard, { backgroundColor: c.backgroundElement }]}>
            <View style={[styles.regionHeader, { borderBottomColor: c.background }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: r.color }} />
                <Text style={[styles.regionName, { color: c.text }]}>{r.name}</Text>
              </View>
              <Text style={{ color: c.textSecondary, fontSize: 11 }}>{r.items.length} 國</Text>
            </View>
            <View style={{ gap: 4, padding: 10 }}>
              {r.items.slice(0, 6).map(item => (
                <Pressable
                  key={item.code}
                  onPress={() => router.push(`/country/${item.code}`)}
                  style={styles.countryItem}>
                  <Text style={{ color: c.text, fontSize: 13, flex: 1 }}>{item.nameZh}</Text>
                  <Text style={{ color: c.textSecondary, fontSize: 11 }}>{item.count} 個 · ${Math.round(item.volume).toLocaleString()}億</Text>
                  <Ionicons name="chevron-forward" size={14} color={c.textSecondary} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

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
  sectionTitle: { fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  regionCard: { borderRadius: 12, overflow: 'hidden' },
  regionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1 },
  regionName: { fontSize: 15, fontWeight: '700' },
  countryItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 6, paddingVertical: 6 },
  arcCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12 },
});
