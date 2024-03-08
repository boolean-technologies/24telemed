import {
  PersonnelCallEventType,
  usePersonnelCommunication,
} from '@local/websocket';
import { VideoCallSDK } from '@local/videosdk-rtc-component';

function App() {
  const comms = usePersonnelCommunication();
  if (comms.callStatus === PersonnelCallEventType.ANSWERED) {
    return (
      <VideoCallSDK
        participantName="Personnel"
        meetingId="u9fr-y2uj-7opc"
        setIsMeetingLeft={(x: boolean) => console.log('Personnel Left: ', x)}
      />
    );
  }
  return (
    <div>
      Personnel App
      <br />
      Comm. Is Open: {String(comms.isOpen)}
      <br />
      Call Status: {comms.callStatus}
      <br />
      {comms.message?.data && (
        <code>
          Call Log:
          {JSON.stringify(comms.message)}
        </code>
      )}
      <br />
      {comms.isOngoingCall ? (
        <button onClick={comms.endCall} style={{ background: "red", padding: 12 }}>End Call</button>
      ) : (
        <button
          onClick={() =>
            comms.callDoctor({
              doctorId: "68e3e40a-cf27-4b2d-9d2a-8194730297d3",
              note: 'Please I need help',
              priority: 4,
            })
          }
          style={{ background: "green", padding: 12 }}
        >
          Call Doctor
        </button>
      )}
    </div>
  );
}

export default App;
