import styled from 'styled-components';
import { IconButton } from '../../IconButton';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMeeting } from '@videosdk.live/react-sdk';
import { useNavigate } from 'react-router-dom';
import { useBreakpoints } from '@local/shared-components';
import { useCallback } from 'react';
import { Dialog } from 'antd-mobile';

export function EndCallButton() {
  const navigate = useNavigate();
  const { end } = useMeeting();
  const { isMobile } = useBreakpoints();

  const confirmEndCall = () => {
    end();
    navigate('/');
  };

  const handleEndCall = useCallback(() => {
    if (isMobile) {
      Dialog.confirm({
        content: 'Are you sure you want to end the call?',
        closeOnMaskClick: true,
        confirmText: 'Yes, End call',
        cancelText: 'Cancel',
        onConfirm: confirmEndCall,
      });
    } else {
      Modal.confirm({
        title: 'Are you sure you want to end the call?',
        icon: <ExclamationCircleOutlined />,
        content: 'Ending call will end your current call session.',
        okText: 'End call',
        okType: 'danger',
        cancelText: 'Stay in call',
        onOk: confirmEndCall,
      });
    }
  }, [isMobile]);

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
