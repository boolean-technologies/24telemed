import { useQuery } from '@tanstack/react-query';
import { Doctor, UsersService } from '@local/api-generated';

export const useGetDoctor = (id: string) =>
  useQuery<Doctor>({
    queryKey: ['doctors', id],
    queryFn: () => UsersService.usersDoctorsRead(id),
    enabled: !!id,
    
  });
