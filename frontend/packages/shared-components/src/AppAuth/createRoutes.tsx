import { type RouteObject } from 'react-router-dom';
import { Path } from './paths';
import { AuthLayout } from './AuthLayout';
import { CommsProvider, type CommsProviderProps } from './CommsLayout';

export const creatRoutes = (
  type: CommsProviderProps['type'],
  loginPage: JSX.Element,
  routes: RouteObject[]
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
          path: '/',
          element: <CommsProvider type={type} />,
          children: [
            ...routes,
            {
              path: Path.meeting,
              element: <div />,
            },
          ],
        },
      ],
    },
  ];
};
