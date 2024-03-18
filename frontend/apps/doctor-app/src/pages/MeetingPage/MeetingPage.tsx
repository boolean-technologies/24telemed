import { useCurrentUser } from '@local/api-generated';
import { PageLoading } from '@local/shared-components';
import { VideoCall } from '@local/videosdk-rtc-component';
import { useGetCallLog } from '../../api/callLogs';
import { useParams } from 'react-router-dom';

export function MeetingPage() {
  const { meetingId: internalMeetingId } = useParams();
  const { data } = useCurrentUser();
  const { data: callLog } = useGetCallLog(internalMeetingId);

  const fullName = [data?.first_name, data?.last_name]
    .filter(Boolean)
    .join(' ');

  if (!data || !callLog) {
    return <PageLoading />;
  }

  return (
    <VideoCall
      participantName={fullName}
      meetingId={callLog?.meeting_id!}
      userId={data?.id!}
      patientId={callLog?.patient!}
      userType="doctor"
    />
  );
}
