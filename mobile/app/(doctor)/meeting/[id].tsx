import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { useCallLog } from '@/hooks';
import { MeetingHost } from '@/features/meeting/MeetingHost';
import { useDoctorCall } from '@/realtime';
import { DoctorCallEventType } from '@/realtime/messages';
import { colors, spacing } from '@/theme';
import { DoctorConsultationTools } from '@/features/consultation/DoctorConsultationTools';

export default function DoctorMeeting() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { callStatus, endCall, resetCall } = useDoctorCall();
  const { data: callLog, isLoading } = useCallLog(id);

  // Auto-close when the call ends remotely.
  useEffect(() => {
    if (callStatus === DoctorCallEventType.ENDED) {
      resetCall();
      router.back();
    }
  }, [callStatus, resetCall, router]);

  function leave() {
    endCall();
    resetCall();
    router.back();
  }

  if (isLoading || !callLog?.meeting_id) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={styles.connecting}>Connecting…</Text>
      </View>
    );
  }

  const name =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.username ||
    'Doctor';

  return (
    <View style={styles.meeting}>
      <MeetingHost
        meetingId={callLog.meeting_id}
        displayName={name}
        participantId={user?.id}
        photo={user?.photo}
        onLeave={leave}
      >
        {callLog.medical_encounter ? (
          <DoctorConsultationTools encounterId={callLog.medical_encounter} />
        ) : null}
      </MeetingHost>
    </View>
  );
}

const styles = StyleSheet.create({
  meeting: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c0c0c',
    gap: spacing.md,
  },
  connecting: { color: colors.white, fontSize: 15, opacity: 0.85 },
});
