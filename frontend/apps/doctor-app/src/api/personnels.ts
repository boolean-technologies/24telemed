import { useQuery } from '@tanstack/react-query';
import { UsersService, ApiError, UserSearch, User } from '@local/api-generated';

export const useGetPersonnel = (personnelId?: string) =>
  useQuery<UserSearch, ApiError>({
    queryKey: ['users', personnelId],
    queryFn: () => UsersService.usersPersonnelsRead(personnelId as string),
    enabled: !!personnelId,
  });