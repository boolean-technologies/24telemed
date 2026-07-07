import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useCallLog } from '@/hooks';
import { Button, ScreenHeader, StatusBadge } from '@/components/ui';
import { ChatApi } from '@/features/chat/api';
import { ConsultationApi } from './api';
import { DoctorConsultationTools } from './DoctorConsultationTools';
import { getErrorMessage } from '@/api/errors';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export function ConsultationDetailScreen({
  role,
}: {
  role: 'doctor' | 'patient';
}) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const [openingChat, setOpeningChat] = useState(false);
  const { data: callLog, isLoading: callLoading } = useCallLog(id);
  const encounterId = callLog?.medical_encounter ?? undefined;
  const { data: encounter, isLoading: encounterLoading } = useQuery({
    queryKey: ['consultation', role, encounterId],
    queryFn: () =>
      role === 'doctor'
        ? ConsultationApi.doctorRead(encounterId as string)
        : ConsultationApi.patientRead(encounterId as string),
    enabled: Boolean(encounterId),
  });

  async function openChat() {
    const participantId =
      role === 'doctor'
        ? callLog?.health_care_assistant
        : callLog?.doctor;
    if (!participantId) return;
    setOpeningChat(true);
    try {
      const conversation = await ChatApi.open(participantId);
      router.push(
        `/${role === 'doctor' ? '(doctor)' : '(patient)'}/chat/${conversation.id}`
      );
    } catch (e) {
      Alert.alert(
        'Chat unavailable',
        getErrorMessage(e, { fallback: 'Could not open this conversation.' })
      );
    } finally {
      setOpeningChat(false);
    }
  }

  if (callLoading || encounterLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScreenHeader title="Consultation details" onBack={() => router.back()} />
      <SafeAreaView style={styles.flex} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <Text style={styles.date}>
              {callLog?.start_time
                ? new Date(callLog.start_time).toLocaleString()
                : 'Consultation'}
            </Text>
            <StatusBadge status={callLog?.status} />
          </View>
          {encounter?.doctor_name ? (
            <Text style={styles.doctor}>Dr. {encounter.doctor_name}</Text>
          ) : null}
          <Text style={styles.reason}>
            {encounter?.reason_for_visit ||
              callLog?.notes ||
              'No reason recorded.'}
          </Text>
          <Button
            title="Message"
            variant="outline"
            loading={openingChat}
            onPress={openChat}
            style={styles.messageButton}
          />
        </View>

        {!encounter ? (
          <Text style={styles.empty}>
            No clinical record was created for this consultation.
          </Text>
        ) : (
          <>
            <Section
              title="Assessment and diagnosis"
              value={encounter.assessment_and_diagnosis}
            />
            <Section
              title="Treatment and interventions"
              value={encounter.treatment_and_interventions}
            />
            <Section title="Follow-up plan" value={encounter.follow_up_plans} />

            <Text style={styles.sectionTitle}>Prescriptions</Text>
            {encounter.prescribed_drugs.length === 0 ? (
              <Text style={styles.empty}>No medications prescribed.</Text>
            ) : (
              encounter.prescribed_drugs.map((item) => (
                <View key={item.id} style={styles.prescription}>
                  <View style={styles.pill}>
                    <Ionicons name="medical" size={19} color={colors.primary} />
                  </View>
                  <View style={styles.prescriptionMain}>
                    <Text style={styles.drugName}>
                      {item.drug_detail?.name || 'Medication'}
                    </Text>
                    <Text style={styles.drugMeta}>
                      {item.dosage} · {item.frequency}
                      {item.duration ? ` · ${item.duration}` : ''}
                    </Text>
                    {item.instructions ? (
                      <Text style={styles.instructions}>{item.instructions}</Text>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
      {role === 'doctor' && encounterId ? (
        <DoctorConsultationTools encounterId={encounterId} />
      ) : null}
      </SafeAreaView>
    </View>
  );
}

function Section({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={value ? styles.sectionText : styles.empty}>
        {value || 'Not recorded.'}
      </Text>
    </View>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 3 },
  summary: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { color: colors.textMuted, fontSize: 13, flex: 1 },
  doctor: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.text,
    marginTop: spacing.md,
  },
  reason: { color: colors.textMuted, lineHeight: 20, marginTop: spacing.sm },
  messageButton: { marginTop: spacing.md, minHeight: 44 },
  section: { marginTop: spacing.xl },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionText: {
    color: colors.text,
    lineHeight: 22,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  empty: { color: colors.textMuted, lineHeight: 21 },
  prescription: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tint,
  },
  prescriptionMain: { flex: 1 },
  drugName: { fontSize: 16, fontWeight: '900', color: colors.text },
  drugMeta: { color: colors.textMuted, marginTop: 3 },
  instructions: { color: colors.text, marginTop: spacing.sm, lineHeight: 19 },
});
