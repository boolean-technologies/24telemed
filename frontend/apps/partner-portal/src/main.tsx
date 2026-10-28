import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'styled-components';
import { CssBaseline, Fonts, Theme, createTheme, tokenManager } from '@local/shared-components';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { OpenAPI } from '@local/api-generated';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './style.css';

OpenAPI.BASE = import.meta.env.VITE_API_BASE;
OpenAPI.TOKEN = tokenManager.getToken();

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
      colorPrimary: theme.palette.primary2.main,
      fontFamily: 'inherit',
      borderRadius: 10,
    },
    components: {
      Input: { controlHeight: 44 },
      InputNumber: { controlHeight: 44 },
      Select: { controlHeight: 44 },
      DatePicker: { controlHeight: 44 },
      Button: { controlHeight: 44, primaryShadow: 'none' },
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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ThemeProvider theme={theme}>
    <Main />
  </ThemeProvider>
);
