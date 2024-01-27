import { useDoctorCommunication } from '@local/websocket';

function App() {
  const comms = useDoctorCommunication();
  return (
    <div>
      Doctor App
      <br />
      Comm. Is Open: {String(comms.isOpen)}
      <br />
      Call Status: {comms.callStatus}
    </div>
  );
}

export default App;
