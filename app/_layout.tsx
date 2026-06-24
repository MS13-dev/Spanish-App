import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider } from '@/store/progress';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
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
          <Stack.Screen name="review/[deck]" options={{ title: 'Révision', presentation: 'modal' }} />
          <Stack.Screen name="sauvegarde" options={{ title: 'Sauvegarde' }} />
        </Stack>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
