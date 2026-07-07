import { useState } from 'react';
import {
  Keyboard,
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
import { useOnlineDoctors } from '@/hooks';
import type { Doctor } from '@/api';
import { usePersonnelCall } from '@/realtime';
import { Avatar, Button } from '@/components/ui';
import type { ConsultationTypeKey, ProviderRole } from '@/features/consult/types';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

const PRIORITIES = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
  { value: 4, label: 'Critical' },
];

type ProviderRecord = Doctor & { provider_role?: ProviderRole };

/**
 * Bottom sheet to pick an online provider, set priority + reason, and place the
 * call. `providerRole` decides whether doctors or nurses are shown;
 * `consultationType` is tagged on the resulting consultation.
 */
export function CallDoctorSheet({
  visible,
  onClose,
  patientId,
  consultationType = 'e_consultation',
  providerRole = 'doctor',
  title,
}: {
  visible: boolean;
  onClose: () => void;
  patientId: string;
  consultationType?: ConsultationTypeKey;
  providerRole?: ProviderRole;
  title?: string;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { availableDoctors, callDoctor } = usePersonnelCall();
  const { data: onlineDoctors = [] } = useOnlineDoctors(availableDoctors);
  const [selected, setSelected] = useState<string | null>(null);
  const [priority, setPriority] = useState(1);
  const [note, setNote] = useState('');

  const noun = providerRole === 'nurse' ? 'nurse' : 'doctor';
  const prefix = providerRole === 'nurse' ? 'Nurse' : 'Dr.';
  const providers = (onlineDoctors as ProviderRecord[]).filter(
    (d) => (d.provider_role ?? 'doctor') === providerRole
  );

  function placeCall() {
    if (!selected) return;
    Keyboard.dismiss();
    callDoctor({ doctorId: selected, patientId, note, priority, consultationType });
    onClose();
    setSelected(null);
    setNote('');
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Tapping the dimmed area dismisses the keyboard. */}
        <Pressable style={styles.backdrop} onPress={() => Keyboard.dismiss()}>
          <Pressable style={styles.sheet} onPress={() => Keyboard.dismiss()}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <Text style={styles.title}>{title ?? `Call a ${noun}`}</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView
              style={{ maxHeight: 460 }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
            <Text style={styles.label}>Online {noun}s</Text>
            {providers.length === 0 ? (
              <Text style={styles.empty}>No {noun}s are online right now.</Text>
            ) : (
              providers.map((d) => {
                const active = selected === d.id;
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => setSelected(d.id as string)}
                    style={[styles.doctorRow, active && styles.doctorRowActive]}
                  >
                    <Avatar name={`${d.first_name} ${d.last_name}`} uri={d.photo} size={44} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.doctorName}>
                        {prefix} {d.first_name} {d.last_name}
                      </Text>
                      <Text style={styles.doctorSpecialty}>{d.specialty || 'General'}</Text>
                    </View>
                    {active ? (
                      <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                    ) : (
                      <View style={styles.radio} />
                    )}
                  </Pressable>
                );
              })
            )}

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => {
                const active = priority === p.value;
                return (
                  <Pressable
                    key={p.value}
                    onPress={() => setPriority(p.value)}
                    style={[styles.priorityChip, active && styles.priorityChipActive]}
                  >
                    <Text style={[styles.priorityText, active && styles.priorityTextActive]}>
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Reason for call</Text>
            <TextInput
              style={styles.note}
              placeholder="Brief reason / symptoms"
              placeholderTextColor={colors.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
            />
            </ScrollView>

            <Button
              title="Continue call"
              onPress={placeCall}
              disabled={!selected}
              style={{ marginTop: spacing.md }}
            />
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(10,20,16,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  empty: { color: colors.textMuted, paddingVertical: spacing.sm },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  doctorRowActive: { borderColor: colors.primary, backgroundColor: colors.tint },
  doctorName: { fontSize: 15, fontWeight: '700', color: colors.text },
  doctorSpecialty: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border },
  priorityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  priorityChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityChipActive: { backgroundColor: colors.cta, borderColor: colors.cta },
  priorityText: { color: colors.text, fontWeight: '600' },
  priorityTextActive: { color: colors.white },
  note: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    color: colors.text,
  },
});
