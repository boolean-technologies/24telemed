import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import { CssBaseline, Fonts, createTheme } from "@local/shared-components";
import { DoctorCommunicationProvider } from '@local/websocket';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VideoCallSDK } from '@local/videosdk-rtc-component';

const theme = createTheme();

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <ToastContainer
      toastClassName={() =>
        "relative flex py-4 px-3 rounded overflow-hidden cursor-pointer bg-white shadow-lg"
      }
      bodyClassName={() => "text-black text-base font-normal"}
      position="bottom-left"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={false}
      closeButton={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Fonts />
        <CssBaseline />
        <BrowserRouter>
        <DoctorCommunicationProvider userId="80ca8080-1b9e-4b77-9051-13e2302c2b90">
          <VideoCallSDK
            participantName="Doctor"
            meetingId="u9fr-y2uj-7opc"
            setIsMeetingLeft={(x) => console.log('Doctor Left: ', x)}
          />
        </DoctorCommunicationProvider>
      </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </>
);
