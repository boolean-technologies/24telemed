import { useMediaDevice } from '@videosdk.live/react-sdk';
import { Permission } from '@videosdk.live/react-sdk/dist/types/permission';
import { useEffect } from 'react';

export function usePermissions() {
  const { checkPermissions, requestPermission } = useMediaDevice();

  const requestAudioVideoPermission = async () => {
    try {
      await requestPermission('audio_video' as Permission);
    } catch (e) {
      console.log('Error in requestPermission ', e);
    }
  };

  const checkMediaPermission = async () => {
    const checkAudioVideoPermission = await checkPermissions(
      'audio_video' as Permission
    );
    const audioPermission = checkAudioVideoPermission.get('audio');
    const videoPermission = checkAudioVideoPermission.get('video');
    if (!audioPermission || !videoPermission) {
      await requestAudioVideoPermission();
    }
  };

  useEffect(() => {
    checkMediaPermission();
  }, [checkPermissions, requestPermission]);
}
