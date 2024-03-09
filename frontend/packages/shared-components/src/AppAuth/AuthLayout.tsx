import { Spin } from 'antd';
import { useAuthWatcher } from '@local/api-generated';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Typography } from '../Typography';
import { Flex } from '../Flex';
import { Path } from './paths';

export function AuthLayout() {
  const { isPending } = useAuthWatcher([Path.login], Path.login, Path.home);

  if (isPending) {
    return (
      <StyledRoot align="center" justify="center" direction="column">
        <Spin size="large" />
        <Typography
          align="center"
          weight="bold"
          variant="bodySm"
          color="primary2.main"
        >
          Loading...
        </Typography>
      </StyledRoot>
    );
  }

  return <Outlet />;
}

const StyledRoot = styled(Flex)`
  width: 100vw;
  height: 100vh;
`;
