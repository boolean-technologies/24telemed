import { StreamPlayer } from './StreamPlayer';
import { useCallContext } from '../../../context/AppContext';
import { useParticipant } from '@videosdk.live/react-sdk';
import { useMemo } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';


type RemoteStreamProps = {
  onLayoutToggle: () => void;
}

export function RemoteStream({ onLayoutToggle }: RemoteStreamProps) {
  const { remoteParticipant } = useCallContext();

  const { webcamStream, webcamOn } = useParticipant(
    remoteParticipant?.id || ''
  );

  const videoStream = useMemo(() => {
    if (remoteParticipant && webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn, remoteParticipant]);

  if (!remoteParticipant) return null;
  return (
    <StreamPlayer onLayoutToggle={onLayoutToggle} showBorder participantId={remoteParticipant.id}>
      <StyledRemoteVideo
        url={videoStream}
        playsInline
        controls={false}
        pip={false}
        muted
        playing
      />
    </StreamPlayer>
  );
}

const StyledRemoteVideo = styled(ReactPlayer)`
  min-width: 100% !important;
  min-height: 100% !important;
  video {
    object-fit: cover;
  }
`;
