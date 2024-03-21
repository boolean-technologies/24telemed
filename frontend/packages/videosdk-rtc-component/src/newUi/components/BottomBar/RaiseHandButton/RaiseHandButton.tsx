import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { IconButton } from '../../IconButton';
import { message } from 'antd';
import notificationSound from '../../../../../public/notisound.wav'
export function RaiseHandButton() {
  const { localParticipant } = useMeeting();

  const sound = new Audio(notificationSound);
  
  const { publish } = usePubSub('RAISEHAND', {
    onMessageReceived: (incomingMessage) => {
      if (incomingMessage.senderId !== localParticipant.id) {
        message.info(incomingMessage.message, 10);
        sound.play();
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
