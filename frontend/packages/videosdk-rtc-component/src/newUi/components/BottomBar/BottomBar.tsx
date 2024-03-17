import { Flex, Typography } from '@local/shared-components';
import { ChatButton } from './ChatButton';
import { ParticipantsButton } from './ParticipantsButton';
import { VideoButton } from './VideoButton';
import { MicButton } from './MicButton';
import { RaiseHandButton } from './RaiseHandButton';
import { PatientInfoButton } from './PatientInfoButton';
import { EndCallButton } from './EndCallButton';
import { MenuButton } from './MenuButton';
import { StreamAreaProps } from '../StreamArea';
import { useClock } from '../../hooks/useClock';
import { ClockDisplay } from './ClockDisplay';

type BottomBarProps = {
  meetingTitle: string;
  currentView: StreamAreaProps['sideView'];
  onMenuClick: () => void;
  onChatClick: () => void;
  onParticipantClick: () => void;
  hasNoteNotification: boolean;
};

export function BottomBar({
  meetingTitle = "",
  currentView,
  hasNoteNotification,
  onChatClick,
  onMenuClick,
  onParticipantClick,
}: BottomBarProps) {
  console.log("meetingTitle", meetingTitle);
  
  return (
    <Flex>
      <Flex gap="xs">
        <ClockDisplay />
        <Typography color="common.white" weight="bold">
          |
        </Typography>
        <Typography color="common.white" weight="bold">
        {meetingTitle}
        </Typography>
      </Flex>
      <Flex fullWidth justify="center" flex={1}>
          <VideoButton />
          <MicButton />
          <RaiseHandButton />
          {/* TODO: Fix record call button later */}
          {/* <RecordCallButton /> */}
          <EndCallButton />
      </Flex>
      <Flex justify="flex-end">
        <PatientInfoButton />
        <ParticipantsButton
          active={currentView === 'participants'}
          onClick={onParticipantClick}
          hasNotification={hasNoteNotification}
        />
        <MenuButton active={currentView === 'menu'} onClick={onMenuClick} />
        <ChatButton active={currentView === 'chats'} onClick={onChatClick} />
      </Flex>
    </Flex>
  );
}
