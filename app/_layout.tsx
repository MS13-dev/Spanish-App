import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/store/app';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '800' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="level/[id]" options={{ title: '' }} />
          <Stack.Screen name="review/[level]" options={{ title: 'Révision', presentation: 'modal' }} />
          <Stack.Screen name="progression" options={{ title: 'Progression' }} />
          <Stack.Screen name="difficiles" options={{ title: 'Cartes difficiles' }} />
          <Stack.Screen name="reglages" options={{ title: 'Réglages' }} />
          <Stack.Screen name="profils" options={{ title: 'Profils' }} />
          <Stack.Screen name="sauvegarde" options={{ title: 'Sauvegarde' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
