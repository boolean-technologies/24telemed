import { Card, Flex } from '@local/shared-components';
import { Image, Divider, List, Drawer, Avatar, message, Upload } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  KeyOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { NameForm } from './Forms/NameForm';
import { UserNameForm } from './Forms/UserNameForm';
import { EmailForm } from './Forms/EmailForm';
import { PasswordForm } from './Forms/PasswordForm';
import { LocationForm } from './Forms/LocationForm';
import styled from 'styled-components';
import {
  useCurrentUser,
  useUpdateUser,
  useUploadFile,
  File,
} from '@local/api-generated';
import { DescriptionForm } from './Forms/DescriptionForm';
import type { RcFile } from 'antd/es/upload/interface';

type DrawerFormType =
  | 'email'
  | 'username'
  | 'name'
  | 'location'
  | 'password'
  | 'description';

export function ProfilePage() {
  const { data: user, refetch } = useCurrentUser();
  const { mutateAsync: uploadFile, isPending: uploading } = useUploadFile();
  const { mutateAsync: updateUser } = useUpdateUser();

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

      value: user?.location || 'Not set',
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

      value: user?.description || 'Not set',
      icon: <BookOutlined />,
      onClick: () => setDrawerForm('description'),
    },
  ];

  const handleImageUpload = async (file: RcFile) => {
    try {
      if (!file.type.startsWith('image/')) {
        message.error('You can only upload image files!');
        return false;
      }

      if (file.size / 1024 / 1024 > 5) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }

      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await uploadFile(formData as File);
      if (uploadResponse?.id && user?.id) {
        await updateUser({
          id: user.id,
          data: {
            ...user,
            photo: uploadResponse.id || undefined,
          },
        });

        message.success('Profile photo updated successfully');
        refetch();
      }
    } catch (error: any) {
      message.error('Failed to upload image');
    }
  };
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
          <StyledAvatarContainer>
            <Avatar src={user?.photo} icon={<UserOutlined />} size={150} />
            <StyledUploadButton>
              <Upload
                name="file"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImageUpload(file);
                  return false;
                }}
                disabled={uploading}
                accept="image/*"
              >
                <StyledCameraIcon spin={uploading} />
                {uploading && <span className="ml-2">Uploading...</span>}
              </Upload>
            </StyledUploadButton>
          </StyledAvatarContainer>
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
        {drawerForm === 'name' && (
          <NameForm
            initialFirstName={user?.first_name || ''}
            initialLastName={user?.last_name || ''}
            userId={user?.id || ''}
            refetch={refetch}
            onClose={() => setDrawerForm(undefined)}
          />
        )}
        {drawerForm === 'username' && (
          <UserNameForm
            userId={user?.id || ''}
            refetch={refetch}
            initialUserName={user?.username || ''}
            onClose={() => setDrawerForm(undefined)}
          />
        )}
        {drawerForm === 'email' && <EmailForm />}
        {drawerForm === 'location' && (
          <LocationForm
            userId={user?.id || ''}
            refetch={refetch}
            initialLocation={user?.location || ''}
            onClose={() => setDrawerForm(undefined)}
          />
        )}
        {drawerForm === 'password' && (
          <PasswordForm onClose={() => setDrawerForm(undefined)} />
        )}
        {drawerForm === 'description' && (
          <DescriptionForm
            userId={user?.id || ''}
            refetch={refetch}
            initialDescription={user?.description || ''}
            onClose={() => setDrawerForm(undefined)}
          />
        )}
      </Drawer>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  max-width: 860px;
  margin: 0 auto;
`;
const StyledAvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledUploadButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #f0f0f0;
  }
`;

const StyledCameraIcon = styled(CameraOutlined)`
  font-size: 20px;
  color: #1890ff;
`;
