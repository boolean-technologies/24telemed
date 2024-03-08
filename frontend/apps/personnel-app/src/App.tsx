import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Path } from './constants';
import { LoginPage } from './pages/login';

const routes = [
  {
    path: Path.login,
    element: <LoginPage />,
  },
  {
    path: Path.home,
    element: <div>App main route</div>,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
