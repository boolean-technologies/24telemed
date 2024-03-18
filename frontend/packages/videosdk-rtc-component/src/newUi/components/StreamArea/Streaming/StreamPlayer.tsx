import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { useParticipant } from '@videosdk.live/react-sdk';
import { useAudioStreamTrack } from './useAudioStreamTrack';

type StreamPlayerProps = {
  showBorder?: boolean;
  webcamOn?: boolean;
  micOn?: boolean;
  name?: string;
  participantId: string;
  children: ReactNode;
  onLayoutToggle: () => void;
};

export function StreamPlayer({
  participantId,
  showBorder,
  children,
  onLayoutToggle,
}: StreamPlayerProps) {
  const { micStream, webcamOn, micOn, displayName, isLocal } =
    useParticipant(participantId);
  const audioRef = useAudioStreamTrack(micOn, micStream?.track);

  return (
    <StyledRoot
      flex={1}
      justify="center"
      fullHeight
      fullWidth
      showBorder={showBorder}
    >
      <StyledVideoWrap justify="center">
        <audio
          style={{ display: 'none' }}
          ref={audioRef}
          autoPlay
          muted={isLocal}
        />
        {webcamOn ? (
          children
        ) : (
          <StyledMicOffWrapper justify="center">
            <Avatar size={80} icon={displayName ? undefined : <UserOutlined />}>
              {displayName ? (
                <Typography weight="bold" color="common.white" variant="bodyXl">
                  {
                    <Typography
                      weight="bold"
                      color="common.white"
                      variant="bodyXl"
                    >
                      {displayName.charAt(0)}
                    </Typography>
                  }
                </Typography>
              ) : null}
            </Avatar>
          </StyledMicOffWrapper>
        )}
        <StyledName gap="xs" justify="center">
          <div>
            <IonIcon
              name={micOn ? 'mic' : 'mic-off'}
              color="common.white"
              size="sm"
            />
          </div>
          {displayName ? (
            <Typography
              color="common.white"
              weight="bold"
              variant="bodyXs"
              noWrap
              style={{ maxWidth: 150 }}
            >
              {displayName}
            </Typography>
          ) : null}
        </StyledName>
        <StyledStreamOverlay fullWidth fullHeight justify="center">
          <StyledStreamOverlayContent align="center" justify="center">
            <div className='content-holder'>
              <Button
                type="primary"
                icon={<IonIcon name="swap-horizontal" size="md" />}
                size="large"
                shape="circle"
                style={{ width: 60, height: 60, background: "rgba(0,0,0,0.5)", boxShadow: "none" }}
                onClick={onLayoutToggle}
              />
            </div>
          </StyledStreamOverlayContent>
        </StyledStreamOverlay>
      </StyledVideoWrap>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)<{
  showBorder?: boolean;
}>`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.spacing.sm};
  ${({ showBorder }) =>
    showBorder &&
    css`
      border: 2px solid ${({ theme }) => theme.palette.primary1.light};
    `}
`;

const StyledVideoWrap = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.75);
`;

const StyledName = styled(Flex)`
  position: absolute;
  padding: ${({ theme }) => theme.spacing.xxs}
    ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.spacing.xs};
  bottom: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  z-index: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
`;

const StyledMicOffWrapper = styled(Flex)`
  background: rgba(255, 255, 255, 0.125);
  width: 100%;
  height: 100%;
`;

const StyledStreamOverlayContent = styled(Flex)`
  padding: 40px;
  border-radius: 100%;
  cursor: pointer;
  
  .content-holder {
    display: none;
    align-items: center;
    justify-content: center;
  }

  :hover  .content-holder{
    display: flex
  }

`;


const StyledStreamOverlay = styled(Flex)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  
`;

