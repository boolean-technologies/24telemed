import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { IconButton } from '../../IconButton';
import { message } from 'antd';
import { playNotificationSound } from '../../../../utils'
export function RaiseHandButton() {
  const { localParticipant } = useMeeting();

  const { publish } = usePubSub('RAISEHAND', {
    onMessageReceived: (incomingMessage) => {
      if (incomingMessage?.senderId !== localParticipant?.id) {
        message.info(incomingMessage.message, 10);
        playNotificationSound();
      }
    },
  });


  return (
    <IconButton
      icon="hand-right"
      onClick={() =>
        publish(localParticipant?.displayName + ' has raised a hand', {
          persist: false,
        })
      }
      tooltip="Raise hand"
    />
  );
}
