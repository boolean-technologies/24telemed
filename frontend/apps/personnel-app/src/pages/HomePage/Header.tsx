import { Flex, Typography } from '@local/shared-components';
import styled from 'styled-components';
import { useCurrentUser } from '@local/api-generated';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Header = (): JSX.Element => {
  const { data } = useCurrentUser();

  const userName = data?.first_name || data?.last_name || data?.email;

  return (
    <StyledHeader fullWidth padding="xl" xsPadding="md" justify="space-between">
      <Flex direction="column" gap="xs" flex={1}>
        <Typography variant="bodyLg">Hi {userName},</Typography>
        <Typography variant="h3">Welcome to your assistant view </Typography>
      </Flex>
      <Avatar src={data?.photo} icon={<UserOutlined />} size={60} />
    </StyledHeader>
  );
};

const StyledHeader = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.primary2.main};
  border-bottom-left-radius: ${({ theme }) => theme.spacing.xl};
  border-bottom-right-radius: ${({ theme }) => theme.spacing.xl};
  min-height: 150px;
`;

export default Header;
