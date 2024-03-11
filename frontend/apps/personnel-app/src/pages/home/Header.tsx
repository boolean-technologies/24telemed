import { Flex, Typography } from '@local/shared-components'
import React from 'react'
import styled from 'styled-components'
import { UserAvatar } from '../../assets'

const Header = (): JSX.Element => {
  return (
    <StyledHeader fullWidth padding="xl" justify="space-between" >
      <Flex direction='column' >
        {/* TODO - replace with user's name */}
        <Typography >Hi Jane Doe,</Typography>
        <Typography variant="h5">Welcome to your assistant view </Typography>
      </Flex>
      <UserImage src={UserAvatar} alt="User Avatar" />
    </StyledHeader>
  )
}

const StyledHeader = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.primary2.main};
  border-bottom-left-radius: ${({ theme }) => theme.spacing.xl};
  border-bottom-right-radius: ${({ theme }) => theme.spacing.xl};
  height: 150px;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spacing.xl};
`;


export default Header
