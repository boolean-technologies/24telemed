import React from 'react';
import {
  Flex,
  TextInput,
  Typography,
  FlexProps,
} from '@local/shared-components';
import styled from 'styled-components';
import Header from './Header';

export function HomePage(): JSX.Element {
  return (
    <Root direction="column">
      <Header />
      <Content fullWidth padding="xl" direction="column">
        <Typography variant="bodyMd">Find patient's profile</Typography>
        <TextInput
          placeholder="Search for a patient"
          onChange={() => {}}
          name="search"
        />
      </Content>
    </Root>
  );
}

const Content = styled(Flex)<FlexProps>``;

const Root = styled(Flex)<FlexProps>``;