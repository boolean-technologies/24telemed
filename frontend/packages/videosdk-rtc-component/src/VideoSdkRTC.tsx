import React, { useEffect } from "react";
// import './index.css';
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useState } from "react";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { MeetingContainer } from "./meeting/MeetingContainer";
import { useBreakpoints } from "@local/shared-components";

type VideoCallSDKProps = {
  meetingId: string;
  participantName: string;
  setIsMeetingLeft?: (v: boolean) => void;
}

export function VideoCallSDK({ meetingId, participantName, setIsMeetingLeft }: VideoCallSDKProps) {
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedMic, setSelectedMic] = useState<{ id: string; label: string }>({ id: "", label: "" });
  const [selectedWebcam, setSelectedWebcam] = useState<{ id: string; label: string }>({ id: "", label: "" });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState(selectedWebcam.id);

  const [selectMicDeviceId, setSelectMicDeviceId] = useState(selectedMic.id);

  const { isMobile } = useBreakpoints();

  const handleLeaveMeeting = () => {
    setWebcamOn(false);
    setMicOn(false);
  }

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  return (
    <div id="meeting">
      <MeetingAppProvider>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: micOn,
          webcamEnabled: webcamOn,
          name: participantName,
          multiStream: true,
        }}
        token={import.meta.env.VITE_VIDEO_SDK_TOKEN}
        reinitialiseMeetingOnConfigChange={true}
        joinWithoutUserInteraction={true}
      >
        <MeetingContainer
          onMeetingLeave={handleLeaveMeeting}
          setIsMeetingLeft={setIsMeetingLeft}
          selectedMic={selectedMic}
          selectedWebcam={selectedWebcam}
          selectWebcamDeviceId={selectWebcamDeviceId}
          setSelectWebcamDeviceId={setSelectWebcamDeviceId}
          selectMicDeviceId={selectMicDeviceId}
          setSelectMicDeviceId={setSelectMicDeviceId}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
        />
      </MeetingProvider>
    </MeetingAppProvider>
    </div>
  );
}

export default React.memo(VideoCallSDK);