import { useCurrentUser } from '@local/api-generated';
import { PageLoading } from '@local/shared-components';
import { VideoCall } from '@local/videosdk-rtc-component';
import { useGetCallLog } from '../../api/callLogs';
import { useParams } from 'react-router-dom';

export function MeetingPage() {
  const { meetingId: internalMeetingId } = useParams();
  const { data: userData } = useCurrentUser();
  const { data: callLog } = useGetCallLog(internalMeetingId);

  const fullName = [userData?.first_name, userData?.last_name]
    .filter(Boolean)
    .join(' ') || 'Unknown';

  if (!userData || !callLog || !callLog.meeting_id || !callLog.patient) {
    return <PageLoading />;
  }

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
