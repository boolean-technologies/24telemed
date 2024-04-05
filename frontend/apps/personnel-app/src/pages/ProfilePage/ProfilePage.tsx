import { useCurrentUser } from '@local/api-generated';
import { Flex, Typography, defaultTheme } from '@local/shared-components';
import { Image, List, Drawer, Card } from 'antd';
import styled from 'styled-components';
import {
  KeyOutlined,
  BookOutlined,
  FileOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import { PasswordForm } from './PasswordForm';

export function ProfilePage() {
  const [drawer, setDrawer] = useState<
    undefined | 'terms' | 'privacy' | 'password'
  >();
  const { data: currentUser } = useCurrentUser();
  const fullName = [currentUser?.first_name, currentUser?.last_name]
    .filter(Boolean)
    .join(' ');
  const data = [
    {
      name: 'Change Password',
      value: '*******',
      icon: <KeyOutlined />,
      onClick: () => {
        setDrawer('password');
      },
    },
    {
      name: 'Terms of service',
      icon: <BookOutlined />,
      onClick: () => {
        setDrawer('terms');
      },
    },
    {
      name: 'Privacy Policy',
      icon: <FileOutlined />,
      onClick: () => {
        setDrawer('privacy');
      },
    },
  ];

  return (
    <Root fullWidth direction="column" padding="xl">
      <StyledCard>
        <NeutralFlex
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Image
            width={150}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            fallback="https://via.placeholder.com/150"
            style={{ borderRadius: 75 }}
          />

          <Flex direction="column" justifyContent="center" alignItems="center">
            <Typography variant="bodyMd" weight="bold">
              {fullName}
            </Typography>
            <Typography variant="bodyMd">{currentUser?.email}</Typography>
          </Flex>
        </NeutralFlex>
      </StyledCard>
      <AccountSettings>
        <Typography variant="bodyXl" weight="bold">
          Assistant Settings{' '}
        </Typography>
      </AccountSettings>
      <Flex direction="column" gap="xl">
        <List
          dataSource={data}
          className="demo-loadmore-list"
          renderItem={(item) => (
            <List.Item
              actions={[
                <a onClick={item.onClick}>
                  <ArrowRightOutlined />
                </a>,
              ]}
              style={{
                backgroundColor: defaultTheme.palette.neutral.light,
                borderRadius: '10px',
                padding: '10px',
                marginBottom: '20px',
              }}
            >
              <List.Item.Meta
                avatar={item.icon}
                title={item.name}
                description={item.value}
              />
            </List.Item>
          )}
        />
      </Flex>
      <Drawer
        title="Assistant Settings"
        placement="right"
        closable={false}
        onClose={() => setDrawer(undefined)}
        open={!!drawer}
        key={drawer}
      >
        {
          // TODO: Replace with the real terms of service
          drawer === 'terms' && <TermsOfService />
        }
        {
          // TODO: Replace with the real privacy policy
          drawer === 'privacy' && <PrivacyPolicy />
        }
        {drawer === 'password' && <PasswordForm />}
      </Drawer>
    </Root>
  );
}

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.palette.neutral.light};
`;

const Root = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
`;

const AccountSettings = styled(Flex)``;

const NeutralFlex = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.main};
`;
