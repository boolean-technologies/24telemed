import { useEffect, useRef } from 'react';

export function useVideoStreamTrack(
  webcamOn?: boolean,
  videoTrack?: MediaStreamTrack
) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return videoRef;
}
