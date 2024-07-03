import { type RouteObject } from 'react-router-dom';
import { Path } from './paths';
import { AuthLayout } from './AuthLayout';

export const creatRoutes = (
  routes: RouteObject[],
  loginPage: JSX.Element,
  forgotPasswordPage: JSX.Element,
  passwordSettingsPage: JSX.Element,
) => {
  return [
    {
      path: '/',
      element: <AuthLayout />,
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
        {
          path: Path.passwordSettings,
          element: passwordSettingsPage,
        },
        ...routes,
      ],
    },
  ];
};
