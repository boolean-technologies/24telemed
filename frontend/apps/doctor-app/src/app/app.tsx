import { useDoctorCommunication } from '@local/websocket';

function App() {
  const { isOpen, callStatus, hasIncomingCall, message, declineCall, answerCall } =
    useDoctorCommunication();
  return (
    <div>
      Doctor App
      <br />
      Comm. Is Open: {String(isOpen)}
      <br />
      Call Status: {callStatus}
      <br />
      <br />
        <div>
          <code lang="js">{JSON.stringify(message)}</code>
          <br />
          <br />
      {hasIncomingCall && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={answerCall}>Accept Call</button>
            <button
              onClick={() =>
                declineCall(
                  "I'm currently busy, please call me back in 1hr time."
                )
              }
            >
              Decline Call
            </button>
          </div>
      )}
        </div>
    </div>
  );
}

export default App;
