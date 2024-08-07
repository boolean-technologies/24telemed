import { Card, Flex, Theme, Typography } from '@local/shared-components';
import { Tag, List, Avatar } from 'antd';
import styled, { useTheme } from 'styled-components';
import {
  MailOutlined,
  IdcardOutlined,
  FileProtectOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { User } from '@local/api-generated';

type ProfilePreviewProps = {
  user: User;
};
export function ProfilePreview({ user }: ProfilePreviewProps) {
  
  
  const theme = useTheme() as Theme;

  const data = [
    {
      title: 'Email',
      value: user?.email,
      icon: MailOutlined,
    },
    {
      title: 'Doctor ID',
      // TODO: replace with actual doctor id
      value: user?.user_id,
      icon: IdcardOutlined,
    },
    {
      title: 'Specialty',
      value: user?.specialty,
      icon: FileProtectOutlined,
    },
  ];

  return (
    <StyledCard>
      <Flex direction="column" align="center">
         <Avatar src={user?.photo} size={150} icon={<UserOutlined />} />
        <Flex direction="column" gap="none" align="center">
          <Typography weight="bold" align="center">
            {`${user?.first_name} ${user?.last_name}`}
          </Typography>
          <Tag color={theme.palette.primary2.main}>
            <Typography variant="bodySm">{
              user?.description || user.specialty || 'No description'
              
              }</Typography>
          </Tag>
        </Flex>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={({ icon: Icon, ...item }) => (
            <List.Item key={item.title}>
              <List.Item.Meta
                avatar={
                  <Icon
                    style={{ fontSize: 28, color: theme.palette.primary2.main }}
                  />
                }
                title={item.title}
                description={item.value}
                style={{ alignItems: 'center' }}
              />
            </List.Item>
          )}
          style={{ width: '100%' }}
        />
      </Flex>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  max-width: 350px;
`;
