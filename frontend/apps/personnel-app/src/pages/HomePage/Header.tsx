import { Flex, Typography } from '@local/shared-components'
import React from 'react'
import styled from 'styled-components'
import { UserAvatar } from '../../assets'
import { useCurrentUser } from '@local/api-generated'

const Header = (): JSX.Element => {
  const { data } = useCurrentUser();

  const userName = data?.first_name || data?.last_name || data?.email;

  return (
    <StyledHeader fullWidth padding="xl" justify="space-between" >
      <Flex direction='column' gap='xs'>
        <Typography variant="bodyLg">Hi {userName},</Typography>
        <Typography variant="h3">Welcome to your assistant view </Typography>
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
