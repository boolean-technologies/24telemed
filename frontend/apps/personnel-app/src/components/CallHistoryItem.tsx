import { DateTime } from 'luxon';
import { FullCallLog, timeDiffInMins } from '@local/api-generated';
import {
  CallStatus,
  Flex,
  IonIcon,
  Typography,
} from '@local/shared-components';
import styled from 'styled-components';
import {
  Avatar,
  Flex as AntFlex,
  Typography as AntTypography,
  Card,
} from 'antd';
import { Dialog, Divider } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Path } from '../constants';
import { Action } from 'antd-mobile/es/components/dialog';

type CallHistoryItemProps = {
  callLog: FullCallLog;
};

export function CallHistoryItem({ callLog }: CallHistoryItemProps) {
  const navigate = useNavigate();

  const duration = timeDiffInMins(
    callLog.start_time!,
    (callLog.end_time || callLog.updated_at)!
  );

  const handleClick = () => {
    Dialog.show({
      title: 'Call',
      content: (
        <AntFlex vertical gap={12} style={{ padding: 8, minWidth: 400 }}>
          <CallStatus status={callLog.status!} padding={8} />
          <Card.Meta
            title="Date & Time"
            description={<strong>{DateTime.fromISO(callLog.created_at!).toFormat(
              'yyyy LLL dd @ hh:mm a'
            )}</strong>}
          />
          <Card.Meta
            title="Duration"
            description={
              <strong>
                {duration}
              </strong>
            }
          />
          <Divider />
          <AntFlex gap={8} align="center">
            <Avatar
              src={callLog.doctor.photo}
              icon={<IonIcon name="medkit" />}
              size="large"
            />
            <AntFlex vertical gap="none">
              <AntTypography.Text>Doctor</AntTypography.Text>
              <AntTypography.Title level={5} style={{ margin: 0 }}>
                {callLog.doctor.first_name} {callLog.doctor.last_name}{' '}
              </AntTypography.Title>
            </AntFlex>
          </AntFlex>
          <AntFlex gap={8} align="center">
            <Avatar
              src={callLog.patient.photo}
              icon={<IonIcon name="heart-half-outline" />}
              size="large"
            />
            <AntFlex vertical gap="none">
              <AntTypography.Text>Patient</AntTypography.Text>
              <AntTypography.Title level={5} style={{ margin: 0 }}>
                {callLog.patient.first_name} {callLog.patient.last_name}{' '}
              </AntTypography.Title>
            </AntFlex>
          </AntFlex>
        </AntFlex>
      ),
      actions: [
        callLog.status === FullCallLog.status.IN_PROGRESS && {
          key: 'reJoin',
          text: 'Rejoin',
          onClick: () => {
            Dialog.clear();
            navigate(Path.meeting + '/' + callLog.id);
          },
          bold: true
        },
        {
          key: 'patient',
          text: 'Patient Profile',
          onClick: () => {
            Dialog.clear();
            navigate(Path.patient + '/' + callLog.patient.id);
          },
        },
        {
          key: 'cancel',
          text: 'Cancel',
          danger: true,
          onClick: () => Dialog.clear(),
        },
      ].filter(Boolean) as Action[],
    });
  };

  return (
    <StyledRoot fullWidth justify="space-between" onClick={handleClick}>
      <Flex>
        <Avatar icon={<IonIcon name="videocam" />} size="large" />
        <Flex direction="column" gap="xxs">
          <Flex>
            <Typography weight="bold" color="primary1.lighter">
              {callLog.doctor.first_name} {callLog.doctor.last_name}{' '}
            </Typography>
            <CallStatus status={callLog.status!} />
          </Flex>
          <Typography variant="bodySm" color="primary1.light">
            <strong>Patient:</strong>{' '}
            {callLog?.patient ? (
              <>
                {callLog?.patient?.first_name} ({callLog?.patient?.patient_id})
              </>
            ) : (
              'N/A'
            )}
          </Typography>
        </Flex>
      </Flex>
      <Flex direction="column" gap="xs">
        <Flex gap="xs">
          <IonIcon name="time" outlined />
          <Typography variant="bodySm" color="primary1.light">
            {DateTime.fromISO(callLog.created_at!).toFormat('hh:mm a')}
          </Typography>
        </Flex>
        <Typography variant="bodySm" color="primary1.light" align="right">
          {duration}
        </Typography>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  cursor: pointer;
  :hover ion-icon {
    color: #fd0;
  }
`;
