import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient, PatientsService } from '@/api';
import { useAuth } from '@/auth/AuthContext';
import { usePatient } from '@/hooks';
import { Button, KeyboardDoneBar, ScreenHeader, TextField } from '@/components/ui';
import { getErrorMessage } from '@/api/errors';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

type Form = {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string; // YYYY-MM-DD
  age: string;
  gender: Patient.gender | null;
  email: string;
  address: string;
  blood_type: string;
  weight: string;
  height: string;
  allergies: string;
  current_medications: string;
  medical_history: string;
  chronic_conditions: string;
  immunization_record: string;
  family_medical_history: string;
};

const empty: Form = {
  first_name: '',
  last_name: '',
  phone_number: '',
  date_of_birth: '',
  age: '',
  gender: null,
  email: '',
  address: '',
  blood_type: '',
  weight: '',
  height: '',
  allergies: '',
  current_medications: '',
  medical_history: '',
  chronic_conditions: '',
  immunization_record: '',
  family_medical_history: '',
};

export function PatientRecordsForm() {
  const { user, refreshUser } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const qc = useQueryClient();
  const patientId = user?.patient_id ?? undefined;
  const { data: existing, isLoading } = usePatient(patientId);

  const [form, setForm] = useState<Form>(empty);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Prefill from the existing record, or from the user's account on first setup.
  useEffect(() => {
    if (existing) {
      setForm({
        first_name: existing.first_name ?? '',
        last_name: existing.last_name ?? '',
        phone_number: existing.phone_number ?? '',
        date_of_birth: existing.date_of_birth ?? '',
        age: existing.age != null ? String(existing.age) : '',
        gender: existing.gender ?? null,
        email: existing.email ?? '',
        address: existing.address ?? '',
        blood_type: existing.blood_type ?? '',
        weight: existing.weight != null ? String(existing.weight) : '',
        height: existing.height != null ? String(existing.height) : '',
        allergies: existing.allergies ?? '',
        current_medications: existing.current_medications ?? '',
        medical_history: existing.medical_history ?? '',
        chronic_conditions: existing.chronic_conditions ?? '',
        immunization_record: existing.immunization_record ?? '',
        family_medical_history: existing.family_medical_history ?? '',
      });
    } else if (user && !patientId) {
      setForm((f) => ({
        ...f,
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone_number: user.phone_number ?? '',
        email: user.email ?? '',
        date_of_birth: user.date_of_birth ?? '',
      }));
    }
  }, [existing, user, patientId]);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (payload: Patient) =>
      patientId
        ? PatientsService.patientsPartialUpdate(patientId, payload)
        : PatientsService.patientsCreate(payload),
    onSuccess: async () => {
      setSaved(true);
      await refreshUser();
      qc.invalidateQueries({ queryKey: ['patient'] });
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (e) =>
      setError(
        getErrorMessage(e, {
          fallback:
            'Could not save. Check required fields (name, phone, DOB, gender, age).',
        })
      ),
  });

  function save() {
    Keyboard.dismiss();
    setError(null);
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.phone_number.trim() ||
      !form.date_of_birth.trim() ||
      !form.gender ||
      !form.age.trim()
    ) {
      setError('Please fill in name, phone, date of birth, gender and age.');
      return;
    }
    const payload: Patient = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone_number: form.phone_number.trim(),
      date_of_birth: form.date_of_birth.trim(),
      age: Number(form.age) || 0,
      gender: form.gender,
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
      blood_type: form.blood_type.trim() || undefined,
      weight: form.weight.trim() ? Number(form.weight) : undefined,
      height: form.height.trim() ? Number(form.height) : undefined,
      allergies: form.allergies.trim() || undefined,
      current_medications: form.current_medications.trim() || undefined,
      medical_history: form.medical_history.trim() || undefined,
      chronic_conditions: form.chronic_conditions.trim() || undefined,
      immunization_record: form.immunization_record.trim() || undefined,
      family_medical_history: form.family_medical_history.trim() || undefined,
    };
    mutation.mutate(payload);
  }

  if (patientId && isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScreenHeader
        title="Medical records"
        subtitle={
          patientId
            ? 'Keep your information up to date.'
            : 'Set up your details to start consultations.'
        }
        onBack={() => router.replace('/(patient)/(tabs)')}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Section title="Personal">
            <TextField label="First name" value={form.first_name} onChangeText={(v) => set('first_name', v)} />
            <TextField label="Last name" value={form.last_name} onChangeText={(v) => set('last_name', v)} />
            <TextField label="Phone number" keyboardType="phone-pad" value={form.phone_number} onChangeText={(v) => set('phone_number', v)} />
            <TextField label="Date of birth (YYYY-MM-DD)" placeholder="1990-01-31" value={form.date_of_birth} onChangeText={(v) => set('date_of_birth', v)} />
            <TextField label="Age" keyboardType="number-pad" value={form.age} onChangeText={(v) => set('age', v)} />
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.chipRow}>
              {[Patient.gender.MALE, Patient.gender.FEMALE].map((g) => {
                const active = form.gender === g;
                return (
                  <Pressable
                    key={g}
                    onPress={() => setForm((f) => ({ ...f, gender: g }))}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{g}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextField label="Email" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => set('email', v)} />
            <TextField label="Address" value={form.address} onChangeText={(v) => set('address', v)} />
          </Section>

          <Section title="Vitals">
            <TextField label="Blood type" placeholder="O+" autoCapitalize="characters" value={form.blood_type} onChangeText={(v) => set('blood_type', v)} />
            <TextField label="Weight (kg)" keyboardType="decimal-pad" value={form.weight} onChangeText={(v) => set('weight', v)} />
            <TextField label="Height (cm)" keyboardType="decimal-pad" value={form.height} onChangeText={(v) => set('height', v)} />
          </Section>

          <Section title="Health">
            <TextField label="Allergies" value={form.allergies} onChangeText={(v) => set('allergies', v)} multiline />
            <TextField label="Current medications" value={form.current_medications} onChangeText={(v) => set('current_medications', v)} multiline />
            <TextField label="Chronic conditions" value={form.chronic_conditions} onChangeText={(v) => set('chronic_conditions', v)} multiline />
            <TextField label="Past medical history" value={form.medical_history} onChangeText={(v) => set('medical_history', v)} multiline />
            <TextField label="Immunization record" value={form.immunization_record} onChangeText={(v) => set('immunization_record', v)} multiline />
            <TextField label="Family medical history" value={form.family_medical_history} onChangeText={(v) => set('family_medical_history', v)} multiline />
          </Section>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {saved ? <Text style={styles.saved}>Saved ✓</Text> : null}

          <Button
            title={patientId ? 'Save changes' : 'Create records'}
            onPress={save}
            loading={mutation.isPending}
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardDoneBar />
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.cta, borderColor: colors.cta },
  chipText: { color: colors.text, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  error: { color: colors.danger, marginTop: spacing.md },
  saved: { color: colors.success, marginTop: spacing.md, fontWeight: '700' },
});
