import { MeetingProvider } from '@videosdk.live/react-sdk';
import { AppMain } from './components/AppMain';
import { AppContextType, CallContextProvider } from './context/AppContext';
import { usePermissions } from './hooks/usePermissions';
import { useMemo, useState } from 'react';
import { JoiningArea } from './components/JoiningArea';
import { useBreakpoints } from '@local/shared-components';
import { CallEnded } from './components/CallEnded';
import { CallLog, MedicalEncounter } from '@local/api-generated';

type VideoCallProps = {
  participantName: string;
  meetingId: string;
  userId: string;
  patientId: string;
  userType: AppContextType['userType'];
  participantPhoto?: string;
  onMedicalEncounterUpdate?: (data: MedicalEncounter) => void;
  callLog: CallLog;
};

export function VideoCall({
  participantName,
  userType,
  meetingId,
  userId,
  patientId,
  callLog,
  participantPhoto,
}: VideoCallProps) {
  usePermissions();
  const { isMobile } = useBreakpoints();
  const [screen, setScreen] = useState<'joining' | 'call'>('joining');
  const [micEnabled, setMicEnabled] = useState<boolean>(false);
  const [webcamEnabled, setWebcamEnabled] = useState<boolean>(false);


  const startTime = new Date(callLog.start_time as string)
  const callDurationLimit = callLog.duration_limit ?? 0;
  
  const isFinnished = useMemo(() => {
    const currentTime = new Date();
    const duration = Math.abs(currentTime.getTime() - startTime.getTime()) / 1000 / 60; 
    if (duration > callDurationLimit) {
      return true;
    }
    return false;
  }, [startTime, callDurationLimit]);

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
        callLog={callLog}
      >
              {isFinnished ? (
          <CallEnded />
        ) : (
          <>
        {screen === 'joining' ? (
          <JoiningArea
            setWebcamEnabled={setWebcamEnabled}
            setMicEnabled={setMicEnabled}
            onJoinNow={() => setScreen('call')}
            participantName={participantName}
            webcamEnabled={webcamEnabled}
            micEnabled={micEnabled}
            participantPhoto={participantPhoto}
          />
        ) : null}
        {screen === 'call' ? (
          <AppMain
            meetingTitle="Medical consultation"
            defaultSideView={isMobile ? undefined : 'patientProfile'}
            participantPhoto={participantPhoto}
            callDurationLimit={callDurationLimit}
            startTime={startTime}
          />
        ) : null}
          </>
        )}
      </CallContextProvider>
    </MeetingProvider>
  );
}
