import { type RouteObject } from 'react-router-dom';
import { Path } from './paths';
import { AuthLayout } from './AuthLayout';
import { ErrorPage } from '../ErrorPage';

export const creatRoutes = (
  routes: RouteObject[],
  loginPage: JSX.Element,
  forgotPasswordPage: JSX.Element,
) => {
  return [
    {
      path: '/',
      element: <AuthLayout />,
      errorElement: <ErrorPage />,

      children: [
        {
          index: true,
          path: Path.login,
          element: loginPage,
        },
        {
          path: Path.forgotPassword,
          element: forgotPasswordPage,
        },
        ...routes,
      ],
    },
  ] as RouteObject[];
};
