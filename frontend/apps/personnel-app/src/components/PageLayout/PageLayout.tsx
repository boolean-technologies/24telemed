import { NavBar, TabBar, Dialog } from 'antd-mobile';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';

import styled, { useTheme } from 'styled-components';
import { Path } from '../../constants';
import { IonIcon, Theme, Typography, useLogout } from '@local/shared-components';
import { Layout } from 'antd';

export function PageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const handleLogout = useLogout();

  const theme = useTheme() as Theme;

  const tabs = [
    {
      path: Path.home,
      title: 'Search',
      iconName: "search",
    },
    {
      path: Path.history,
      title: 'History',
      iconName: "call",
    },
    {
      path: Path.profile,
      title: 'Profile',
      iconName: "person",
    },
    {
      path: Path.logout,
      title: 'Logout',
      iconName: "log-out",
    },
  ];

  const currentTab = tabs.find((tab) => tab.path === pathname);

  const onLogout = () => {
    Dialog.confirm({
      content: 'Are you sure, you want to logout?',
      closeOnMaskClick: true,
      confirmText: 'Yes, Continue',
      cancelText: 'Cancel',
      onConfirm: handleLogout,
    });
  };

  const showHeader = currentTab?.path !== Path.home;

  return (
    <StyledRoot>
      {showHeader ? (
        <StyledTop>
          <NavBar onBack={() => navigate(-1)} style={{ height: 60 }}>
            <Typography variant="h5" align="center">
              {currentTab?.title}
            </Typography>
          </NavBar>
        </StyledTop>
      ) : null}
      <StyledContainer style={{ top: showHeader ? 60 : 0 }}>
        <Outlet />
      </StyledContainer>
      <StyledBottom>
        <TabBar
          activeKey={pathname}
          onChange={(value) => {
            if (value === Path.logout) onLogout();
            else navigate(value);
          }}
        >
          {tabs.map((item) => {
            const isActive = currentTab?.path === item.path;
            return (
              <TabBar.Item
                key={item.path}
                icon={<IonIcon name={item.iconName} outlined={!isActive} />}
                title={item.title}
                style={{
                  ...(isActive
                    ? {
                        fontWeight: 'bold',
                        background: theme.palette.common.black,
                        color: theme.palette.primary2.main,
                      }
                    : {}),
                  height: 65,
                  fontSize: 16,
                }}
              />
            )
          })}
        </TabBar>
      </StyledBottom>
    </StyledRoot>
  );
}

const StyledTop = styled.div`
  border-bottom: solid 1px var(--adm-color-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1;
`;

const StyledBottom = styled.div`
  flex: 0;
  border-top: solid 1px var(--adm-color-border);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1;
`;

const StyledRoot = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

const StyledContainer = styled(Layout)`
  position: fixed;
  bottom: 65px;
  left: 0;
  right: 0;
  overflow: scroll;
  z-index: 0;
`;
