import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Focus = `node:${string}` | `agreement:${string}`;

/** 「在地球儀上查看」: opens the globe tab with a country, bloc or agreement selected. */
export default function GlobeLink({ focus, label = '在地球儀上查看' }: { focus: Focus; label?: string }) {
  return (
    <Pressable
      // `t` makes a repeat visit with the same selection fly there again.
      onPress={() => router.navigate({ pathname: '/globe', params: { focus, t: String(Date.now()) } })}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.6 }]}
      accessibilityRole="link">
      <Ionicons name="earth" size={14} color="#2563eb" />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#2563eb55', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5,
  },
  text: { color: '#2563eb', fontSize: 12, fontWeight: '700' },
});
