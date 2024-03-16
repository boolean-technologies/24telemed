import { Flex, Typography } from '@local/shared-components';
import { ChatButton } from './ChatButton';
import { ParticipantsButton } from './ParticipantsButton';
import { VideoButton } from './VideoButton';
import { MicButton } from './MicButton';
import { RaiseHandButton, ShareScreenButton } from './RaiseHandButton';
import { RecordCallButton } from './RecordCallButton';
import { HelpButton } from './HelpButton';
import { EndCallButton } from './EndCallButton';
import { MenuButton } from './MenuButton';
import { StreamAreaProps } from '../StreamArea';

type BottomBarProps = {
  currentView: StreamAreaProps['sideView'];
  onMenuClick: () => void;
  onChatClick: () => void;
  onParticipantClick: () => void;
};

export function BottomBar({
  currentView,
  onChatClick,
  onMenuClick,
  onParticipantClick,
}: BottomBarProps) {
  return (
    <Flex>
      <Flex gap="xs">
        <Typography color="common.white" weight="bold">
          2:46AM
        </Typography>
        <Typography color="common.white" weight="bold">
          |
        </Typography>
        <Typography color="common.white" weight="bold">
        Patient: Mercy Josh
        </Typography>
      </Flex>
      <Flex fullWidth justify="center" flex={1}>
          <VideoButton />
          <MicButton />
          <RaiseHandButton />
          <RecordCallButton />
          <EndCallButton />
      </Flex>
      <Flex justify="flex-end">
        <HelpButton />
        <ChatButton active={currentView === 'chats'} onClick={onChatClick} />
        <ParticipantsButton
          active={currentView === 'participants'}
          onClick={onParticipantClick}
        />
        <MenuButton active={currentView === 'menu'} onClick={onMenuClick} />
      </Flex>
    </Flex>
  );
}
