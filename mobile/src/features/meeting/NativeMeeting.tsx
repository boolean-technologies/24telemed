import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Platform,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  MeetingProvider,
  useMediaDevice,
  useMeeting,
  useParticipant,
  usePubSub,
} from '@videosdk.live/react-native-sdk';
import {
  MediaStream,
  RTCView,
} from '@videosdk.live/react-native-webrtc';
import { Avatar } from '@/components/ui';
import { env } from '@/config/env';
import { colors, radius, spacing } from '@/theme';
import { NotesChannelProvider } from './notesChannel';

type NativeMeetingProps = {
  /** VideoSDK room id (CallLog.meeting_id). */
  meetingId: string;
  displayName: string;
  /** Stable participant id (the user's id) so it matches across web/native. */
  participantId?: string;
  photo?: string | null;
  onLeave: () => void;
  /** The other party has already ended the call (received over the app's
   *  websocket signaling) — tells this side to actually leave the VideoSDK
   *  room too, instead of just navigating away with the connection dangling. */
  remoteEnded?: boolean;
  /** Rendered inside the same MeetingProvider, e.g. DoctorConsultationTools,
   *  wired to the shared notes pubsub channel via NotesChannelBridge below.
   *  Must not itself import @videosdk.live/* at module scope — it's also used
   *  outside the call flow (consultation history), which is loaded eagerly. */
  children?: ReactNode;
};

/**
 * Android requires the mic/camera permission dialogs to be resolved before
 * WebRTC captures a track, otherwise the SDK's own (serialized, one-at-a-time)
 * internal request can race the join and leave the mic silently unusable.
 * iOS prompts automatically off the Info.plist purpose strings, so this is a
 * no-op there.
 */
async function ensureCallPermissions() {
  if (Platform.OS !== 'android') return;
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);
  const micGranted =
    granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
    PermissionsAndroid.RESULTS.GRANTED;
  if (!micGranted) {
    Alert.alert(
      'Microphone access needed',
      'Enable microphone access for 24Telemed in your phone Settings so the other participant can hear you.'
    );
  }
}

/**
 * Native in-call screen powered by the VideoSDK RN SDK (WebRTC). Joins the same
 * room the doctor's web app joins (by meetingId), so both sides see each other.
 * Requires a development build — WebRTC is not available in Expo Go.
 */
export function NativeMeeting({
  meetingId,
  displayName,
  participantId,
  photo,
  onLeave,
  remoteEnded,
  children,
}: NativeMeetingProps) {
  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: displayName,
        participantId,
        mode: 'SEND_AND_RECV',
        metaData: { photo: photo ?? undefined },
      }}
      token={env.videoSdkToken}
    >
      <View style={styles.host}>
        <MeetingView
          displayName={displayName}
          photo={photo}
          onLeave={onLeave}
          remoteEnded={remoteEnded}
        />
        <NotesChannelBridge>{children}</NotesChannelBridge>
      </View>
    </MeetingProvider>
  );
}

/** Gives DoctorConsultationTools a way to publish note updates without ever
 *  importing @videosdk.live/* itself (see NativeMeetingProps.children). */
function NotesChannelBridge({ children }: { children?: ReactNode }) {
  const { publish } = usePubSub('MEDICALNOTES');
  return (
    <NotesChannelProvider
      value={{
        notifyNoteUpdate: () => {
          // sendOnly/payload are typed as required by this SDK's .d.ts but are
          // optional at runtime — omitting sendOnly broadcasts to all participants.
          publish(
            'Consultation notes updated',
            { persist: false } as { persist: boolean; sendOnly: string[] },
            {}
          );
        },
      }}
    >
      {children}
    </NotesChannelProvider>
  );
}

function MeetingView({
  displayName,
  photo,
  onLeave,
  remoteEnded,
}: {
  displayName: string;
  photo?: string | null;
  onLeave: () => void;
  remoteEnded?: boolean;
}) {
  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    changeWebcam,
    participants,
    localParticipant,
    localMicOn,
    localWebcamOn,
  } = useMeeting({
    onMeetingLeft: () => onLeave(),
  });
  const { getCameras } = useMediaDevice();
  const [cameras, setCameras] = useState<
    { deviceId: string; facingMode?: string }[]
  >([]);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  useEffect(() => {
    getCameras()
      .then((devices) => setCameras(devices ?? []))
      .catch(() => {});
    // Fetch the device list once; it doesn't change during a call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flipCamera() {
    const nextFacing = facing === 'back' ? 'front' : 'back';
    const nextCamera = cameras.find((c) => c.facingMode === nextFacing);
    if (!nextCamera) return;
    changeWebcam(nextCamera.deviceId);
    setFacing(nextFacing);
  }

  const [noteBanner, setNoteBanner] = useState<string | null>(null);
  usePubSub('MEDICALNOTES', {
    onMessageReceived: (message) => {
      if (message?.senderId === localParticipant?.id) return;
      setNoteBanner('The doctor updated your consultation notes.');
      setTimeout(() => setNoteBanner(null), 4000);
    },
  });

  useEffect(() => {
    ensureCallPermissions().finally(join);
    // Join once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftRemotelyRef = useRef(false);
  useEffect(() => {
    if (remoteEnded && !leftRemotelyRef.current) {
      leftRemotelyRef.current = true;
      leave();
    }
  }, [remoteEnded, leave]);

  const ids = [...participants.keys()];
  const remoteIds = ids.filter((id) => id !== localParticipant?.id);

  return (
    <View style={styles.container}>
      {/* Remote participant (or waiting state) fills the screen. */}
      {remoteIds.length > 0 ? (
        <ParticipantView participantId={remoteIds[0]} style={styles.remote} />
      ) : (
        <View style={[styles.remote, styles.waiting]}>
          <Avatar name={displayName} uri={photo} size={96} />
          <Text style={styles.waitingText}>Waiting for the other participant…</Text>
        </View>
      )}

      {noteBanner ? (
        <View style={styles.noteBanner}>
          <Ionicons name="document-text" size={16} color={colors.white} />
          <Text style={styles.noteBannerText}>{noteBanner}</Text>
        </View>
      ) : null}

      {/* Local self-view, picture-in-picture. */}
      {localParticipant ? (
        <View style={styles.pip}>
          <ParticipantView participantId={localParticipant.id} style={styles.pipVideo} mirror />
        </View>
      ) : null}

      {/* Controls */}
      <View style={styles.controls}>
        <ControlButton
          icon={localMicOn ? 'mic' : 'mic-off'}
          active={localMicOn}
          onPress={() => toggleMic()}
        />
        <Pressable style={styles.endBtn} onPress={() => leave()}>
          <Ionicons name="call" size={28} color={colors.white} />
        </Pressable>
        <ControlButton
          icon={localWebcamOn ? 'videocam' : 'videocam-off'}
          active={localWebcamOn}
          onPress={() => toggleWebcam()}
        />
        {localWebcamOn && cameras.length > 1 ? (
          <ControlButton
            icon="camera-reverse"
            active
            onPress={flipCamera}
          />
        ) : null}
      </View>
    </View>
  );
}

function ParticipantView({
  participantId,
  style,
  mirror,
}: {
  participantId: string;
  style: object;
  mirror?: boolean;
}) {
  const { webcamStream, webcamOn, displayName } = useParticipant(participantId);

  if (webcamOn && webcamStream) {
    // VideoSDK's track type and react-native-webrtc's differ at the type level
    // but are the same object at runtime.
    const stream = new MediaStream([webcamStream.track as never]);
    return (
      <RTCView
        streamURL={stream.toURL()}
        objectFit="cover"
        mirror={mirror}
        style={style}
      />
    );
  }

  return (
    <View style={[style, styles.noVideo]}>
      <Avatar name={displayName} size={56} />
    </View>
  );
}

function ControlButton({
  icon,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.controlBtn, !active && styles.controlBtnOff]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1 },
  container: { flex: 1, backgroundColor: '#0c0c0c' },
  remote: { ...StyleSheet.absoluteFillObject },
  noteBanner: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    zIndex: 30,
  },
  noteBannerText: { color: colors.white, fontSize: 13, flexShrink: 1 },
  waiting: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    gap: spacing.md,
  },
  waitingText: { color: colors.white, fontSize: 15, opacity: 0.9 },
  pip: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 110,
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pipVideo: { flex: 1 },
  noVideo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1e',
  },
  controls: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnOff: { backgroundColor: 'rgba(255,255,255,0.32)' },
  endBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
  },
});
