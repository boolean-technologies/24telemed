import { useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/auth/AuthContext';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { configureApiClient } from '@/config/api';
import { queryClient } from '@/query/queryClient';
import { NotificationManager } from '@/notifications/NotificationManager';

// Point the generated API client at the backend before anything renders.
configureApiClient();

// Keep the (plain teal) native splash up until our animated splash mounts.
SplashScreen.preventAutoHideAsync();

// Initialise the VideoSDK media engine (WebRTC) — but ONLY when the native
// WebRTC module is actually present (i.e. a development build). In Expo Go the
// module is absent; calling register() there spawns async permission checks that
// reject ("checkRecordPermission of null"), so we skip it entirely.
const hasWebRTC = !!NativeModules.WebRTCModule;
if (hasWebRTC) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@videosdk.live/react-native-sdk').register();
  } catch {
    // No-op.
  }
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Reveal our animated splash (rendered on top) by hiding the native one.
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationManager />
            <ThemedShell />
          </AuthProvider>
        </QueryClientProvider>
        {!splashDone ? (
          <AnimatedSplash onFinish={() => setSplashDone(true)} />
        ) : null}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/** Drives the status-bar colour + navigation header theming from the palette. */
function ThemedShell() {
  const { colors } = useTheme();
  return (
    <>
      {/* The status bar sits over the teal header band on every screen, so
          light (white) content is always legible regardless of body theme. */}
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(doctor)" />
        <Stack.Screen name="(patient)" />
        <Stack.Screen name="legal/[doc]" options={{ headerShown: true }} />
        <Stack.Screen name="change-password" options={{ headerShown: true }} />
      </Stack>
    </>
  );
}
