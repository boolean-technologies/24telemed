import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { getErrorMessage } from '@/api/errors';
import {
  ConsultationApi,
  type ConsultationEncounter,
  type EncounterNotes,
  type PrescriptionInput,
} from './api';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

const EMPTY_PRESCRIPTION: PrescriptionInput = {
  drug_name: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
};

export function DoctorConsultationTools({
  encounterId,
}: {
  encounterId: string;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingDrug, setSavingDrug] = useState(false);
  const [notes, setNotes] = useState<EncounterNotes>({});
  const [prescription, setPrescription] =
    useState<PrescriptionInput>(EMPTY_PRESCRIPTION);
  const queryKey = ['consultation', 'doctor', encounterId];
  const { data: encounter } = useQuery({
    queryKey,
    queryFn: () => ConsultationApi.doctorRead(encounterId),
  });

  useEffect(() => {
    if (!encounter) return;
    setNotes({
      assessment_and_diagnosis: encounter.assessment_and_diagnosis || '',
      treatment_and_interventions:
        encounter.treatment_and_interventions || '',
      follow_up_plans: encounter.follow_up_plans || '',
    });
  }, [encounter]);

  async function saveNotes() {
    setSavingNotes(true);
    try {
      const updated = await ConsultationApi.updateNotes(encounterId, notes);
      queryClient.setQueryData(queryKey, updated);
      Alert.alert('Saved', 'Consultation notes have been saved.');
    } catch (e) {
      Alert.alert(
        'Could not save',
        getErrorMessage(e, {
          fallback: 'Please check your connection and try again.',
        })
      );
    } finally {
      setSavingNotes(false);
    }
  }

  async function addPrescription() {
    if (
      !prescription.drug_name.trim() ||
      !prescription.dosage.trim() ||
      !prescription.frequency.trim()
    ) {
      Alert.alert('Missing details', 'Enter the drug, dosage, and frequency.');
      return;
    }
    setSavingDrug(true);
    try {
      const drug = await ConsultationApi.prescribe(
        encounterId,
        prescription
      );
      queryClient.setQueryData(
        queryKey,
        (current: ConsultationEncounter | undefined) =>
          current
            ? {
                ...current,
                prescribed_drugs: [...current.prescribed_drugs, drug],
              }
            : current
      );
      setPrescription(EMPTY_PRESCRIPTION);
      Alert.alert('Prescription saved', 'The patient can now view it.');
    } catch (e) {
      Alert.alert(
        'Could not prescribe',
        getErrorMessage(e, { fallback: 'Please check the details and try again.' })
      );
    } finally {
      setSavingDrug(false);
    }
  }

  return (
    <>
      <Pressable style={styles.floating} onPress={() => setVisible(true)}>
        <Ionicons name="document-text" size={21} color={colors.white} />
        <Text style={styles.floatingText}>Notes</Text>
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Consultation record</Text>
              <Text style={styles.subtitle}>Saved to the patient’s history</Text>
            </View>
            <Pressable onPress={() => setVisible(false)} hitSlop={10}>
              <Ionicons name="close" size={26} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.section}>Clinical notes</Text>
            <Field
              label="Assessment and diagnosis"
              value={notes.assessment_and_diagnosis || ''}
              onChangeText={(value) =>
                setNotes((current) => ({
                  ...current,
                  assessment_and_diagnosis: value,
                }))
              }
            />
            <Field
              label="Treatment and interventions"
              value={notes.treatment_and_interventions || ''}
              onChangeText={(value) =>
                setNotes((current) => ({
                  ...current,
                  treatment_and_interventions: value,
                }))
              }
            />
            <Field
              label="Follow-up plan"
              value={notes.follow_up_plans || ''}
              onChangeText={(value) =>
                setNotes((current) => ({
                  ...current,
                  follow_up_plans: value,
                }))
              }
            />
            <Button
              title="Save clinical notes"
              variant="secondary"
              loading={savingNotes}
              onPress={saveNotes}
            />

            <Text style={styles.section}>Prescription</Text>
            <SingleLineField
              label="Drug name"
              value={prescription.drug_name}
              onChangeText={(value) =>
                setPrescription((current) => ({
                  ...current,
                  drug_name: value,
                }))
              }
            />
            <SingleLineField
              label="Dosage"
              placeholder="e.g. 500 mg"
              value={prescription.dosage}
              onChangeText={(value) =>
                setPrescription((current) => ({ ...current, dosage: value }))
              }
            />
            <SingleLineField
              label="Frequency"
              placeholder="e.g. Twice daily"
              value={prescription.frequency}
              onChangeText={(value) =>
                setPrescription((current) => ({
                  ...current,
                  frequency: value,
                }))
              }
            />
            <SingleLineField
              label="Duration"
              placeholder="e.g. 7 days"
              value={prescription.duration}
              onChangeText={(value) =>
                setPrescription((current) => ({
                  ...current,
                  duration: value,
                }))
              }
            />
            <Field
              label="Instructions"
              value={prescription.instructions || ''}
              onChangeText={(value) =>
                setPrescription((current) => ({
                  ...current,
                  instructions: value,
                }))
              }
            />
            <Button
              title="Add prescription"
              loading={savingDrug}
              onPress={addPrescription}
            />

            {(encounter?.prescribed_drugs ?? []).map((item) => (
              <View key={item.id} style={styles.drug}>
                <Text style={styles.drugName}>
                  {item.drug_detail?.name || 'Medication'}
                </Text>
                <Text style={styles.drugText}>
                  {item.dosage} · {item.frequency}
                  {item.duration ? ` · ${item.duration}` : ''}
                </Text>
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function Field({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        multiline
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

function SingleLineField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value?: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  floating: {
    position: 'absolute',
    right: spacing.md,
    bottom: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    zIndex: 20,
  },
  floatingText: { color: colors.white, fontWeight: '800' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 20, fontWeight: '900', color: colors.text },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  section: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  field: { marginBottom: spacing.md },
  label: { color: colors.text, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  drug: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  drugName: { fontWeight: '800', color: colors.text },
  drugText: { color: colors.textMuted, marginTop: 3 },
});
