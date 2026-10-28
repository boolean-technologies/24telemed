import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CallLog, CallLogsService, UsersService } from '@local/api-generated';
import { PageLoading } from '@local/shared-components';
import { VideoCall } from '@local/videosdk-rtc-component';
import { useSession } from '../components/SessionLayout';

export function MeetingPage() {
  const { meetingId } = useParams();
  const { user } = useSession();
  const { data: callLog } = useQuery<CallLog>({
    queryKey: ['callLog', meetingId],
    queryFn: () => CallLogsService.callLogsRead(meetingId as string),
    enabled: !!meetingId,
  });
  const { data: doctor } = useQuery({
    queryKey: ['doctors', callLog?.doctor],
    queryFn: () => UsersService.usersDoctorsRead(callLog?.doctor as string),
    enabled: !!callLog?.doctor,
  });

  if (!callLog?.patient || !callLog?.meeting_id) {
    return <PageLoading />;
  }

  const doctorFullName = [doctor?.first_name, doctor?.last_name].filter(Boolean).join(' ');

  return (
    <VideoCall
      participantName={doctorFullName ? `Dr. ${doctorFullName}` : 'Unknown'}
      participantPhoto={doctor?.photo || undefined}
      meetingId={callLog.meeting_id}
      userId={user.id as string}
      patientId={callLog.patient}
      callLog={callLog}
      userType="personnel"
    />
  );
}
