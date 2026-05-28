import { Pressable, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import type { TradeAgreement } from '@/data/types';
import { TYPE_LABELS } from '@/data/types';
import StatusBadge from './status-badge';
import { useWatchlist } from '@/lib/watchlist';
import { getEffectiveDate } from '@/lib/selectors';
import { Colors } from '@/constants/theme';

interface Props {
  agreement: TradeAgreement;
  compact?: boolean;
}

export default function AgreementCard({ agreement: a, compact }: Props) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { hasItem, toggle } = useWatchlist();
  const starred = hasItem(a.id);
  const date = getEffectiveDate(a);

  return (
    <Pressable
      onPress={() => router.push(`/agreement/${a.id}`)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: c.background, borderColor: c.backgroundElement, opacity: pressed ? 0.7 : 1 },
      ]}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>{a.nameZh}</Text>
          {a.shortName && (
            <Text style={[styles.subtitle, { color: c.textSecondary }]}>{a.shortName}</Text>
          )}
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggle(a.id);
          }}
          hitSlop={10}
          style={styles.starBtn}>
          <Ionicons
            name={starred ? 'star' : 'star-outline'}
            size={20}
            color={starred ? '#f59e0b' : c.textSecondary}
          />
        </Pressable>
      </View>

      <View style={styles.badges}>
        <StatusBadge status={a.status} size="s" />
        <Text style={[styles.meta, { color: c.textSecondary }]}>· {TYPE_LABELS[a.type]}</Text>
        {date && <Text style={[styles.meta, { color: c.textSecondary }]}>· {date}</Text>}
        {a.tradeVolume && (
          <Text style={[styles.meta, { color: c.textSecondary }]}>· ${a.tradeVolume.toLocaleString()}億</Text>
        )}
      </View>

      {!compact && (
        <View style={styles.parties}>
          {a.partyNamesZh.slice(0, 4).map((p, i) => (
            <View key={i} style={[styles.party, { backgroundColor: c.backgroundElement }]}>
              <Text style={[styles.partyText, { color: c.text }]}>{p}</Text>
            </View>
          ))}
          {a.partyNamesZh.length > 4 && (
            <Text style={[styles.meta, { color: c.textSecondary }]}>+{a.partyNamesZh.length - 4}</Text>
          )}
        </View>
      )}

      {a.tags?.includes('post-liberation-day') && (
        <Text style={styles.tagPostLib}>★ 解放日後新達成</Text>
      )}
      {a.tags?.includes('mile-stone') && !a.tags?.includes('post-liberation-day') && (
        <Text style={styles.tagMilestone}>◆ 歷史里程碑</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  subtitle: { fontSize: 12, marginTop: 2 },
  starBtn: { padding: 2 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 },
  meta: { fontSize: 12 },
  parties: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  party: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  partyText: { fontSize: 11 },
  tagPostLib: { color: '#dc2626', fontSize: 11, fontWeight: '700' },
  tagMilestone: { color: '#7c3aed', fontSize: 11, fontWeight: '700' },
});
