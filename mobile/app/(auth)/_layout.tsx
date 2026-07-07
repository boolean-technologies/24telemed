import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { useTheme } from '@/theme/ThemeContext';

export default function AuthLayout() {
  const { isAuthenticated, role } = useAuth();
  const { colors } = useTheme();

  // Already signed in — bounce to the right area.
  if (isAuthenticated) {
    return <Redirect href={role === 'doctor' ? '/(doctor)' : '/(patient)'} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Show only the chevron on the native back button (otherwise iOS shows
        // the previous route's title, e.g. "login", on the Create-account page).
        headerBackButtonDisplayMode: 'minimal',
        headerBackTitle: '',
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
      }}
    />
  );
}
