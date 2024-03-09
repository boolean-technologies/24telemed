import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, TabBar } from 'antd-mobile';
import styled from 'styled-components';
import { StarIcon, HistoryIcon, ProfileIcon, LogoutIcon } from '@local/shared-components';


type Tabs = {
  key: string;
  title: string;
  icon: React.ReactNode;
};

const tabs: Tabs[] = [
  {
    key: '/dashboard',
    title: 'Home',
    icon: <StarIcon />,
  },
  {
    key: '/history',
    title: 'History',
    icon: <HistoryIcon />,
  },

  {
    key: '/profile',
    title: 'Profile',
    icon: <ProfileIcon />,
  },
  {
    key: '/logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
  
];

function BottomTab() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const setRouteActive = (key: string) => {
    navigate(key);
  };

  return (
    <Bottom>
      <TabBar activeKey={pathname} onChange={setRouteActive}>
        {tabs.map((tab) => (
          <TabBar.Item key={tab.key} title={tab.title} icon={tab.icon} 
          />
        ))}
      </TabBar>
    </Bottom>
  );
}

export default BottomTab;

const Bottom = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;
