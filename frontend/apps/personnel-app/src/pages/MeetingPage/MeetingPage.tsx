import { CallLog, useCurrentUser } from '@local/api-generated';
import { PageLoading } from '@local/shared-components';
import { VideoCall, VideoCallSDK } from '@local/videosdk-rtc-component';
import { usePersonnelCommunication } from '@local/websocket';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../constants';

export function MeetingPage() {
  // const navigate = useNavigate();
  // const { data } = useCurrentUser();

  // const { endCall, message } = usePersonnelCommunication();

  // const meetingId = (message?.data as CallLog)?.meeting_id;

  // const onCallEnded = () => {
  //   endCall();
  //   navigate(Path.home);
  // };

  // const fullName = [data?.first_name, data?.last_name]
  //   .filter(Boolean)
  //   .join(' ');

  // if (!data || !meetingId) {
  //   return <PageLoading />;
  // }

  // return (
  //   <VideoCallSDK
  //     participantName={fullName}
  //     meetingId={meetingId}
  //     setIsMeetingLeft={onCallEnded}
  //   />
  // );
  return (
    <VideoCall participantName="Samuel Olaniyi" meetingId="8kyw-wbu5-ena6" />
  );
}
