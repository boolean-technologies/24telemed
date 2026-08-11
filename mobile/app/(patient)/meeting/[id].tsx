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
  const remoteEnded =
    callStatus === PersonnelCallEventType.ENDED ||
    callStatus === PersonnelCallEventType.DECLINED ||
    callStatus === PersonnelCallEventType.FAILED;

  function leave() {
    // Only notify the backend if we're the one initiating the hangup — if
    // the call already ended remotely, the backend already knows, and the
    // other side already triggered this same cleanup on their end.
    if (!remoteEnded) {
      endCall(true);
    }
    resetCall();
    router.back();
  }

  // If the call ends remotely before the meeting screen even finishes
  // loading (never mounts NativeMeeting), there's nothing for the
  // remoteEnded prop below to catch — leave directly in that case.
  useEffect(() => {
    if (remoteEnded && (isLoading || !callLog?.meeting_id)) {
      leave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteEnded, isLoading, callLog?.meeting_id]);

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
      remoteEnded={remoteEnded}
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
