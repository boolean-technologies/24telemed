import { useEffect, useRef } from 'react';

export function useAudioStreamTrack(
  micOn?: boolean,
  audioTrack?: MediaStreamTrack
) {
  const micRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && audioTrack) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(audioTrack);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error('videoElem.current.play() failed', error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }

    // Cleanup
    return () => {
      if (micRef.current && micRef.current.srcObject) {
        const tracks = (micRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [audioTrack, micOn]);

  return micRef;
}
