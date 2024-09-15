import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IconButton } from '../IconButton';
import { Link } from 'react-router-dom';
import { useMeeting } from '@videosdk.live/react-sdk';

type JoiningAreaProps = {
  webcamEnabled: boolean;
  setWebcamEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  micEnabled: boolean;
  setMicEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onJoinNow: () => void;
  participantName: string;
};

export function JoiningArea({
  webcamEnabled,
  setWebcamEnabled,
  micEnabled,
  setMicEnabled,
  onJoinNow,
  participantName,
}: JoiningAreaProps) {
  const { join, leave } = useMeeting();
  const initials = participantName
    ? participantName
        .split(' ')
        .map((n) => n[0])
        .join('')
    : '';
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleJoinNow = () => {
    join();
    onJoinNow();
  };

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, // Request video stream
          audio: false, // Request audio stream
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    if (webcamEnabled) {
      getMediaStream();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [webcamEnabled]);

  return (
    <StyledRoot>
      <Flex gap="xl" xsGap="md" smDirection="column">
        <Flex justify="center">
          <StyledVideoWrapper>
            <StyledVideo ref={videoRef} autoPlay playsInline controls={false} />
            <MediaControl justify="center" padding="md">
              <IconButton
                icon={webcamEnabled ? 'videocam' : 'videocam-off'}
                tooltip={webcamEnabled ? 'Turn off video' : 'Turn on video'}
                variant={webcamEnabled ? 'primary2' : undefined}
                onClick={() => setWebcamEnabled((prev) => !prev)}
              />
              <IconButton
                icon={micEnabled ? 'mic' : 'mic-off'}
                onClick={() => setMicEnabled((prev) => !prev)}
                tooltip={micEnabled ? 'Turn off mic' : 'Turn on mic'}
                variant={micEnabled ? 'primary2' : undefined}
              />
            </MediaControl>
            {webcamEnabled ? null : (
              <VideoOffOverlay justify="center">
                <Avatar
                  size={65}
                  icon={participantName ? undefined : <UserOutlined />}
                >
                  {participantName ? (
                    <Typography
                      weight="bold"
                      color="common.white"
                      variant="bodyXl"
                    >
                      {
                        <Typography
                          weight="bold"
                          color="common.white"
                          variant="bodyXl"
                        >
                          {initials}
                        </Typography>
                      }
                    </Typography>
                  ) : null}
                </Avatar>
              </VideoOffOverlay>
            )}
          </StyledVideoWrapper>
        </Flex>
        <Flex direction="column" justify="center">
          <Typography
            variant="bodyLg"
            color="common.white"
            align="center"
            weight="bold"
          >
            Ready to join?
          </Typography>
          <Typography variant="bodyMd" color="common.white" align="center">
            {participantName} is waiting for you to join the call
          </Typography>
          <Flex>
            <Link to="/">
              <Button
                type="primary"
                danger
                shape="round"
                size="middle"
                style={{ fontWeight: 'bold' }}
                onClick={leave}
              >
                Cancel
              </Button>
            </Link>
            <Button
              shape="round"
              icon={<IonIcon name="navigate" />}
              size="middle"
              style={{ fontWeight: 'bold' }}
              onClick={handleJoinNow}
            >
              Join now
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  height: 100vh;
  width: 100wv;
  background: ${({ theme }) => theme.palette.primary1.main};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`;

const StyledVideoWrapper = styled.div`
  width: 600px;
  height: 375px;
  max-width: 90% !important;
  border-radius: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  position: relative;
  background-color: ${({ theme }) => theme.palette.primary1.lighter};
`;

const MediaControl = styled(Flex)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
`;

const VideoOffOverlay = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background-color: ${({ theme }) => theme.palette.primary1.lighter};
`;
