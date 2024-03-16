import { MeetingProvider, useMediaDevice } from '@videosdk.live/react-sdk';
import { BottomBar } from './components/BottomBar';
import { AppLayout } from './components/Layout';
import { CallContextProvider } from './context/AppContext';
import { useEffect, useState } from 'react';

type VideoCallProps = {
    participantName: string;
    meetingId: string;
}

export function VideoCall({ participantName, meetingId }: VideoCallProps) {
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
      }}
      token={import.meta.env.VITE_VIDEO_SDK_TOKEN}
      joinWithoutUserInteraction
    >
      <CallContextProvider>
        <AppLayout>something here</AppLayout>
      </CallContextProvider>
    </MeetingProvider>
  );
}
