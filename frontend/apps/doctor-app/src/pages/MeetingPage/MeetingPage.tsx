import { useCurrentUser } from '@local/api-generated';
import { PageLoading } from '@local/shared-components';
import { VideoCall } from '@local/videosdk-rtc-component';
import { useGetCallLog } from '../../api/callLogs';
import { useParams } from 'react-router-dom';
import { useGetPatient } from '../../api/patient';
import { useIncomingCall } from '../../components/IncomingCall/useIncomingCall';

export function MeetingPage() {
  const { handleDeclineCall } = useIncomingCall();
  const { meetingId } = useParams();
  const { data: userData } = useCurrentUser();
  const { data: callLog } = useGetCallLog(meetingId);
  const { data: patientData } = useGetPatient(callLog?.patient as string);

  if (!userData || !callLog?.patient || !callLog?.meeting_id) {
    return <PageLoading />;
  }
  const fullName =
    [patientData?.first_name, patientData?.last_name].filter(Boolean).join(' ') ||
    'Unknown';

  return (
    <VideoCall
      participantName={fullName}
      meetingId={callLog.meeting_id}
      userId={userData.id as string}
      patientId={callLog.patient}
      userType="doctor"
      declineCall={handleDeclineCall}
    />
  );
}
