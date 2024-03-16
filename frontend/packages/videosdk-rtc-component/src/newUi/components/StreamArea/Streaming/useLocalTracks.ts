import { useEffect, useRef } from 'react';

export function useLocalTracks(webcamOn?: boolean, micOn?: boolean, videoTrack?: MediaStreamTrack, audioTrack?: MediaStreamTrack) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const micRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoTrack && webcamOn) {
          stream.addTrack(videoTrack);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          if (videoRef.current) videoRef.current.srcObject = null;
        }
      } catch (err) {
        console.error('Error accessing the camera', err);
      }
    };

    enableStream();

    // Cleanup
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [videoTrack, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && audioTrack) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(audioTrack);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
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

  return { videoRef, micRef };
}
