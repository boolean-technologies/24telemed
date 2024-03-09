import styled from 'styled-components';
import { Flex } from '../Flex';
import { Typography } from '../Typography';
import { Spin } from 'antd';

export function PageLoading() {
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

const StyledRoot = styled(Flex)`
  width: 100vw;
  height: 100vh;
`;
