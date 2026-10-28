import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '@local/shared-components';
import { RootRedirect } from './pages/RootRedirect';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SessionLayout } from './components/SessionLayout';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { PaymentCallbackPage } from './pages/PaymentCallbackPage';
import { MeetingPage } from './pages/MeetingPage';

// Public pages are addressed by the clinic's slug (/:slug), so each partner
// gets its own link. Signed-in pages live under /app; /meeting/:id is fixed
// because the shared call socket navigates there when a doctor answers.
export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: <SessionLayout />,
        children: [
          { path: 'meeting/:meetingId', element: <MeetingPage /> },
          {
            path: 'app',
            element: <AppLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'consultations/:id', element: <ConsultationPage /> },
              { path: 'payment/callback', element: <PaymentCallbackPage /> },
            ],
          },
        ],
      },
      { path: ':slug', element: <LandingPage /> },
      { path: ':slug/login', element: <LoginPage /> },
      { path: ':slug/signup', element: <SignupPage /> },
    ],
  },
]);
