import { Flex } from '@local/shared-components';
import styled, { css } from 'styled-components';
import { LocalStream } from './LocalStream';
import { RemoteStream } from './RemoteStream';
import { useCallContext } from '../../../context/AppContext';
import { useState } from 'react';


export function StreamLayout() {
  
  const { remoteParticipant, localParticipant } = useCallContext();
  const [bigStream, setBigStream] = useState<'remote' | 'local'>('remote');

  const onLayoutToggle = remoteParticipant
    ? () => setBigStream((prev) => (prev === 'local' ? 'remote' : 'local'))
    : undefined;

  if (bigStream === 'local') {
    return (
      <StyledRoot flex={1} fullWidth fullHeight>
        <StyledRemoteStreamWrapper fullWidth fullHeight>
          {localParticipant ? (
            <LocalStream onLayoutToggle={onLayoutToggle}  />
          ) : remoteParticipant ? (
            <RemoteStream onLayoutToggle={onLayoutToggle} />
          ) : null}
        </StyledRemoteStreamWrapper>
        <StyledLocaStreamWrapper>
          {localParticipant && remoteParticipant ? (
            <RemoteStream onLayoutToggle={onLayoutToggle} />
          ) : null}
        </StyledLocaStreamWrapper>
      </StyledRoot>
    );
  }

  return (
    <StyledRoot flex={1} fullWidth fullHeight>
      <StyledRemoteStreamWrapper fullWidth fullHeight>
        {remoteParticipant ? (
          <RemoteStream onLayoutToggle={onLayoutToggle}  />
        ) : localParticipant ? (
          <LocalStream onLayoutToggle={onLayoutToggle}  />
        ) : null}
      </StyledRemoteStreamWrapper>
      <StyledLocaStreamWrapper>
        {localParticipant && remoteParticipant ? (
          <LocalStream onLayoutToggle={onLayoutToggle}  />
        ) : null}
      </StyledLocaStreamWrapper>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  position: relative;
`;

const StyledRemoteStreamWrapper = styled(Flex)`
  position: absolute;
  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      > div {
        border: none;
        border-radius: 0;
      }
    `)}
  overflow: hidden;
  border-radius: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.palette.primary1.light};
  ${({ theme }) =>
    theme.breakpoints.sm.down(css`
      border-radius: 0;
      border: none;
    `)}
`;

const StyledLocaStreamWrapper = styled(Flex)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};

  width: 300px;
  aspect-ratio: 1.77273;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  
  overflow: hidden;
  border-radius: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.palette.primary1.light};

  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      bottom: unset;
      top: ${({ theme }) => theme.spacing.sm};
    `)}
  ${({ theme }) =>
    theme.breakpoints.sm.down(css`
      bottom: 161px;
      top: unset;
    `)}
`;
