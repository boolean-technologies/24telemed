import { MeetingProvider, useMediaDevice } from '@videosdk.live/react-sdk';
import { BottomBar } from './components/BottomBar';
import { AppLayout } from './components/Layout';
import { CallContextProvider } from './context/AppContext';
import { useEffect, useState } from 'react';

type VideoCallProps = {
    participantName: string;
    meetingId: string;
    userId: string;
    patientId: string;
}

export function VideoCall({ participantName, meetingId, userId, patientId }: VideoCallProps) {
  const { checkPermissions, requestPermission } = useMediaDevice();

  const requestAudioVideoPermission = async () => {
    try {
      await requestPermission("audio_video");
    } catch (ex) {
      console.log('Error in requestPermission ', ex);
    }
  };

  const checkMediaPermission = async () => {
    const checkAudioVideoPermission = await checkPermissions("audio_video");
    const audioPermission = checkAudioVideoPermission.get('audio');
    const videoPermission = checkAudioVideoPermission.get('video');
    if (!audioPermission || !videoPermission) {
      await requestAudioVideoPermission();
    }
  };

  useEffect(() => { 
    checkMediaPermission();
  }, [])

  return (
    <MeetingProvider
      config={{
        meetingId: meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: participantName,
        participantId: userId,
      }}
      token={import.meta.env.VITE_VIDEO_SDK_TOKEN}
      joinWithoutUserInteraction
    >
      <CallContextProvider patientId={patientId}>
        <AppLayout meetingTitle="Medical consultation">something here</AppLayout>
      </CallContextProvider>
    </MeetingProvider>
  );
}
