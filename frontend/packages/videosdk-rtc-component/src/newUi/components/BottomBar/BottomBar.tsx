import { Flex } from '@local/shared-components';
import { ChatButton } from './ChatButton';
import { ParticipantsButton } from './ParticipantsButton';
import { VideoButton } from './VideoButton';
import { MicButton } from './MicButton';
import { ShareScreenButton } from './ShareScreenButton';
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
    <Flex padding="md">
      <Flex>
        <ChatButton active={currentView === 'chats'} onClick={onChatClick} />
        <ParticipantsButton
          active={currentView === 'participants'}
          onClick={onParticipantClick}
        />
        <MenuButton active={currentView === 'menu'} onClick={onMenuClick} />
      </Flex>
      <Flex fullWidth justify="center">
        <Flex>
          <VideoButton />
          <MicButton />
          <ShareScreenButton />
          <RecordCallButton />
        </Flex>
      </Flex>
      <Flex>
        <HelpButton />
        <EndCallButton />
      </Flex>
    </Flex>
  );
}
