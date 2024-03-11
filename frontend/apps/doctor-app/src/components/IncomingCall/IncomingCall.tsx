import { Button, Modal, Input, Skeleton } from 'antd';
import styled, { keyframes } from 'styled-components';
import { Flex, Typography } from '@local/shared-components';
import callIcon from '../../assets/incoming-call.png';
import { UserAvatar } from '../PageLayout/UserAvatar';
import { CallPriority } from './CallPriority';
import { useIncomingCall } from './useIncomingCall';
import { useGetPersonnel } from '../../api/personnels';

const { TextArea } = Input;

export function IncomingCall() {
  const {
    message,
    showNoteInput,
    hasIncomingCall,
    setDeclineNote,
    setShowNoteInput,
    handleAnswerCall,
    handleDeclineCall,
  } = useIncomingCall();

  const { data: personnelData, isPending } = useGetPersonnel(message?.data?.health_care_assistant);

  return (
    <StyledModal
      title="Incoming call"
      open={hasIncomingCall}
      footer={null}
      width={350}
    >
      <Flex align="center" justify="center" direction="column">
        <VibratingRippleDiv align="center" justify="center">
          <StyledCallIcon src={callIcon} />
        </VibratingRippleDiv>
        <StyledCallerWrapper fullWidth padding="sm" direction="column">
          <Flex fullWidth justify="space-between">
            {isPending ? (
              <Skeleton avatar active paragraph={{ rows: 1 }} style={{ background: "rgba(255, 255, 255, 0.6)", padding: 16, borderRadius: 8 }} />
            ): (
              <>
              <UserAvatar />
            <Flex direction="column" gap="none" fullWidth>
              <Typography weight="bold" color="common.white">
                {personnelData?.first_name} {personnelData?.last_name}
              </Typography>
              <Typography variant="bodySm" color="secondary3.light">
                ID: {personnelData?.username}
              </Typography>
            </Flex>
            <CallPriority priority={message?.data?.priority} />
              </>
            )}
            
          </Flex>
          <Typography color="common.white" weight="bold">
            {message?.data?.notes}
          </Typography>
          {showNoteInput && (
            <TextArea
              rows={4}
              placeholder="Please enter decline note (optional)"
              onChange={(e) => setDeclineNote(e.target.value)}
            />
          )}
        </StyledCallerWrapper>

        <Flex fullWidth>
          {showNoteInput ? (
            <Button
              type="primary"
              onClick={handleDeclineCall}
              style={{ flex: 1 }}
              danger
            >
              <Typography weight="bold" color="common.white" align="center">
                Confirm Decline
              </Typography>
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => setShowNoteInput(true)}
              style={{ flex: 1 }}
              danger
            >
              <Typography weight="bold" color="common.white" align="center">
                Decline
              </Typography>
            </Button>
          )}
          <Button onClick={handleAnswerCall} type="primary" style={{ flex: 1 }}>
            <Typography weight="bold" color="common.white" align="center">
              Answer
            </Typography>
          </Button>
        </Flex>
      </Flex>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  color: #fff;
  .ant-modal-content,
  .ant-modal-header {
    background: #000;
  }
  .ant-modal-title {
    color: #fff;
  }
`;

const StyledCallIcon = styled.img`
  width: 80px;
  height: 80px;
`;

const vibrateAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const rippleAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const VibratingRippleDiv = styled(Flex)`
  position: relative;
  animation: ${vibrateAnimation} 0.5s infinite;
  margin-top: 70px;
  margin-bottom: 70px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${rippleAnimation} 1s infinite ease-out;
    z-index: -1;
  }
`;

const StyledCallerWrapper = styled(Flex)`
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-right: 0;
  padding-left: 0;
`;
