import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CssBaseline, Fonts, createTheme } from '@local/shared-components';
import { PersonnelCommunicationProvider } from '@local/websocket';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from './app/app';

const theme = createTheme();
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <ToastContainer
      // toastClassName={() =>
      //   "relative flex py-4 px-3 rounded overflow-hidden cursor-pointer bg-white shadow-lg"
      // }
      // bodyClassName={() => "text-black text-base font-normal"}
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
          <PersonnelCommunicationProvider userId="447c6f62-a20a-4153-8aef-ec33205cefe8">
            <App />
          </PersonnelCommunicationProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </>
);
