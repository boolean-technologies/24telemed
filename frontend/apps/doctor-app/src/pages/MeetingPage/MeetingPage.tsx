import { useCurrentUser } from '@local/api-generated';
import { PageLoading } from '@local/shared-components';
import { VideoCallSDK } from '@local/videosdk-rtc-component';
import { useDoctorCommunication } from '@local/websocket';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../constants';

export function MeetingPage() {
  const navigate = useNavigate();
  const { data } = useCurrentUser();

  const { endCall, message } = useDoctorCommunication();

  const meetingId = message?.data?.meeting_id;

  const onCallEnded = () => {
    endCall();
    navigate(Path.home);
  };

  const fullName = [data?.first_name, data?.last_name]
    .filter(Boolean)
    .join(' ');

  if (!data || !meetingId) {
    return <PageLoading />;
  }

  return (
    <VideoCallSDK
      participantName={fullName}
      meetingId={meetingId}
      setIsMeetingLeft={onCallEnded}
    />
  );
}
