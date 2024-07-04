import { DateTime } from 'luxon';
import { FullCallLog, timeDiffInMins } from '@local/api-generated';
import {
  CallStatus,
  Flex,
  IonIcon,
  Typography,
} from '@local/shared-components';
import styled from 'styled-components';
import { Avatar } from 'antd';

type CallHistoryItemProps = {
  callLog: FullCallLog;
};

export function CallHistoryItem({ callLog }: CallHistoryItemProps) {
  return (
    <StyledRoot fullWidth justify="space-between">
      <Flex>
        <Avatar icon={<IonIcon name="videocam" />} size="large" />

        <Flex direction="column" gap="none">
          <Typography weight="bold">
            {callLog.doctor.first_name} {callLog.doctor.last_name}{' '}
            <CallStatus status={callLog.status!} />
          </Typography>
          <Typography variant="bodySm" color="primary1.light">
            Patient:{' '}
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
          {timeDiffInMins(
            callLog.start_time!,
            (callLog.end_time || callLog.updated_at)!
          )}
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
