import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { IconButton } from '../../IconButton';
import { useResolvePromise } from '../../../hooks/useResolvePromise';

type MicType = {
  deviceId: string;
  label: string;
};

export function MicButton() {
  const { toggleMic, localParticipant, getMics, changeMic } = useMeeting();
  const { micOn, micStream } = useParticipant(localParticipant?.id);
  const { data = [] } = useResolvePromise<MicType[]>(getMics, "attachedMicrophones");

  return (
    <IconButton
      icon={micOn ? 'mic' : 'mic-off'}
      onClick={() => toggleMic()}
      tooltip={micOn ? 'Turn off mic' : 'Turn on mic'}
      items={data.map((mic) => ({
        key: mic.deviceId,
        label: mic.label,
        onClick: () => changeMic(mic.deviceId),
        style:
        micStream?.track?.label === mic.label
            ? {
                background: '#000',
                fontWeight: 'bold',
                color: '#fff',
              }
            : undefined,
      }))}
    />
  );
}
