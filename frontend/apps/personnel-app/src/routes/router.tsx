import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/login';
import App from '../app/app';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/',
    element: <App />,
  },
]);

export default router;
