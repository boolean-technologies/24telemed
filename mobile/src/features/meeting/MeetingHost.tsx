import {
  Component,
  Suspense,
  lazy,
  type ReactNode,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';

export type MeetingHostProps = {
  meetingId: string;
  displayName: string;
  participantId?: string;
  photo?: string | null;
  onLeave: () => void;
  children?: ReactNode;
};

// Lazy so VideoSDK/WebRTC is only loaded when a call actually opens — importing
// it at startup would crash in Expo Go (no native module).
const NativeMeeting = lazy(() =>
  import('./NativeMeeting').then((m) => ({ default: m.NativeMeeting }))
);

/**
 * Hosts the native call screen, degrading gracefully when the WebRTC native
 * module isn't present (i.e. running in Expo Go instead of a dev build).
 */
export function MeetingHost({ children, ...props }: MeetingHostProps) {
  return (
    <ErrorBoundary onLeave={props.onLeave}>
      <Suspense fallback={<Connecting />}>
        <NativeMeeting {...props}>{children}</NativeMeeting>
      </Suspense>
    </ErrorBoundary>
  );
}

function Connecting() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.white} />
      <Text style={styles.text}>Connecting…</Text>
    </View>
  );
}

function Unavailable({ onLeave }: { onLeave: () => void }) {
  return (
    <View style={styles.center}>
      <Ionicons name="videocam-off" size={48} color={colors.white} />
      <Text style={styles.title}>Video needs a development build</Text>
      <Text style={styles.body}>
        The live call uses native WebRTC, which isn't available in Expo Go. Open
        the app's development build to join calls.
      </Text>
      <Pressable style={styles.btn} onPress={onLeave}>
        <Text style={styles.btnText}>Go back</Text>
      </Pressable>
    </View>
  );
}

class ErrorBoundary extends Component<
  { onLeave: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <Unavailable onLeave={this.props.onLeave} />;
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c0c0c',
    padding: spacing.xl,
    gap: spacing.md,
  },
  text: { color: colors.white, opacity: 0.85, fontSize: 15 },
  title: { color: colors.white, fontSize: 18, fontWeight: '800', marginTop: spacing.sm },
  body: { color: colors.white, opacity: 0.8, textAlign: 'center', lineHeight: 21 },
  btn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  btnText: { color: colors.white, fontWeight: '700' },
});
