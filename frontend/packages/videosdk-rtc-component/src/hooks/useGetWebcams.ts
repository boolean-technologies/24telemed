import { useQuery } from '@tanstack/react-query';

async function fetchWebcams() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const webcams = devices.filter(
    (d) =>
      d.kind === 'videoinput' &&
      d.deviceId !== 'default' &&
      d.deviceId !== 'communications'
  );
  return webcams;
}

export const useGetWebcams = () =>
  useQuery<MediaDeviceInfo[], unknown>({
    queryKey: ['webcams'],
    queryFn: fetchWebcams,
  });