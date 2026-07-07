import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { PersonnelCallProvider } from '@/realtime';
import { CallingOverlay } from '@/features/personnel/CallingOverlay';
import { colors } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

export default function PatientLayout() {
  const { isLoading, isAuthenticated, role, user } = useAuth();
  const { colors: theme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (role !== 'patient') return <Redirect href="/(doctor)" />;

  // The patient is the "caller" in the existing call flow (a customer connects
  // as a health-care-assistant on the socket).
  return (
    <PersonnelCallProvider userId={user?.id as string}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: theme.white,
          headerTitleStyle: { color: theme.white },
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="bookings/new"
          options={{ headerShown: true, title: 'Book appointment' }}
        />
        <Stack.Screen
          name="meeting/[id]"
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack>
      <CallingOverlay />
    </PersonnelCallProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
