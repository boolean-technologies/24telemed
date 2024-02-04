import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DoctorCommunicationProvider } from '@local/websocket';
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <DoctorCommunicationProvider userId="80ca8080-1b9e-4b77-9051-13e2302c2b90">
        <App />
      </DoctorCommunicationProvider>
    </BrowserRouter>
  </StrictMode>
);
