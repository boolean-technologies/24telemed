import { useMemo, useRef, useState } from 'react';
import {
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
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { useProviders } from '@/hooks';
import { Avatar, Button, Calendar, DONE_ACCESSORY_ID, KeyboardDoneBar } from '@/components/ui';
import { useCreateBooking } from '@/features/booking/hooks';
import { ProviderPickerModal } from '@/features/booking/ProviderPickerModal';
import { ensureWalletFunded } from '@/features/wallet/gating';
import { getErrorMessage } from '@/api/errors';
import {
  CONSULT_OPTIONS,
  consultOption,
  type ConsultationTypeKey,
} from '@/features/consult/types';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

const PRIORITIES = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
  { value: 4, label: 'Critical' },
];

function nextDays(count: number) {
  const days: Date[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d);
  }
  return days;
}

function timeSlots() {
  const slots: string[] = [];
  for (let h = 8; h <= 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h !== 18) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

export default function NewPatientBooking() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const params = useLocalSearchParams<{ type?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const reasonPosition = useRef(0);
  const { user } = useAuth();
  const createBooking = useCreateBooking();

  const days = useMemo(() => nextDays(14), []);
  const slots = useMemo(() => timeSlots(), []);
  // Bookings can be made from today up to ~2 months out.
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const maxDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 60);
    return d;
  }, [today]);

  const [consultType, setConsultType] = useState<ConsultationTypeKey>(
    (params.type as ConsultationTypeKey) || 'e_consultation'
  );
  const option = consultOption(consultType);
  const noun = option.providerNoun;
  const prefix = option.providerRole === 'nurse' ? 'Nurse' : 'Dr.';
  const { data: providers = [] } = useProviders(option.providerRole);

  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [day, setDay] = useState<Date>(days[0]);
  const [slot, setSlot] = useState('09:00');
  const [priority, setPriority] = useState(2);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedProvider = providers.find((d) => d.id === doctorId) ?? null;

  const patientId = user?.patient_id;

  if (!patientId) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={40} color={colors.primary} />
          <Text style={styles.emptyTitle}>Set up your records first</Text>
          <Text style={styles.emptyText}>
            You need a medical record before booking an appointment.
          </Text>
          <Button
            title="Go to records"
            onPress={() => router.replace('/(patient)/(tabs)/records')}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  async function submit() {
    setError(null);
    if (!doctorId) return setError(`Select a ${noun}.`);
    if (!ensureWalletFunded(user, router)) return;
    const [h, m] = slot.split(':').map(Number);
    const when = new Date(day);
    when.setHours(h, m, 0, 0);
    try {
      await createBooking.mutateAsync({
        doctor: doctorId,
        patient: patientId as string,
        scheduled_time: when.toISOString(),
        priority,
        reason,
        consultation_type: consultType,
      });
      router.replace('/(patient)/(tabs)/bookings');
    } catch (e) {
      setError(
        getErrorMessage(e, {
          fallback: 'Could not create the booking. Please try again.',
        })
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets
        >
          <Text style={styles.label}>Consultation type</Text>
          <View style={styles.typeRow}>
            {CONSULT_OPTIONS.map((o) => {
              const active = consultType === o.key;
              return (
                <Pressable
                  key={o.key}
                  onPress={() => {
                    setConsultType(o.key);
                    setDoctorId(null); // provider list changes with the type
                  }}
                  style={[styles.typeCard, active && styles.typeCardActive]}
                >
                  <Ionicons
                    name={o.icon}
                    size={20}
                    color={active ? colors.white : colors.primary}
                  />
                  <Text style={[styles.typeText, active && styles.chipTextActive]}>
                    {o.short}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Choose a {noun}</Text>
          {providers.length === 0 ? (
            <Text style={styles.emptyText}>No {noun}s available yet.</Text>
          ) : (
            <Pressable style={styles.selector} onPress={() => setPickerOpen(true)}>
              {selectedProvider ? (
                <>
                  <Avatar
                    name={`${selectedProvider.first_name} ${selectedProvider.last_name}`}
                    uri={selectedProvider.photo}
                    size={40}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.doctorName}>
                      {prefix} {selectedProvider.first_name} {selectedProvider.last_name}
                    </Text>
                    <Text style={styles.doctorSpec}>
                      {selectedProvider.specialty || 'General'}
                    </Text>
                  </View>
                  <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                </>
              ) : (
                <>
                  <View style={styles.selectorIcon}>
                    <Ionicons name="person-add-outline" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.selectorPlaceholder}>
                    Tap to select a {noun}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </>
              )}
            </Pressable>
          )}

          <Text style={styles.label}>Day</Text>
          <Calendar value={day} onSelect={setDay} minDate={today} maxDate={maxDay} />
          <Text style={styles.selectedDay}>
            {day.toLocaleDateString(undefined, {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </Text>

          <Text style={styles.label}>Time</Text>
          <View style={styles.slotWrap}>
            {slots.map((s) => {
              const active = slot === s;
              return (
                <Pressable key={s} onPress={() => setSlot(s)} style={[styles.slot, active && styles.slotActive]}>
                  <Text style={[styles.slotText, active && styles.chipTextActive]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Priority</Text>
          <View style={styles.chipRow}>
            {PRIORITIES.map((p) => {
              const active = priority === p.value;
              return (
                <Pressable key={p.value} onPress={() => setPriority(p.value)} style={[styles.slot, active && styles.slotActive]}>
                  <Text style={[styles.slotText, active && styles.chipTextActive]}>{p.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View
            onLayout={(event) => {
              reasonPosition.current = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Reason</Text>
            <TextInput
              style={styles.reason}
              placeholder="What would you like to discuss?"
              placeholderTextColor={colors.textMuted}
              value={reason}
              onChangeText={setReason}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollTo({
                    y: Math.max(0, reasonPosition.current - 110),
                    animated: true,
                  });
                }, 250);
              }}
              multiline
              inputAccessoryViewID={Platform.OS === 'ios' ? DONE_ACCESSORY_ID : undefined}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Create booking" onPress={submit} loading={createBooking.isPending} style={{ marginTop: spacing.lg }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardDoneBar />
      <ProviderPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={(id) => setDoctorId(id)}
        providers={providers}
        selectedId={doctorId}
        prefix={prefix}
        noun={noun}
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  selectedDay: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  keyboardView: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  typeRow: { flexDirection: 'row', gap: spacing.sm },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { fontSize: 11, fontWeight: '700', color: colors.text, textAlign: 'center' },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  activeRow: { borderColor: colors.primary, backgroundColor: colors.tint },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  selectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tint,
  },
  selectorPlaceholder: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textMuted },
  doctorName: { fontSize: 15, fontWeight: '700', color: colors.text },
  doctorSpec: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  chipRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  dayChip: {
    width: 56,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  dayChipActive: { backgroundColor: colors.cta, borderColor: colors.cta },
  dayDow: { fontSize: 12, color: colors.textMuted },
  dayNum: { fontSize: 18, fontWeight: '800', color: colors.text },
  slotWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  slotActive: { backgroundColor: colors.cta, borderColor: colors.cta },
  slotText: { color: colors.text, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  reason: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 90,
    textAlignVertical: 'top',
    color: colors.text,
    backgroundColor: colors.surface,
  },
  error: { color: colors.danger, marginTop: spacing.md },
});
