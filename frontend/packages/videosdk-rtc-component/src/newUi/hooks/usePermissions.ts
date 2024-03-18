import { useMediaDevice } from "@videosdk.live/react-sdk";
import { useEffect } from "react";

export function usePermissions() {
    const { checkPermissions, requestPermission } = useMediaDevice();

    const requestAudioVideoPermission = async () => {
        try {
            await requestPermission('audio_video' as any);
        } catch (e) {
            console.log('Error in requestPermission ', e);
        }
    };

    const checkMediaPermission = async () => {
        const checkAudioVideoPermission = await checkPermissions(
            'audio_video' as any
        );
        const audioPermission = checkAudioVideoPermission.get('audio');
        const videoPermission = checkAudioVideoPermission.get('video');
        if (!audioPermission || !videoPermission) {
            await requestAudioVideoPermission();
        }
    };

    useEffect(() => {
        checkMediaPermission();
    }, []);
}