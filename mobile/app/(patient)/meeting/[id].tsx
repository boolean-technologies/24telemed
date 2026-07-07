import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { useCallLog } from '@/hooks';
import { MeetingHost } from '@/features/meeting/MeetingHost';
import { usePersonnelCall } from '@/realtime';
import { PersonnelCallEventType } from '@/realtime/messages';
import { colors, spacing } from '@/theme';

export default function PatientMeeting() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { callStatus, endCall, resetCall } = usePersonnelCall();
  const { data: callLog, isLoading } = useCallLog(id);

  useEffect(() => {
    if (
      callStatus === PersonnelCallEventType.ENDED ||
      callStatus === PersonnelCallEventType.DECLINED ||
      callStatus === PersonnelCallEventType.FAILED
    ) {
      resetCall();
      router.back();
    }
  }, [callStatus, resetCall, router]);

  function leave() {
    endCall(true);
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
    'Patient';

  return (
    <MeetingHost
      meetingId={callLog.meeting_id}
      displayName={name}
      participantId={user?.id}
      photo={user?.photo}
      onLeave={leave}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c0c0c',
    gap: spacing.md,
  },
  connecting: { color: colors.white, fontSize: 15, opacity: 0.85 },
});
