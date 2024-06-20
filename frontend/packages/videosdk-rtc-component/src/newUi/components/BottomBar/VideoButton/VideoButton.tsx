import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { IconButton } from '../../IconButton';
import { useResolvePromise } from '../../../hooks/useResolvePromise';

type CamType = {
  deviceId: string;
  label: string;
  facingMode: 'environment' | 'front';
};

export function VideoButton() {
  const { toggleWebcam, localParticipant, changeWebcam, getWebcams } =
    useMeeting();
  const { webcamOn, webcamStream } = useParticipant(localParticipant?.id);
  const { data = [] } = useResolvePromise<CamType[]>(
    getWebcams,
    'attachedCameras'
  );

  return (
    <IconButton
      icon={webcamOn ? 'videocam' : 'videocam-off'}
      tooltip={webcamOn ? 'Turn off video' : 'Turn on video'}
      variant={webcamOn ? 'primary2' : undefined}
      onClick={() => toggleWebcam()}
      items={data.map((cam) => ({
        key: cam.deviceId,
        label: cam.label ?? cam.deviceId,
        onClick: () => changeWebcam(cam.deviceId),
        style:
          webcamStream?.track?.label === cam.label
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
