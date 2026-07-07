import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import type { Role } from '@/auth/storage';
import { getErrorMessage } from '@/api/errors';
import { Button, KeyboardDoneBar, TextField } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const [role, setRole] = useState<Role>(params.role === 'doctor' ? 'doctor' : 'patient');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password) {
      return setError('Please fill in your name, username and password.');
    }
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (!accepted) return setError('Please accept the Terms of Use and Privacy Policy.');

    setBusy(true);
    try {
      const { role: r, isVerified } = await signUp({
        role,
        username: username.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        phoneNumber: phone.trim() || undefined,
        specialty: role === 'doctor' ? specialty.trim() || undefined : undefined,
      });
      if (r === 'doctor') {
        router.replace('/(doctor)'); // shows pending-approval banner if unverified
      } else {
        router.replace('/(patient)');
      }
      void isVerified;
    } catch (e) {
      setError(
        getErrorMessage(e, {
          fallback: 'Could not create your account. Please try again.',
        })
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Create account' }} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.roleSwitch}>
            {(['patient', 'doctor'] as Role[]).map((r) => {
              const active = role === r;
              return (
                <Pressable key={r} onPress={() => setRole(r)} style={[styles.roleBtn, active && styles.roleBtnActive]}>
                  <Text style={[styles.roleText, active && styles.roleTextActive]}>
                    {r === 'doctor' ? 'Doctor' : 'Patient'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {role === 'doctor' ? (
            <Text style={styles.note}>
              Doctor accounts are reviewed by an admin before activation.
            </Text>
          ) : null}

          <TextField label="First name" value={firstName} onChangeText={setFirstName} />
          <TextField label="Last name" value={lastName} onChangeText={setLastName} />
          <TextField label="Username" autoCapitalize="none" value={username} onChangeText={setUsername} />
          <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextField label="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          {role === 'doctor' ? (
            <TextField label="Specialty" placeholder="e.g. General Medicine" value={specialty} onChangeText={setSpecialty} />
          ) : null}
          <TextField label="Password" secureTextEntry value={password} onChangeText={setPassword} />

          <Pressable style={styles.terms} onPress={() => setAccepted((a) => !a)}>
            <Ionicons
              name={accepted ? 'checkbox' : 'square-outline'}
              size={22}
              color={accepted ? colors.primary : colors.textMuted}
            />
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.link} onPress={() => router.push('/legal/terms')}>
                Terms of Use
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={() => router.push('/legal/privacy')}>
                Privacy Policy
              </Text>
              .
            </Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title="Create account" onPress={submit} loading={busy} style={{ marginTop: spacing.sm }} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.link}> Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardDoneBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  roleBtn: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: radius.sm, alignItems: 'center' },
  roleBtnActive: { backgroundColor: colors.cta },
  roleText: { color: colors.textMuted, fontWeight: '700' },
  roleTextActive: { color: colors.white },
  note: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.md },
  terms: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginTop: spacing.md },
  termsText: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 },
  link: { color: colors.primary, fontWeight: '700' },
  error: { color: colors.danger, marginTop: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textMuted },
});
