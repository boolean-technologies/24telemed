import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { IconButton } from '../../IconButton';
import { useEffect, useState } from 'react';
import Sound from '../../../../../public/notisound.wav'
type ChatButtonProps = {
  onClick: () => void;
  active: boolean;
};

export function ChatButton({ onClick, active }: ChatButtonProps) {
  const [count, setCount] = useState(0);

  const { localParticipant } = useMeeting();

  useEffect(() => {
    if (active) setCount(0);
  }, [active, count]);
  const notificationSound = new Audio(Sound);
  usePubSub('CHAT', {
    onMessageReceived: (incomingMessage) => {
      if (incomingMessage.senderId !== localParticipant.id && !active) {
        setCount((prev) => prev + 1);
        notificationSound.play();
      }
    },
  });

  return (
    <IconButton
      badgeCount={count}
      icon="chatbubbles"
      onClick={onClick}
      tooltip="Send message"
      label="Chats"
      variant={active ? 'primary2' : undefined}
    />
  );
}
