import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { IconButton } from '../../IconButton';
import { useEffect, useState } from 'react';
import {playNotificationSound} from '../../../../utils'
type ChatButtonProps = {
  onClick: () => void;
  active: boolean;
  hideLabel?: boolean;
};

export function ChatButton({ onClick, active, hideLabel }: ChatButtonProps) {
  const [count, setCount] = useState(0);

  const { localParticipant } = useMeeting();

  useEffect(() => {
    if (active) setCount(0);
  }, [active, count]);

  usePubSub('CHAT', {
    onMessageReceived: (incomingMessage) => {
      if (incomingMessage.senderId !== localParticipant.id && !active) {
        setCount((prev) => prev + 1);
        playNotificationSound()
      }
    },
  });

  return (
    <IconButton
      badgeCount={count}
      icon="chatbubbles"
      onClick={onClick}
      tooltip="Send message"
      label={hideLabel ? undefined : "Chats"}
      variant={active ? 'primary2' : undefined}
    />
  );
}
