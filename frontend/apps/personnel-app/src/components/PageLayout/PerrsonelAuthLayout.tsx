import { Flex, Logo, Typography } from '@local/shared-components';
import React from 'react';
import { BG } from '../../assets';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  name: string | null;
  description: string | null;
}

export function PersonnelAuthLayout({ children, name, description }: Props) {
  return (
    <StyledRoot
      direction="column"
      gap="sm"
      fullHeight
      justify="center"
      align="flex-start"
    >
      <HeaderImage src={BG} alt="header-image" />
      <Flex
        direction="column"
        align="center"
        justify="center"
        padding="md"
        fullHeight
        fullWidth
        style={{ maxWidth: 860, margin: 'auto', zIndex: 1 }}
      >
        <Flex
          direction="column"
          smAlign="center"
          gap="xl"
          align="flex-start"
          fullWidth
        >
          <Logo size="xl" />
          <div>
            <Typography variant="bodyXl" weight="bold">
              {name}
            </Typography>
            <Typography>{description}</Typography>
          </div>
        </Flex>
        {children}
      </Flex>
      <Flex fullWidth padding="md" align="center" justify="center">
        <Typography variant="bodySm">
          Anambra State Telemed @{new Date().getFullYear()}
        </Typography>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
  height: 100vh;
  width: 100vw;
`;
const HeaderImage = styled.img`
  width: 300px;
  height: 200px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
`;
