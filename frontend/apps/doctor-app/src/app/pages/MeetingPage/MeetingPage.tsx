import { VideoCallSDK } from '@local/videosdk-rtc-component';

// TODO: Update this later in another PR
export function MeetingPage() {
  return (
    <VideoCallSDK
      participantName="Doctor"
      meetingId="u9fr-y2uj-7opc"
      setIsMeetingLeft={(x: boolean) => console.log('Personnel Left: ', x)}
    />
  );
}
