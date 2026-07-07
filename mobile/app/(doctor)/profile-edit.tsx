import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { User, UsersService } from '@/api';
import { useAuth } from '@/auth/AuthContext';
import { Button, KeyboardDoneBar, TextField } from '@/components/ui';
import { getErrorMessage } from '@/api/errors';
import { spacing, type Palette } from '@/theme';
import { useThemedStyles } from '@/theme/ThemeContext';

export default function DoctorProfileEdit() {
  const { user, refreshUser } = useAuth();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone_number ?? '');
  const [specialty, setSpecialty] = useState(user?.specialty ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [description, setDescription] = useState(user?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: User) => UsersService.usersPartialUpdate(user?.id as string, data),
    onSuccess: async () => {
      await refreshUser();
      router.back();
    },
    onError: (e) =>
      setError(getErrorMessage(e, { fallback: 'Could not save your profile.' })),
  });

  function save() {
    setError(null);
    mutation.mutate({
      username: user?.username as string,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone_number: phone.trim() || null,
      specialty: specialty.trim() || null,
      location: location.trim() || null,
      description: description.trim() || null,
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: 'Edit profile' }} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TextField label="First name" value={firstName} onChangeText={setFirstName} />
          <TextField label="Last name" value={lastName} onChangeText={setLastName} />
          <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextField label="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <TextField label="Specialty" placeholder="e.g. General Medicine" value={specialty} onChangeText={setSpecialty} />
          <TextField label="Location" value={location} onChangeText={setLocation} />
          <TextField label="About you" value={description} onChangeText={setDescription} multiline />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Save profile" onPress={save} loading={mutation.isPending} style={{ marginTop: spacing.sm }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardDoneBar />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  error: { color: colors.danger, marginTop: spacing.md },
});
