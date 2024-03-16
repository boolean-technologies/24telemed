import { Flex } from '@local/shared-components';
import styled from 'styled-components';
import { LocalStream } from './LocalStream';
import { RemoteStream } from './RemoteStream';
import { useCallContext } from '../../../context/AppContext';

export function StreamLayout() {
  const { remoteParticipant, localParticipant } = useCallContext();
  return (
    <StyledRoot flex={1} fullWidth fullHeight>
      <StyledRemoteStreamWrapper fullWidth fullHeight>
        {remoteParticipant ? (
          <RemoteStream />
        ) : localParticipant ? (
          <LocalStream />
        ) : null}
      </StyledRemoteStreamWrapper>
      <StyledLocaStreamWrapper>
        {localParticipant && remoteParticipant ? <LocalStream /> : null}
      </StyledLocaStreamWrapper>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  position: relative;
`;

const StyledRemoteStreamWrapper = styled(Flex)`
  position: absolute;
`;

const StyledLocaStreamWrapper = styled(Flex)`
  position: absolute;
  bottom:  ${({ theme }) => theme.spacing.sm};
  right:  ${({ theme }) => theme.spacing.sm};
  width: 250px;
  aspect-ratio: 1.77273;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;
