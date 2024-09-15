import { useCurrentUser } from '@local/api-generated';
import { PageLoading } from '@local/shared-components';
import { VideoCall } from '@local/videosdk-rtc-component';
import { useGetCallLog } from '../../api/callLogs';
import { useParams } from 'react-router-dom';

export function MeetingPage() {
  const { meetingId } = useParams();
  const { data: userData } = useCurrentUser();
  const { data: callLog } = useGetCallLog(meetingId);

  if (!userData || !callLog?.meeting_id || !callLog?.patient) {
    return <PageLoading />;
  }

  const fullName =
    [userData?.first_name, userData?.last_name].filter(Boolean).join(' ') ||
    'Unknown';
  return (
    <VideoCall
      participantName={fullName}
      meetingId={callLog.meeting_id}
      userId={userData.id as string}
      patientId={callLog.patient}
      userType="doctor"
    />
  );
}
