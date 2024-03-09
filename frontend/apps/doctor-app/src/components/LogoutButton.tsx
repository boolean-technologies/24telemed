import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { LogoutIcon } from '@local/shared-components';
import { TOKEN_KEY } from '@local/api-generated';

const { confirm } = Modal;

export function LogoutButton() {

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
      onOk() {
        localStorage.removeItem(TOKEN_KEY);
        window.location.assign("/")
      },
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
