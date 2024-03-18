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

OpenAPI.TOKEN = localStorage.getItem(TOKEN_KEY) || "";

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
        colorBgBase: "red"
      },
    },
  };

  return (
    <ConfigProvider theme={antConfig}>
      <QueryClientProvider client={queryClient}>
        <Fonts />
        <CssBaseline />
        <RouterProvider router={router} />
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
