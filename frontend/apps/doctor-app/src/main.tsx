import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'styled-components';
import {
  CssBaseline,
  Fonts,
  Theme,
  createTheme,
} from '@local/shared-components';
import { DoctorCommunicationProvider } from '@local/websocket';
import { ToastContainer } from 'react-toastify';
import { ConfigProvider, type ThemeConfig } from 'antd';

import 'react-toastify/dist/ReactToastify.css';
import App from './app/app';

const theme = createTheme();

const queryClient = new QueryClient();

function Main() {
  const theme = useTheme() as Theme;
  const antConfig: ThemeConfig = {
    token: {
      colorPrimary: theme.palette.primary1.main,
      fontFamily: 'inherit',
    },
  };

  return (
    <ConfigProvider theme={antConfig}>
      <QueryClientProvider client={queryClient}>
        <Fonts />
        <CssBaseline />
        <DoctorCommunicationProvider userId="bb8213f7-7dab-4d6c-a4ba-0c8e3bb4fdeb">
          <App />
        </DoctorCommunicationProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <ToastContainer
      toastClassName={() =>
        'relative flex py-4 px-3 rounded overflow-hidden cursor-pointer bg-white shadow-lg'
      }
      bodyClassName={() => 'text-black text-base font-normal'}
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
      <Main />
    </ThemeProvider>
  </>
);
