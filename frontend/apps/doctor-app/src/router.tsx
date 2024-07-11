import {
  Navigate,
  type RouteObject,
  createBrowserRouter,
} from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import { HomePage } from './pages/HomePage';
import { Path } from './constants';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { creatRoutes } from '@local/shared-components';
import { CommsLayout } from './components/CommsLayout';
import { MeetingPage } from './pages/MeetingPage';
import { ForgotPasswordPage } from './pages/ForgotPasword';

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
            path: Path.profile,
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: Path.meeting + '/:meetingId',
        element: <MeetingPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(
  creatRoutes(routes, <LoginPage />, <ForgotPasswordPage />)
);
