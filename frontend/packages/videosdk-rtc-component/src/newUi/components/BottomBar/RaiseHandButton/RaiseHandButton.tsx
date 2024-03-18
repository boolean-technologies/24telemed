import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { IconButton } from '../../IconButton';
import { message } from 'antd';

export function RaiseHandButton() {
  const { localParticipant } = useMeeting();
  const { publish } = usePubSub('RAISEHAND', {
    onMessageReceived: (incomingMessage) => {
      if (incomingMessage.senderId !== localParticipant.id) {
        message.info(incomingMessage.message, 10);
        // TODO: Handle raise sound here
      }
    },
  });

  return (
    <IconButton
      icon="hand-right"
      onClick={() =>
        publish(localParticipant.displayName + ' has raised a hand', {
          persist: false,
        })
      }
      tooltip="Raise hand"
    />
  );
}
