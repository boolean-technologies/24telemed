import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import { usePersonnelCall } from '@/realtime';
import { PersonnelCallEventType } from '@/realtime/messages';
import { colors, radius, spacing } from '@/theme';

const COPY: Record<
  string,
  { title: string; sub: string; tone: 'calling' | 'error' | 'ended' }
> = {
  [PersonnelCallEventType.CALLING]: {
    title: 'Calling doctor…',
    sub: 'Waiting for the doctor to answer.',
    tone: 'calling',
  },
  [PersonnelCallEventType.BUSY]: {
    title: 'Doctor is busy',
    sub: 'The doctor is on another call. Try again shortly.',
    tone: 'error',
  },
  [PersonnelCallEventType.DECLINED]: {
    title: 'Call declined',
    sub: 'The doctor declined this call.',
    tone: 'error',
  },
  [PersonnelCallEventType.FAILED]: {
    title: 'Call failed',
    sub: 'Something went wrong starting the call.',
    tone: 'error',
  },
};

/**
 * Full-screen overlay shown while a call is being placed. Once the doctor
 * answers, the provider navigates to the meeting screen and this hides.
 */
export function CallingOverlay() {
  const { callStatus, endCall, resetCall } = usePersonnelCall();

  const visible =
    callStatus === PersonnelCallEventType.CALLING ||
    callStatus === PersonnelCallEventType.BUSY ||
    callStatus === PersonnelCallEventType.DECLINED ||
    callStatus === PersonnelCallEventType.FAILED;

  if (!visible) return null;
  const copy = COPY[callStatus as string];
  const isCalling = copy?.tone === 'calling';

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isCalling ? colors.primary : colors.danger },
            ]}
          >
            <Ionicons
              name={isCalling ? 'call' : 'close'}
              size={36}
              color={colors.white}
            />
          </View>
          <Text style={styles.title}>{copy?.title}</Text>
          <Text style={styles.sub}>{copy?.sub}</Text>
          {isCalling ? (
            <ActivityIndicator color={colors.primary} style={styles.spinner} />
          ) : null}
          <Button
            title={isCalling ? 'Cancel call' : 'Close'}
            variant={isCalling ? 'danger' : 'outline'}
            onPress={() => (isCalling ? endCall(true) : resetCall())}
            style={styles.btn}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,20,16,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  sub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  spinner: { marginTop: spacing.lg },
  btn: { alignSelf: 'stretch', marginTop: spacing.xl },
});
