import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from "@local/api-generated"
import { TOKEN_KEY } from '../constants';

export function useAuthWatcher(
  publicRoutes: string[],
  loginRoute: string,
  homeRoute: string
) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuccess, isPending } = useCurrentUser();
  const token = localStorage.getItem(TOKEN_KEY);

  if (((!isPending && !isSuccess) || !token ) && !publicRoutes.includes(location.pathname)) {
    navigate(loginRoute);
  }
  else if (isSuccess && publicRoutes.includes(location.pathname)){
    navigate(homeRoute);
  }

  return { isPending };
}
