import { Platform, useWindowDimensions } from 'react-native';

/** Wide browser window: sidebar navigation and side-by-side panes. */
export function useIsDesktop(): boolean {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 1024;
}

/** Centered, readable content width on desktop; full width on phones. */
export function usePageWidth(max = 1100) {
  const desktop = useIsDesktop();
  return desktop ? ({ width: '100%', maxWidth: max, alignSelf: 'center' } as const) : null;
}
