import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@local/api-generated';
import { TOKEN_KEY } from '../constants';
import { Path } from './paths';

export function useAuthWatcher() {
  const publicRoutes: string[] = [Path.login];
  const navigate = useNavigate();
  const location = useLocation();
  const { isPending, data } = useCurrentUser();
  const token = localStorage.getItem(TOKEN_KEY);
  const isLoading = token ? isPending : false;

  if (!isLoading) {
    if (
      (data && publicRoutes.includes(location.pathname)) ||
      (!token && !publicRoutes.includes(location.pathname))
    ) {
      navigate(Path.login);
    } else if (data && token && publicRoutes.includes(location.pathname)) {
      navigate(Path.home);
    }
  }

  return { isLoading };
}
