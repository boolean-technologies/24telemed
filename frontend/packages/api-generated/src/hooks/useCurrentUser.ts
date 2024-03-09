import { useQuery } from '@tanstack/react-query';
import { ApiError, User, UsersService } from '../api';

export const useCurrentUser = () =>
  useQuery<User, ApiError>({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.usersCurrentUser(),
    retry: 2,
  });
