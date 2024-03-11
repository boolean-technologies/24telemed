import {
    Navigate,
    type RouteObject,
    createBrowserRouter,
  } from 'react-router-dom';
  import { PageLayout } from './components/PageLayout';
  import { HomePage } from './pages/HomePage';
  import { Path } from './constants';
  import { creatRoutes } from '@local/shared-components';
  import { MeetingPage } from './pages/MeetingPage';
import { CommsLayout } from './components/CommsLayout';
import { LoginPage } from './pages/LoginPage';
import { CallHistoryPage } from './pages/CallHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
  
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <CommsLayout />,
      children: [
        {
          path: '/',
          element: <PageLayout />,
          children: [
            {
              index: true,
              element: <Navigate to={Path.home} replace />,
            },
            {
              path: Path.home,
              element: <HomePage />,
            },
            {
              path: Path.history,
              element: <CallHistoryPage />,
            },
            {
              path: Path.profile,
              element: <ProfilePage />,
            },
          ],
        },
        {
          path: Path.meeting,
          element: <div />,
        },
      ],
    },
  ];
  
  export const router = createBrowserRouter(creatRoutes(routes, <LoginPage />));