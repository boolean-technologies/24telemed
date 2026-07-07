import { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import type { Role } from '@/auth/storage';
import { getErrorMessage } from '@/api/errors';
import { Button } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';
import logo from '../../assets/logo.png';
// Telehealth hero photo (Unsplash, free license).
import heroImage from '../../assets/login-hero.jpg';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<Role>('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(role, username.trim(), password);
    } catch (e) {
      setError(
        getErrorMessage(e, {
          fallback: 'Unable to sign in. Please try again.',
          statusMessages: {
            401: 'Incorrect username or password.',
            400: 'Incorrect username or password.',
          },
        })
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ImageBackground
            source={heroImage}
            resizeMode="cover"
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            <LinearGradient
              colors={['rgba(16,24,32,0.10)', 'rgba(31,142,134,0.78)']}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>

          <View style={styles.logoCard}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.form}>
          <Text style={styles.title}>Secure Login</Text>
          <Text style={styles.subtitle}>
            Enter your username & password to access your account.
          </Text>

          <View style={styles.roleSwitch}>
            {(['patient', 'doctor'] as Role[]).map((r) => {
              const active = role === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  style={[styles.roleButton, active && styles.roleButtonActive]}
                >
                  <Text style={[styles.roleText, active && styles.roleTextActive]}>
                    {r === 'doctor' ? 'Doctor' : 'Patient'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={10}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          <Pressable
            style={styles.forgot}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.footerLink}>Forgot password?</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Log in"
            onPress={handleSubmit}
            loading={submitting}
            style={{ marginTop: spacing.md }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Pressable onPress={() => router.push(`/(auth)/signup?role=${role}`)}>
              <Text style={styles.footerLink}>Create account</Text>
            </Pressable>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: spacing.xl },
  hero: {
    height: 240,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logoCard: {
    alignSelf: 'center',
    marginTop: -36,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logo: { width: 150, height: 96 },
  form: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  title: { fontSize: 28, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xl },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  roleButton: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: radius.sm, alignItems: 'center' },
  roleButtonActive: { backgroundColor: colors.cta },
  roleText: { color: colors.textMuted, fontWeight: '700' },
  roleTextActive: { color: colors.white },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: 16, color: colors.text },
  error: { color: colors.danger, marginBottom: spacing.sm },
  forgot: { alignSelf: 'flex-end', marginTop: -spacing.xs, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl },
  footerText: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.primary, fontWeight: '700', fontSize: 14 },
});
