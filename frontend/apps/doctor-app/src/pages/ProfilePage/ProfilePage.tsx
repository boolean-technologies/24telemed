import { Card, Flex } from '@local/shared-components';
import { Image, Divider, List, Drawer } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  KeyOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import userAvatar from '../../assets/avatar.png';
import { useState } from 'react';
import { NameForm } from './Forms/NameForm';
import { UserNameForm } from './Forms/UserNameForm';
import { EmailForm } from './Forms/EmailForm';
import { PasswordForm } from './Forms/PasswordForm';
import { LocationForm } from './Forms/LocationForm';
import { SpecialtyForm } from './Forms/SpecialtyForm';
import styled from 'styled-components';
import { useCurrentUser } from '@local/api-generated';
import { DescriptionForm } from './Forms/DescriptionForm';
type DrawerFormType =
  | 'email'
  | 'username'
  | 'name'
  | 'location'
  | 'password'
  | 'description';

export function ProfilePage() {
  const { data: user, refetch } = useCurrentUser();
  const name = `${user?.first_name} ${user?.last_name}`;
  const [drawerForm, setDrawerForm] = useState<DrawerFormType>();
  const data = [
    {
      name: 'Email',
      value: user?.email,
      icon: <MailOutlined />,
      onClick: () => setDrawerForm('email'),
    },
    {
      name: 'Username',
      value: user?.username,
      icon: <CheckCircleOutlined />,
      onClick: () => setDrawerForm('username'),
    },
    {
      name: 'Name',
      value: name,
      icon: <UserOutlined />,
      onClick: () => setDrawerForm('name'),
    },
    {
      name: 'Location',
      // TODO: replace with actual location
      value: 'Lagos, Nigeria',
      icon: <EnvironmentOutlined />,
      onClick: () => setDrawerForm('location'),
    },
    {
      name: 'Password',
      value: '********',
      icon: <KeyOutlined />,
      onClick: () => setDrawerForm('password'),
    },
    {
      name: 'Descriptipn',
      // TODO: replace with actual description
      value: 'I am a doctor',
      icon: <BookOutlined />,
      onClick: () => setDrawerForm('description'),
    },
  ];

  return (
    <StyledRoot
      direction="column"
      fullWidth
      flexWrap="nowrap"
      align="stretch"
      gap="lg"
    >
      <Card title="Profile" subtitle="Update your profile information">
        <Divider />
        <Flex direction="column" fullWidth align="center">
          <Image
            width={200}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            fallback={userAvatar}
            style={{ borderRadius: 200 }}
          />
          <Divider />
          <List
            style={{ width: '100%' }}
            className="demo-loadmore-list"
            dataSource={data}
            renderItem={(item) => (
              <List.Item actions={[<a onClick={item.onClick}>Change</a>]}>
                <List.Item.Meta
                  avatar={item.icon}
                  title={item.name}
                  description={item.value}
                />
              </List.Item>
            )}
          />
        </Flex>
      </Card>
      <Drawer
        title="Edit Profile"
        placement="right"
        closable={false}
        onClose={() => setDrawerForm(undefined)}
        open={!!drawerForm}
        key={drawerForm}
      >
        {drawerForm === 'name' && <NameForm />}
        {drawerForm === 'username' && <UserNameForm userId={user?.id || ""} refetch={refetch} defaultUsername={user?.username || ""} />}
        {drawerForm === 'email' && <EmailForm />}
        {drawerForm === 'location' && <LocationForm />}
        {drawerForm === 'password' && <PasswordForm />}
        {drawerForm === 'description' && <DescriptionForm />}
      </Drawer>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  max-width: 860px;
  margin: 0 auto;
`;
