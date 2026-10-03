import { Text, View, StyleSheet } from 'react-native';

import type { SourceTier } from '@/data/types';
import { TIER_COLORS, TIER_LABELS_ZH } from '@/data/source-tiers';

/** Small label showing how trustworthy a source is (官方 / 學術 / 媒體 / 一般). */
export default function TierChip({ tier }: { tier?: SourceTier }) {
  if (!tier) return null;
  const color = TIER_COLORS[tier];
  return (
    <View style={[styles.chip, { backgroundColor: color + '18', borderColor: color + '55' }]}>
      <Text style={[styles.text, { color }]}>{TIER_LABELS_ZH[tier]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, borderWidth: 1 },
  text: { fontSize: 11, fontWeight: '700' },
});
