import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import { HomePage } from './pages/HomePage';
import { MeetingPage } from './pages/MeetingPage';
import { Path } from './constants';

const routes = [
  {
    path: Path.home,
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
