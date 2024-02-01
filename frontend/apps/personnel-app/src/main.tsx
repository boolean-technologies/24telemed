import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import  {VideoSDKRTCComponent}  from '@local/videosdk-rtc-component';
import App from './app/app';
import '../src/index.css'
import { PersonnelCommunicationProvider } from '@local/websocket';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <PersonnelCommunicationProvider>
        <VideoSDKRTCComponent/>
          
        
      
      </PersonnelCommunicationProvider>
    </BrowserRouter>
  </StrictMode>
);
