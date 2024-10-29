import { StreamPlayer } from './StreamPlayer';
import { useCallContext } from '../../../context/AppContext';
import { useParticipant } from '@videosdk.live/react-sdk';
import styled from 'styled-components';
import { useVideoStreamTrack } from './useVideoStreamTrack';

type LocalStreamProps = {
  onLayoutToggle?: () => void;
  participantPhoto?: string;
}


export function LocalStream({ onLayoutToggle, participantPhoto }: LocalStreamProps) {
  console.log("participantPhoto", participantPhoto);
  const { localParticipant } = useCallContext();
  const { webcamStream, webcamOn } = useParticipant(localParticipant?.id);
  const videoRef = useVideoStreamTrack(webcamOn, webcamStream?.track);

  return (
    <StreamPlayer onLayoutToggle={onLayoutToggle} showBorder participantId={localParticipant.id} participantPhoto={participantPhoto}>
      <StyledVideo ref={videoRef} autoPlay playsInline controls={false} />
    </StreamPlayer>
  );
}

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
