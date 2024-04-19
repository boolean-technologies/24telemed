import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'styled-components';
import {
  CssBaseline,
  Fonts,
  Theme,
  createTheme,
} from '@local/shared-components';
import { ConfigProvider, type ThemeConfig } from 'antd';

import { OpenAPI, TOKEN_KEY } from '@local/api-generated';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './style.css';
import { ToastContainer,} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

OpenAPI.TOKEN = localStorage.getItem(TOKEN_KEY) || '';

const theme = createTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60,
    },
  },
});

function Main() {
  const theme = useTheme() as Theme;
  const antConfig: ThemeConfig = {
    token: {
      colorPrimary: theme.palette.primary1.main,
      fontFamily: 'inherit',
    },
    components: {
      Input: {
        controlHeight: 45,
      },
      Button: {
        controlHeight: 45,
        colorBgBase: theme.palette.error,
      },
      Tabs: {
        itemSelectedColor: theme.palette.primary2.main,
        titleFontSize: 18,
      },
      Collapse: {
        contentBg: theme.palette.neutral.main,
      },
      Select: {
        controlHeight: 45,
      },
      DatePicker: {
        controlHeight: 45,
      },
    },
  };

  return (
    <ConfigProvider theme={antConfig}>
      <QueryClientProvider client={queryClient}>
        
        <Fonts />
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
    </ConfigProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
);
