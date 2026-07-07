import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { UsersService } from '@/api';
import { Button, KeyboardDoneBar, TextField } from '@/components/ui';
import { getErrorMessage } from '@/api/errors';
import { spacing, type Palette } from '@/theme';
import { useThemedStyles } from '@/theme/ThemeContext';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!current || !next) return setError('Fill in both password fields.');
    if (next.length < 6) return setError('New password must be at least 6 characters.');
    if (next !== confirm) return setError('New passwords do not match.');
    setBusy(true);
    try {
      await UsersService.usersChangePassword({
        current_password: current,
        new_password: next,
      });
      router.back();
    } catch (e) {
      setError(
        getErrorMessage(e, {
          fallback: 'Could not change password. Please try again.',
          statusMessages: {
            400: 'Your current password is incorrect.',
            401: 'Your current password is incorrect.',
          },
        })
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Change password' }} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TextField label="Current password" secureTextEntry value={current} onChangeText={setCurrent} />
        <TextField label="New password" secureTextEntry value={next} onChangeText={setNext} />
        <TextField label="Confirm new password" secureTextEntry value={confirm} onChangeText={setConfirm} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Update password" onPress={submit} loading={busy} style={{ marginTop: spacing.sm }} />
      </ScrollView>
      <KeyboardDoneBar />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  error: { color: colors.danger, marginBottom: spacing.sm },
});
