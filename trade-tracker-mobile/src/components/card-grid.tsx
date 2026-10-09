import { Children, type ReactNode } from 'react';
import { View } from 'react-native';

import { useIsDesktop } from '@/hooks/use-desktop';

/** Cards in two columns on desktop, one column on phones. */
export default function CardGrid({ children, gap = 8 }: { children: ReactNode; gap?: number }) {
  const desktop = useIsDesktop();
  const items = Children.toArray(children);
  if (!desktop) return <View style={{ gap }}>{items}</View>;

  const rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <View style={{ gap: gap + 2 }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: gap + 2, alignItems: 'stretch' }}>
          {row.map((child, j) => <View key={j} style={{ flex: 1, minWidth: 0 }}>{child}</View>)}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}
