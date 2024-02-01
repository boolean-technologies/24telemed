import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { PersonnelCommunicationProvider } from '@local/websocket';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <PersonnelCommunicationProvider userId="446175d1-f2a4-4513-851e-e63fde4ca906">
        <App />
      </PersonnelCommunicationProvider>
    </BrowserRouter>
  </StrictMode>
);
