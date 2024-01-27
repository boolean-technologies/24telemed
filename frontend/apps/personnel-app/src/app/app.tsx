import { usePersonnelCommunication } from '@local/websocket';

function App() {
  const comms = usePersonnelCommunication();
  return (
    <div>
      Personnel App
      <br />
      Comm. Is Open: {String(comms.isOpen)}
      <br />
      Call Status: {comms.callStatus}
    </div>
  );
}

export default App;
