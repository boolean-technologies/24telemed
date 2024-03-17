import { StreamPlayer } from './StreamPlayer';
import { useCallContext } from '../../../context/AppContext';
import { useParticipant } from '@videosdk.live/react-sdk';
import styled from 'styled-components';
import { useVideoStreamTrack } from './useVideoStreamTrack';

export function LocalStream() {
  const { localParticipant } = useCallContext();
  const { webcamStream, webcamOn } = useParticipant(localParticipant?.id);
  const videoRef = useVideoStreamTrack(webcamOn, webcamStream?.track);

  return (
    <StreamPlayer showBorder participantId={localParticipant.id}>
      <StyledVideo ref={videoRef} autoPlay playsInline controls={false} />
    </StreamPlayer>
  );
}

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
