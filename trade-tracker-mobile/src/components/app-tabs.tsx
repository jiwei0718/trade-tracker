import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-desktop';
import { useData } from '@/lib/data-context';

export default function AppTabs() {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const desktop = useIsDesktop();
  const { unseenCount } = useData();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: c.textSecondary,
        // Desktop: a left sidebar with labels beside the icons; phones keep the bottom bar.
        tabBarPosition: desktop ? 'left' : 'bottom',
        tabBarVariant: desktop ? 'material' : 'uikit',
        tabBarLabelPosition: desktop ? 'beside-icon' : 'below-icon',
        tabBarStyle: desktop
          ? { backgroundColor: c.backgroundElement, borderRightColor: c.backgroundSelected, width: 180, paddingTop: 12 }
          : { backgroundColor: c.background, borderTopColor: c.backgroundElement },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首頁',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '瀏覽',
          tabBarIcon: ({ color, size }) => <Ionicons name="globe-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="updates"
        options={{
          title: '動態',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" color={color} size={size} />,
          tabBarBadge: unseenCount > 0 ? unseenCount : undefined,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '地圖',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="globe"
        options={{
          title: '地球儀',
          tabBarIcon: ({ color, size }) => <Ionicons name="earth" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: '追蹤',
          tabBarIcon: ({ color, size }) => <Ionicons name="star" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="data-status"
        options={{
          title: '資料狀態',
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
