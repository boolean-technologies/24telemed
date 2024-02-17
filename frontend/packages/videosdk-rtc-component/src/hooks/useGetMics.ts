import { useQuery } from '@tanstack/react-query';
import { useMeeting } from '@videosdk.live/react-sdk';

export const useGetMics = () => {
  const mMeeting = useMeeting();

  return useQuery<
    Array<{
      deviceId: string;
      label: string;
    }>,
    unknown
  >({
    queryKey: ['webcams'],
    queryFn: mMeeting.getMics,
  });
};
