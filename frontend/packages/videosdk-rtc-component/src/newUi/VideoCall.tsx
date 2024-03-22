import { MeetingProvider } from '@videosdk.live/react-sdk';
import { AppMain } from './components/AppMain';
import { AppContextType, CallContextProvider } from './context/AppContext';
import { usePermissions } from './hooks/usePermissions';
import { useState } from 'react';
import { JoiningArea } from './components/JoiningArea';
import { useBreakpoints } from '@local/shared-components';

type VideoCallProps = {
  participantName: string;
  meetingId: string;
  userId: string;
  patientId: string;
  userType: AppContextType['userType'];
};

export function VideoCall({
  participantName,
  userType,
  meetingId,
  userId,
  patientId,
}: VideoCallProps) {
  usePermissions();
  const { isXs } = useBreakpoints();
  const [screen, setScreen] = useState<'joining' | 'call'>('joining');
  const [micEnabled, setMicEnabled] = useState<boolean>(false);
  const [webcamEnabled, setWebcamEnabled] = useState<boolean>(false);

  return (
    <MeetingProvider
      config={{
        micEnabled,
        webcamEnabled,
        meetingId: meetingId,
        name: participantName,
        participantId: userId,
      }}
      token={import.meta.env.VITE_VIDEO_SDK_TOKEN}
      // joinWithoutUserInteraction
    >
      <CallContextProvider
        userId={userId}
        patientId={patientId}
        userType={userType}
      >
        {screen === 'joining' ? (
          <JoiningArea
            setWebcamEnabled={setWebcamEnabled}
            webcamEnabled={webcamEnabled}
            micEnabled={micEnabled}
            setMicEnabled={setMicEnabled}
            onJoinNow={() => setScreen('call')}
          />
        ) : null}
        {screen === 'call' ? (
          <AppMain
            meetingTitle="Medical consultation"
            defaultSideView={isXs ? undefined : 'patientProfile'}
          />
        ) : null}
      </CallContextProvider>
    </MeetingProvider>
  );
}
