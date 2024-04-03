import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { ApiError, User, UsersService, } from '../api';
import { TOKEN_KEY } from '..';

const queryClient = new QueryClient();

export const useCurrentUser = () =>
  useQuery<User, ApiError>({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.usersCurrentUser(),
    retry: 2,
    enabled: !!localStorage.getItem(TOKEN_KEY),
  });


  export const useUpdateUser = () =>
  useMutation({
    mutationFn: ({id, data }: {id: string, data: User}) =>
      UsersService.usersPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });