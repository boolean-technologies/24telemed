import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeFilled,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button,Avatar } from 'antd';
import styled, { useTheme } from 'styled-components';
import {
  Flex,
  Logo,
  Theme,
  Typography,
} from '@local/shared-components';
import { UserAvatar } from './UserAvatar';
import { IncomingCall } from '../IncomingCall';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Path } from '../../constants';
import { LogoutButton } from '../LogoutButton';
import { useCurrentUser } from '@local/api-generated';

const { Header, Sider, Footer } = Layout;

export function PageLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme() as Theme;
  const { data: user } = useCurrentUser();

  const navigate = useNavigate();
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <StyledRoot>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={270}
        style={{
          background: theme.palette.primary2.main,
          padding: theme.spacing.sm,
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <Flex gap="md" direction="column" align="center" fullHeight>
          <Flex gap="md" direction="column" align="center" fullHeight fullWidth>
            <Logo size={collapsed ? 'sm' : 'lg'} />
            {!collapsed && (
              <Typography variant="h3" align="center" weight="bold">
                Anambra State Doctor Connect System
              </Typography>
            )}
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <HomeFilled />,
                  label: collapsed ? null : 'Dashboard',
                  style: { height: 45 },
                  onClick: () => navigate(Path.home),
                },
              ]}
              style={{
                width: collapsed ? 50 : undefined,
                borderRadius: 10,
                fontWeight: 'bold',
                backgroundColor: 'transparent',
              }}
            />
          </Flex>
            {collapsed ? (
              <Link to={Path.profile} style={{ cursor: 'pointer' }}>
                <Avatar src={user?.photo} icon={<UserOutlined />} size={50} />
              </Link>
            ) : (
              <StyledAccountUser
                padding="sm"
                gap="xs"
                fullWidth
                justify="space-between"
              >
              <Link to={Path.profile} style={{ cursor: 'pointer' }}>
                <Flex>
                <Avatar src={user?.photo} icon={<UserOutlined />} size={50} />
                <Flex direction="column" gap="none">
                  <Typography weight="bold" color="common.white">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="bodyXs" color="common.white" noWrap>
                    ID: {user?.user_id}
                  </Typography>
                </Flex>
                <LogoutButton />
                </Flex>
                </Link>
              </StyledAccountUser>
            )}
        </Flex>
      </Sider>
      <Layout
        style={{
          position: 'fixed',
          width: `calc(100% - ${collapsed ? 80 : 270}px)`,
          left: collapsed ? 80 : 270,
          overflowY: 'scroll',
        }}
      >
        <Header
          style={{
            paddingLeft: theme.spacing.sm,
            background: theme.palette.common.white,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapse}
            style={{
              fontSize: theme.typography.bodySm.fontSize,
              width: 40,
              height: 40,
            }}
          />
        </Header>
        <StyledInnerContainer
          fullHeight
          fullWidth
          align="center"
          direction="column"
        >
          <StyledContainer fullHeight fullWidth padding="md" direction="column">
            <Flex fullHeight fullWidth align="flex-start" direction="column">
              <div style={{ width: "100%" }}>
                <Outlet />
              </div>
              <Footer style={{ textAlign: 'center', width: '100%', marginTop: 16 }}>
                <Typography align="center" variant="bodySm">
                  <strong>Anambra State Doctor Connect</strong> ©
                  {new Date().getFullYear()} Created by The Boolean Tech
                </Typography>
              </Footer>
            </Flex>
          </StyledContainer>
        </StyledInnerContainer>
      </Layout>
      <IncomingCall />
    </StyledRoot>
  );
}

const StyledRoot = styled(Layout)`
  height: 100vh;
`;

const StyledAccountUser = styled(Flex)`
  background: ${({ theme }) => theme.palette.primary1.main};
  border-radius: 8px;
  overflow: hidden;
`;

const StyledContainer = styled(Flex)`
  max-height: calc(100vh - 64px);
  max-width: 1200px;
`;

const StyledInnerContainer = styled(Flex)`
  width: 100%;
  height: calc(100vh - 64px);
  overflow-y: scroll;
  margin: auto;
`;
