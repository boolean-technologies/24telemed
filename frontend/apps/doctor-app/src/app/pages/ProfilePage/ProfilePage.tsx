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
import userAvatar from '../../../assets/avatar.png';
import { useState } from 'react';
import { NameForm } from './Forms/NameForm';
import { UserNameForm } from './Forms/UserNameForm';
import { EmailForm } from './Forms/EmailForm';
import { PasswordForm } from './Forms/PasswordForm';
import { LocationForm } from './Forms/LocationForm';
import { SpecialtyForm } from './Forms/SpecialtyForm';
import styled from 'styled-components';

type DrawerFormType =
  | 'email'
  | 'username'
  | 'name'
  | 'location'
  | 'password'
  | 'specialty';

export function ProfilePage() {
  const [drawerForm, setDrawerForm] = useState<DrawerFormType>();
  const data = [
    {
      name: 'Email',
      value: 'tobi.sholanke@mailer.com',
      icon: <MailOutlined />,
      onClick: () => setDrawerForm('email'),
    },
    {
      name: 'Username',
      value: 'tobi.sholanke',
      icon: <CheckCircleOutlined />,
      onClick: () => setDrawerForm('username'),
    },
    {
      name: 'Name',
      value: 'Sholanke Tobi',
      icon: <UserOutlined />,
      onClick: () => setDrawerForm('name'),
    },
    {
      name: 'Location',
      value: 'Lagos, Island',
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
      name: 'Specialty',
      value:
        "These steps outline how to customize Ant Design's theme, including the height of form inputs, within a Create React App project without ejecting, providing a streamlined way to apply global theme customizations.",
      icon: <BookOutlined />,
      onClick: () => setDrawerForm('specialty'),
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
        {drawerForm === "name" && <NameForm />}
        {drawerForm === "username" && <UserNameForm />}
        {drawerForm === "email" && <EmailForm />}
        {drawerForm === "location" && <LocationForm />}
        {drawerForm === "password" && <PasswordForm />}
        {drawerForm === "specialty" && <SpecialtyForm />}
      </Drawer>
    </StyledRoot>
  );
}


const StyledRoot = styled(Flex)`
    max-width: 860px;
    margin: 0 auto;
`;