import { useCurrentUser } from '@local/api-generated';
import { MessageResult, PageLoading } from '@local/shared-components';
import { VideoCall } from '@local/videosdk-rtc-component';
import { useGetCallLog } from '../../api/callLogs';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex } from 'antd';
import { Path } from '../../constants';
import { getIsPaymentRequired } from '../../utils/getIsPaymentRequired';
import { useGetDoctor } from '../../api/doctor';

export function MeetingPage() {
  const { meetingId } = useParams();
  const { data: userData } = useCurrentUser();
  const { data: callLog } = useGetCallLog(meetingId);
  const { data: doctorData } = useGetDoctor(callLog?.doctor as string);

  if (!userData || !callLog?.patient || !callLog?.meeting_id) {
    return <PageLoading />;
  }
  const fullName = [doctorData?.first_name, doctorData?.last_name]
    .filter(Boolean)
    .join(' ');
    const doctorPhoto = doctorData?.photo;

  if (getIsPaymentRequired(userData)) {
    return (
      <Flex style={{ height: '100vh' }}>
        <MessageResult
          icon="videocam-off"
          title="Insufficient Balance"
          subTitle="You don’t have enough balance to start a call. Please top up your wallet to proceed."
          extra={[
            <Link key="cancel" to={Path.home}>
              <Button danger>Cancel call</Button>
            </Link>,
            <Link to={Path.wallet + '/fund'} key="fund">
              <Button type="primary">Fund wallet</Button>
            </Link>,
          ]}
        />
      </Flex>
    );
  }

  return (
    <VideoCall
      participantName={fullName || 'Unknown'}
      meetingId={callLog.meeting_id}
      userId={userData.id as string}
      patientId={callLog.patient}
      userType="personnel"
      participantPhoto={doctorPhoto as string}
    />
  );
}
