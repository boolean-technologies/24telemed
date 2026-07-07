import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { colors } from '@/theme';

/**
 * Entry point. Routes the user into the doctor or patient area based on the
 * restored session, or to the login screen when signed out.
 */
export default function Index() {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={role === 'doctor' ? '/(doctor)' : '/(patient)'} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
