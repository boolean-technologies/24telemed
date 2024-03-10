import { NavBar, TabBar, Dialog } from 'antd-mobile';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';

import styled, { useTheme } from 'styled-components';
import { Path } from '../../constants';
import { IonIcon, Theme, Typography, useLogout } from '@local/shared-components';

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

  return (
    <StyledRoot>
      {currentTab?.path !== Path.home ? (
        <StyledTop>
          <NavBar onBack={() => navigate(-1)} style={{ height: 60 }}>
            <Typography variant="h5" align="center">
              {currentTab?.title}
            </Typography>
          </NavBar>
        </StyledTop>
      ) : null}
      <StyledContainer>
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
  flex: 0;
  border-bottom: solid 1px var(--adm-color-border);
`;

const StyledBottom = styled.div`
  flex: 0;
  border-top: solid 1px var(--adm-color-border);
`;

const StyledRoot = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
