import { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePatient } from '@/hooks';
import { useDoctorCall } from '@/realtime';
import { DoctorCallEventType } from '@/realtime/messages';
import { Avatar, Button } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

const PRIORITY_LABEL: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Critical',
};

/**
 * Ringing screen shown to the doctor on an incoming call. Answering joins the
 * meeting (WebView); declining notifies the personnel.
 */
export function IncomingCallOverlay() {
  const router = useRouter();
  const { callStatus, incomingCall, answerCall, declineCall, resetCall } =
    useDoctorCall();

  const visible = callStatus === DoctorCallEventType.INCOMING && !!incomingCall;
  const { data: patient } = usePatient(
    visible ? (incomingCall?.patient as string | undefined) : undefined
  );

  // If the personnel cancels before we answer, dismiss.
  useEffect(() => {
    if (callStatus === DoctorCallEventType.ENDED) resetCall();
  }, [callStatus, resetCall]);

  if (!visible || !incomingCall) return null;

  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : 'Patient';

  function answer() {
    answerCall();
    router.push(`/(doctor)/meeting/${incomingCall?.id}`);
  }

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <Text style={styles.incoming}>Incoming consultation</Text>
        <Avatar name={patientName} uri={patient?.photo} size={120} />
        <Text style={styles.name}>{patientName}</Text>
        {incomingCall.priority ? (
          <View style={styles.priorityPill}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.white} />
            <Text style={styles.priorityText}>
              {PRIORITY_LABEL[incomingCall.priority] ?? 'Normal'} priority
            </Text>
          </View>
        ) : null}
        {incomingCall.notes ? (
          <Text style={styles.notes}>“{incomingCall.notes}”</Text>
        ) : null}

        <View style={styles.actions}>
          <View style={styles.actionCol}>
            <Button
              title="Decline"
              variant="danger"
              onPress={() => declineCall()}
              style={styles.actionBtn}
            />
          </View>
          <View style={styles.actionCol}>
            <Button title="Answer" variant="secondary" onPress={answer} style={styles.actionBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  incoming: {
    color: colors.white,
    opacity: 0.85,
    fontSize: 16,
    marginBottom: spacing.xl,
    letterSpacing: 0.5,
  },
  name: { color: colors.white, fontSize: 26, fontWeight: '800', marginTop: spacing.lg },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: spacing.md,
  },
  priorityText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  notes: {
    color: colors.white,
    opacity: 0.9,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: 15,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl * 1.5, alignSelf: 'stretch' },
  actionCol: { flex: 1 },
  actionBtn: { alignSelf: 'stretch' },
});
