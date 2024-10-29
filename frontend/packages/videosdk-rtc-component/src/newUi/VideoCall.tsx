import { MeetingProvider } from '@videosdk.live/react-sdk';
import { AppMain } from './components/AppMain';
import { AppContextType, CallContextProvider } from './context/AppContext';
import { usePermissions } from './hooks/usePermissions';
import { useEffect, useState } from 'react';
import { JoiningArea } from './components/JoiningArea';
import { Theme, useBreakpoints } from '@local/shared-components';
import { useTheme } from 'styled-components';

type VideoCallProps = {
  participantName: string;
  meetingId: string;
  userId: string;
  patientId: string;
  userType: AppContextType['userType'];
  participantPhoto?: string;
};

export function VideoCall({
  participantName,
  userType,
  meetingId,
  userId,
  patientId,
  participantPhoto,
}: VideoCallProps) {
  usePermissions();
  const { isMobile } = useBreakpoints();
  const [screen, setScreen] = useState<'joining' | 'call'>('joining');
  const [micEnabled, setMicEnabled] = useState<boolean>(false);
  const [webcamEnabled, setWebcamEnabled] = useState<boolean>(false);

  const theme = useTheme() as Theme;

  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'theme-color';
    metaTag.content = theme.palette.common.black;

    document.head.appendChild(metaTag);
    return () => {
      document.head.removeChild(metaTag);
    };
  }, [theme.palette.common.black]);

  return (
    <MeetingProvider
      config={{
        micEnabled,
        webcamEnabled,
        meetingId: meetingId,
        name: participantName,
        participantId: userId,
        debugMode: false,
        metaData: {
          profilePhoto: participantPhoto,
        },
      }}
      token={import.meta.env.VITE_VIDEO_SDK_TOKEN}

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
            participantName={participantName}
          />
        ) : null}
        {screen === 'call' ? (
          <AppMain
            meetingTitle="Medical consultation"
            defaultSideView={isMobile ? undefined : 'patientProfile'}
            participantPhoto={participantPhoto}
          />
        ) : null}
      </CallContextProvider>
    </MeetingProvider>
  );
}
