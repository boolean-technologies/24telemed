import React from 'react';
import {
  Flex,
  TextInput,
  Typography,
  FlexProps,
  NavBar,
  NavLink,
  StarIcon,
  Button,
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

      <BottomNav>
        <NavLink to="/home" label="Home" color='primary' topIcon={() => <StarIcon />} />
        <NavLink to="/history" label="History" color='primary' topIcon={() => <StarIcon />} />
        <NavLink to="/profile" label="Profile" color='primary' topIcon={() => <StarIcon />} />
        <NavLink to="/logout" label="Logout" color='primary' topIcon={() => <StarIcon />} />
      </BottomNav>
    </Root>
  );
}

const Content = styled(Flex)<FlexProps>``;

const Root = styled(Flex)<FlexProps>``;

const BottomNav = styled(NavBar)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;