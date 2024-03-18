import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { LogoutIcon, useLogout } from '@local/shared-components';

const { confirm } = Modal;

export function LogoutButton() {

  const handleLogout = useLogout();

  const showConfirm = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    confirm({
      title: 'Are you sure you want to log out?',
      icon: <ExclamationCircleOutlined />,
      content: 'Logging out will end your current session.',
      okText: 'Log Out',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleLogout(),
    });
  };

  return (
    <StyledLogoutIconButton onClick={(e) => showConfirm(e as unknown as Event)}>
      <LogoutIcon color="primary1.light" />
    </StyledLogoutIconButton>
  );
}

const StyledLogoutIconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;
