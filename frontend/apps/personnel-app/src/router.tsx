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
import { PatientRegistionPage } from './pages/PatientRegistionPage';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { EditPatientPage } from './pages/EditPatientInformation';


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
        path: Path.patient + '/:patientId',
        element: <PatientProfilePage />,
      },
      {
        path: Path.registerPatient,
        element: <PatientRegistionPage />,
      },
      {
        path: Path.patient + '/:patientId' + '/edit',
        element: <EditPatientPage />,
      },
      {
        path: Path.meeting + '/:meetingId',
        element: <MeetingPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(creatRoutes(routes, <LoginPage />));
