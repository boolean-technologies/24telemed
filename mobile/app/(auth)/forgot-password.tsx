import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  changeForgottenPassword,
  requestPasswordReset,
  verifyPasswordResetOtp,
} from '@/auth/passwordResetApi';
import { Button, KeyboardDoneBar, TextField } from '@/components/ui';
import { getErrorMessage } from '@/api/errors';
import { colors, spacing } from '@/theme';

type Step = 'identifier' | 'otp' | 'password';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [resetId, setResetId] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      if (step === 'identifier') {
        if (!identifier.trim()) throw new Error('Enter your username, email, or phone number.');
        const result = await requestPasswordReset(identifier.trim());
        setResetId(result.reset_id);
        setStep('otp');
      } else if (step === 'otp') {
        if (otp.trim().length !== 6) throw new Error('Enter the 6-digit OTP.');
        const result = await verifyPasswordResetOtp(resetId, otp.trim());
        setResetToken(result.reset_token);
        setStep('password');
      } else {
        if (password.length < 8) throw new Error('Use at least 8 characters.');
        if (password !== confirmPassword) throw new Error('The passwords do not match.');
        await changeForgottenPassword(resetId, resetToken, password);
        Alert.alert('Password changed', 'You can now sign in with your new password.');
        router.replace('/(auth)/login');
      }
    } catch (caught) {
      setError(getErrorMessage(caught, { fallback: 'Please try again.' }));
    } finally {
      setSubmitting(false);
    }
  }

  const title =
    step === 'identifier'
      ? 'Forgot password?'
      : step === 'otp'
        ? 'Enter your OTP'
        : 'Choose a new password';
  const description =
    step === 'identifier'
      ? 'Enter the username, email, or phone number attached to your account.'
      : step === 'otp'
        ? 'We sent a 6-digit code to the email attached to your account. It expires in 5 minutes.'
        : 'Create a strong password you have not used before.';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.body}>
          <Pressable onPress={() => router.back()} style={styles.back} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Ionicons name="lock-open-outline" size={42} color={colors.primary} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {step === 'identifier' ? (
            <TextField
              label="Account"
              placeholder="Username, email, or phone"
              autoCapitalize="none"
              autoCorrect={false}
              value={identifier}
              onChangeText={setIdentifier}
            />
          ) : null}
          {step === 'otp' ? (
            <TextField
              label="One-time password"
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
          ) : null}
          {step === 'password' ? (
            <>
              <TextField
                label="New password"
                placeholder="New password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextField
                label="Confirm password"
                placeholder="Confirm password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={
              step === 'identifier'
                ? 'Send OTP'
                : step === 'otp'
                  ? 'Verify OTP'
                  : 'Change password'
            }
            onPress={submit}
            loading={submitting}
            style={styles.button}
          />

          {step === 'otp' ? (
            <Pressable
              onPress={() => {
                setStep('identifier');
                setOtp('');
                setError(null);
              }}
            >
              <Text style={styles.link}>Use a different account or resend OTP</Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
      <KeyboardDoneBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  body: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  back: { position: 'absolute', top: spacing.lg, left: spacing.lg },
  title: { fontSize: 28, fontWeight: '900', color: colors.text, marginTop: spacing.md },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  error: { color: colors.danger, marginBottom: spacing.md },
  button: { marginTop: spacing.sm },
  link: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: spacing.lg,
  },
});
