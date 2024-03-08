import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { CssBaseline, Fonts, createTheme } from '@local/shared-components';
import { PersonnelCommunicationProvider } from '@local/websocket';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from './App';

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
          <PersonnelCommunicationProvider userId="e92d1df8-2538-4d18-8b96-381e6ed3878f">
            <App />
          </PersonnelCommunicationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </>
);
