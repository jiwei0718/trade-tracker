import { Text, View, StyleSheet } from 'react-native';
import { STATUS_COLORS, STATUS_LABELS } from '@/data/types';
import type { AgreementStatus } from '@/data/types';

export default function StatusBadge({ status, size = 'm' }: { status: AgreementStatus; size?: 's' | 'm' }) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];
  const small = size === 's';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '22',
          borderColor: color + '55',
          paddingVertical: small ? 2 : 4,
          paddingHorizontal: small ? 6 : 8,
        },
      ]}>
      <View style={[styles.dot, { backgroundColor: color, width: small ? 5 : 6, height: small ? 5 : 6 }]} />
      <Text style={[styles.text, { color, fontSize: small ? 10 : 12 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: { borderRadius: 999 },
  text: { fontWeight: '600' },
});
