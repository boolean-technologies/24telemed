import styled from 'styled-components';
import { IconButton } from '../../IconButton';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMeeting } from '@videosdk.live/react-sdk';
import { useNavigate } from 'react-router-dom';

export function EndCallButton() {
  const navigate = useNavigate();
  const { end } = useMeeting();

  const handleEndCall = () => {
    Modal.confirm({
      title: 'Are you sure you want to end the call?',
      icon: <ExclamationCircleOutlined />,
      content: 'Ending call will end your current call session.',
      okText: 'End call',
      okType: 'danger',
      cancelText: 'Stay in call',
      onOk: () => {
        end();
        navigate("/");
      },
    });
  };

  return (
    <StyledIconButton
      icon="call"
      iconBold
      variant="primaryDanger"
      onClick={handleEndCall}
      tooltip="End call"
    />
  );
}

const StyledIconButton = styled(IconButton)`
  ion-icon {
    transform: rotate(135deg);
  }
`;
