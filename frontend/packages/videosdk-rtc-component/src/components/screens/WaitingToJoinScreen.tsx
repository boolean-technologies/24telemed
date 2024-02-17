import { useEffect, useRef, useState } from 'react';
import animationData from '../../static/animations/loading.json';
import Lottie from 'lottie-react';
import useIsTab from '../../hooks/useIsTab';
import useIsMobile from '../../hooks/useIsMobile';
import { Flex, Typography } from '@local/shared-components';
import styled from 'styled-components';

const WaitingToJoinScreen = () => {
  const waitingMessages = [
    { index: 0, text: 'Connecting to doctor now...' },
    { index: 1, text: 'Almost there...' },
  ];
  const [message, setMessage] = useState(waitingMessages[0]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessage((s) =>
        s.index === waitingMessages.length - 1
          ? s
          : waitingMessages[s.index + 1]
      );
    }, 3000);

    return () => {
      clearInterval(intervalRef.current ?? 0);
    };
  }, []);

  const isTab = useIsTab();
  const isMobile = useIsMobile();

  const animationDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <StyledRoot fullWidth align="center" justify="center">
      <Flex direction="column">
        <div
          style={{
            height: isTab ? 200 : isMobile ? 200 : 250,
            width: isTab ? 200 : isMobile ? 200 : 250,
          }}
        >
          <Lottie
            loop={animationDefaultOptions.loop}
            autoplay={animationDefaultOptions.autoplay}
            animationData={animationDefaultOptions.animationData}
            rendererSettings={{
              preserveAspectRatio:
                animationDefaultOptions.rendererSettings.preserveAspectRatio,
            }}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <Typography
          color="common.white"
          align="center"
          variant="bodyLg"
          weight="bold"
        >
          {message.text}
        </Typography>
      </Flex>
    </StyledRoot>
  );
};

export default WaitingToJoinScreen;

const StyledRoot: typeof Flex = styled(Flex)`
  height: 100vh;
`;
