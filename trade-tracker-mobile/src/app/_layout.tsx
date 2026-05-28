import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WatchlistProvider } from '@/lib/watchlist';
import { DataProvider } from '@/lib/data-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DataProvider>
        <WatchlistProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="agreement/[id]"
                options={{ presentation: 'card', headerShown: true, title: '協定詳情' }}
              />
              <Stack.Screen
                name="country/[code]"
                options={{ presentation: 'card', headerShown: true, title: '國家檔案' }}
              />
              <Stack.Screen
                name="era/[key]"
                options={{ presentation: 'card', headerShown: true, title: '歷史背景' }}
              />
              <Stack.Screen
                name="compare"
                options={{ presentation: 'modal', headerShown: true, title: '協定比較' }}
              />
              <Stack.Screen
                name="arc"
                options={{ presentation: 'modal', headerShown: true, title: '貿易協定關聯圖' }}
              />
              <Stack.Screen
                name="eras"
                options={{ presentation: 'card', headerShown: true, title: '歷史時期' }}
              />
              <Stack.Screen
                name="glossary"
                options={{ presentation: 'card', headerShown: true, title: '名詞對照' }}
              />
            </Stack>
          </ThemeProvider>
        </WatchlistProvider>
        </DataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
