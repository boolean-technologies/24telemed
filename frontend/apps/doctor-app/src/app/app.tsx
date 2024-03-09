import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import { HomePage } from './pages/HomePage';
import { MeetingPage } from './pages/MeetingPage';
import { Path } from './constants';
import { ProfilePage } from './pages/ProfilePage';

const routes = [
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
    path: Path.meeting,
    element: <div />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
