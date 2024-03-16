import { useLocalTracks } from './useLocalTracks';
import { StreamPlayer } from './StreamPlayer';
import { useCallContext } from '../../../context/AppContext';
import { useParticipant } from '@videosdk.live/react-sdk';
import styled from 'styled-components';

export function LocalStream() {
  const { localParticipant } = useCallContext();
  const { webcamStream, micStream, webcamOn, micOn } = useParticipant(
    localParticipant?.id
  );
  const { videoRef, micRef } = useLocalTracks(
    webcamOn,
    micOn,
    webcamStream?.track,
    micStream?.track
  );

  return (
    <StreamPlayer showBorder participantId={localParticipant.id}>
      <audio style={{ display: "none" }} ref={micRef} autoPlay muted />
      <StyledVideo ref={videoRef} autoPlay playsInline controls={false} muted />
    </StreamPlayer>
  );
}

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
