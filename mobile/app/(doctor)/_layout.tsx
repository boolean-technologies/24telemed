import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { DoctorCallProvider } from '@/realtime';
import { IncomingCallOverlay } from '@/features/doctor/IncomingCallOverlay';
import { colors } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

export default function DoctorLayout() {
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
  if (role !== 'doctor') return <Redirect href="/(patient)" />;

  return (
    <DoctorCallProvider userId={user?.id as string}>
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
        <Stack.Screen name="profile-edit" options={{ headerShown: true, title: 'Edit profile' }} />
        <Stack.Screen
          name="meeting/[id]"
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack>
      <IncomingCallOverlay />
    </DoctorCallProvider>
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
