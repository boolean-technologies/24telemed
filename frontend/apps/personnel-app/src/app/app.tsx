import { PersonnelCallEventType, usePersonnelCommunication } from '@local/websocket';
import { VideoCallSDK } from '@local/videosdk-rtc-component';

function App() {
  const comms = usePersonnelCommunication();
  if (comms.callStatus !== PersonnelCallEventType.ANSWERED) {
    return <VideoCallSDK participantName="Personnel" meetingId="u9fr-y2uj-7opc" setIsMeetingLeft={(x: boolean) => console.log("Personnel Left: ", x)} />
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
        <button onClick={comms.endCall}>End Call</button>
      ) : (
        <button
          onClick={() =>
            comms.callDoctor({
              doctorId: '80ca8080-1b9e-4b77-9051-13e2302c2b90',
              note: 'Please I need help',
              priority: 4,
            })
          }
        >
          Call Doctor
        </button>
      )}
    </div>
  );
}

export default App;
