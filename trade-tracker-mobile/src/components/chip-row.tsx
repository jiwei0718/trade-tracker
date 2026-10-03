import { Children, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, useColorScheme, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-desktop';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Desktop only: show this many children, the rest behind a "顯示全部" toggle. */
  collapsedCount?: number;
}

/**
 * A row of filter chips. Phones: one horizontally swipeable line.
 * Desktop: wraps onto several lines, because a mouse cannot swipe sideways.
 */
export default function ChipRow({ children, style, contentStyle, collapsedCount }: Props) {
  const desktop = useIsDesktop();
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [expanded, setExpanded] = useState(false);

  if (!desktop) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style} contentContainerStyle={contentStyle}>
        {children}
      </ScrollView>
    );
  }

  const items = Children.toArray(children);
  const collapsible = !!collapsedCount && items.length > collapsedCount;
  const shown = collapsible && !expanded ? items.slice(0, collapsedCount) : items;

  return (
    <View style={[style, contentStyle, { flexDirection: 'row', flexWrap: 'wrap', rowGap: 6 }]}>
      {shown}
      {collapsible && (
        <Pressable
          onPress={() => setExpanded(v => !v)}
          style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: c.backgroundSelected }}>
          <Text style={{ color: c.textSecondary, fontSize: 12, fontWeight: '600' }}>
            {expanded ? '收合 ▴' : `顯示全部(${items.length - collapsedCount!})▾`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
