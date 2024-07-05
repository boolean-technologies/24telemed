import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { User, UsersService } from '../api';

const queryClient = new QueryClient();

export const useCurrentUser = (disabled?: boolean, retry?: boolean | number) =>
  useQuery({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.usersCurrentUser(),
    enabled: disabled !== true,
    retry,
  });

export const useUpdateUser = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: User }) =>
      UsersService.usersPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
