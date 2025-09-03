import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export function CallEnded() {
  return (
    <StyledRoot>
      <Flex direction="column" align="center" justify="center" gap="lg">
        <IonIcon name="time-outline" size="xl" color="common.white" />
        <Typography
          variant="bodyXl"
          weight="bold"
          color="common.white"
          align="center"
        >
          Call Ended
        </Typography>
        <Typography
          variant="bodyMd"
          color="common.white"
          align="center"
        >
          Thank you for using our service, we hope you had a great experience.
        </Typography>
        <Flex gap="md">
          <Link to="/">
            <Button
              type="primary"
              danger
              shape="round"
              size="middle"
              style={{ fontWeight: 'bold' }}
            >
              Return Home
            </Button>
          </Link>
        </Flex>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.palette.primary1.main};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;