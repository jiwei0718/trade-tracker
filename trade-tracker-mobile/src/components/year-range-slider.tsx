import { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, LayoutChangeEvent, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface Props {
  min: number;
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
}

/** Lightweight dual-thumb year range slider built with PanResponder. */
export default function YearRangeSlider({ min, max, from, to, onChange }: Props) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const fromRef = useRef(from);
  const toRef = useRef(to);
  fromRef.current = from;
  toRef.current = to;

  const span = max - min;
  const xToYear = (x: number) => {
    const ratio = Math.max(0, Math.min(1, x / (widthRef.current || 1)));
    return Math.round(min + ratio * span);
  };
  const yearToPct = (y: number) => ((y - min) / span) * 100;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setWidth(w);
  };

  const trackLeft = useRef(0);

  const makeThumbResponder = (isFrom: boolean) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.pageX - trackLeft.current;
        const y = xToYear(x);
        if (isFrom) {
          if (y >= min && y <= toRef.current) onChange(y, toRef.current);
        } else {
          if (y <= max && y >= fromRef.current) onChange(fromRef.current, y);
        }
      },
    });

  const fromThumb = useRef(makeThumbResponder(true)).current;
  const toThumb = useRef(makeThumbResponder(false)).current;

  return (
    <View style={styles.wrap}>
      <View style={styles.labels}>
        <Text style={[styles.label, { color: '#2563eb' }]}>{from}</Text>
        <Text style={[styles.rangeText, { color: c.textSecondary }]}>
          {from === min && to === max ? '全部年份' : `${from} – ${to}`}
        </Text>
        <Text style={[styles.label, { color: '#2563eb' }]}>{to}</Text>
      </View>

      <View
        style={styles.trackArea}
        onLayout={(e) => {
          onLayout(e);
          // measure absolute left
          e.target?.measure?.((_x, _y, _w, _h, px) => { trackLeft.current = px; });
        }}>
        <View style={[styles.track, { backgroundColor: c.backgroundElement }]} />
        <View
          style={[
            styles.activeTrack,
            { left: `${yearToPct(from)}%`, right: `${100 - yearToPct(to)}%` },
          ]}
        />
        {/* From thumb */}
        <View
          {...fromThumb.panHandlers}
          style={[styles.thumb, { left: `${yearToPct(from)}%`, backgroundColor: '#2563eb' }]}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        />
        {/* To thumb */}
        <View
          {...toThumb.panHandlers}
          style={[styles.thumb, { left: `${yearToPct(to)}%`, backgroundColor: '#2563eb' }]}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        />
      </View>

      {/* Decade ticks */}
      <View style={styles.ticks}>
        {Array.from({ length: Math.floor(span / 10) + 1 }, (_, i) => min + i * 10).map(yr => (
          <Text key={yr} style={[styles.tick, { color: c.textSecondary, left: `${yearToPct(yr)}%` }]}>
            {yr}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '800' },
  rangeText: { fontSize: 12 },
  trackArea: { height: 32, justifyContent: 'center' },
  track: { height: 4, borderRadius: 2 },
  activeTrack: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: '#2563eb' },
  thumb: { position: 'absolute', width: 20, height: 20, borderRadius: 10, marginLeft: -10, borderWidth: 2, borderColor: '#fff' },
  ticks: { height: 16, position: 'relative' },
  tick: { position: 'absolute', fontSize: 9, marginLeft: -14, width: 28, textAlign: 'center' },
});
