import { DateTime } from 'luxon';
import { FullCallLog } from '@local/api-generated';
import {
  CallStatus,
  Flex,
  IonIcon,
  Typography,
} from '@local/shared-components';
import styled from 'styled-components';

type CallHistoryItemProps = {
  callLog: FullCallLog;
};

export function CallHistoryItem({ callLog }: CallHistoryItemProps) {
  return (
    <Flex fullWidth justify="space-between">
      <Flex>
        <StyledIconWrapper justify="center">
          <IonIcon name="videocam" color="primary2.main" />
        </StyledIconWrapper>

        <Flex direction="column" gap="none">
          <Typography weight="bold">
            {callLog.doctor.first_name} {callLog.doctor.last_name}{' '}
            <CallStatus status={callLog.status!} />
          </Typography>
          <Typography variant="bodySm" color="primary1.light">
            Patient: Ruth (125412521)
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
          0 min
        </Typography>
      </Flex>
    </Flex>
  );
}

const StyledIconWrapper = styled(Flex)`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: ${({ theme }) => theme.border.primary.main};
  background: ${({ theme }) => theme.palette.primary1.main};
`;
