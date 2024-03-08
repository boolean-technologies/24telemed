import { Card, Flex, Theme, Typography } from '@local/shared-components';
import { Tag, List, Avatar } from 'antd';
import styled, { useTheme } from 'styled-components';
import {
  MailOutlined,
  IdcardOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { UserAvatar } from '../../../components/PageLayout/UserAvatar';

export function ProfilePreview() {
  const theme = useTheme() as Theme;

  const data = [
    {
      title: 'Email',
      value: 'tobisholanke@gmail.com',
      icon: MailOutlined,
    },
    {
      title: 'Doctor ID',
      value: '12345678',
      icon: IdcardOutlined,
    },
    {
      title: 'Specialty',
      value: 'Therapist and general practitioner',
      icon: FileProtectOutlined,
    },
  ];

  return (
    <StyledCard>
      <Flex direction="column" align="center">
        <UserAvatar size="lg" />
        <Flex direction="column" gap="none" align="center">
          <Typography weight="bold" align="center">
            Dr. Ronald Eze
          </Typography>
          <Tag color={theme.palette.primary2.main}>
            <Typography variant="bodySm">Therapist</Typography>
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
  width: 100%;
  max-width: 350px;
`;
