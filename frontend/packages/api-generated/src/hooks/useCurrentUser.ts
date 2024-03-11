import { useQuery } from '@tanstack/react-query';
import { ApiError, User, UsersService } from '../api';
import { TOKEN_KEY } from '..';

export const useCurrentUser = () =>
  useQuery<User, ApiError>({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.usersCurrentUser(),
    retry: 2,
    enabled: !!localStorage.getItem(TOKEN_KEY),
  });
