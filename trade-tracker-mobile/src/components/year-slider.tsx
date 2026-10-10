import { useRef } from 'react';
import { PanResponder, StyleSheet, Text, View, useColorScheme, type GestureResponderEvent } from 'react-native';
import { Colors } from '@/constants/theme';

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (year: number) => void;
  /** Called when the user starts dragging (e.g. to pause a playback). */
  onGrab?: () => void;
}

/** Single-thumb year slider: drag the thumb or press anywhere on the track. */
export default function YearSlider({ min, max, value, onChange, onGrab }: Props) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const track = useRef<View>(null);
  const geom = useRef({ left: 0, width: 1 });
  const cb = useRef({ onChange, onGrab });
  cb.current = { onChange, onGrab };

  const span = max - min;
  const pct = ((value - min) / span) * 100;

  const yearAt = (e: GestureResponderEvent) => {
    const x = e.nativeEvent.pageX - geom.current.left;
    const ratio = Math.max(0, Math.min(1, x / geom.current.width));
    return Math.round(min + ratio * span);
  };

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: e => {
      cb.current.onGrab?.();
      cb.current.onChange(yearAt(e));
      // The page may have moved since the last layout (sidebar, window size): refresh for the drag.
      track.current?.measure((_x, _y, w, _h, px) => { geom.current = { left: px, width: w || 1 }; });
    },
    onPanResponderMove: e => cb.current.onChange(yearAt(e)),
  })).current;

  return (
    <View style={styles.wrap}>
      <View
        ref={track}
        style={styles.trackArea}
        {...pan.panHandlers}
        onLayout={() => track.current?.measure((_x, _y, w, _h, px) => { geom.current = { left: px, width: w || 1 }; })}>
        <View style={[styles.track, { backgroundColor: c.backgroundSelected }]} />
        <View style={[styles.fill, { width: `${pct}%` }]} />
        <View style={[styles.thumb, { left: `${pct}%` }]} />
      </View>
      <View style={styles.ticks}>
        {Array.from({ length: Math.floor(span / 10) + 1 }, (_, i) => Math.ceil(min / 10) * 10 + i * 10)
          .filter(y => y <= max)
          .map(y => (
            <Text key={y} style={[styles.tick, { color: c.textSecondary, left: `${((y - min) / span) * 100}%` }]}>{y}</Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 2 },
  trackArea: { height: 28, justifyContent: 'center', cursor: 'pointer' } as any,
  track: { height: 4, borderRadius: 2 },
  fill: { position: 'absolute', height: 4, borderRadius: 2, backgroundColor: '#2563eb' },
  thumb: {
    position: 'absolute', width: 18, height: 18, borderRadius: 9, marginLeft: -9,
    backgroundColor: '#2563eb', borderWidth: 2, borderColor: '#fff',
  },
  ticks: { height: 14, position: 'relative' },
  tick: { position: 'absolute', fontSize: 9, marginLeft: -14, width: 28, textAlign: 'center' },
});
