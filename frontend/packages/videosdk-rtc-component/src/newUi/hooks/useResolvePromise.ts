import { useQuery } from '@tanstack/react-query';

export const useResolvePromise = <ResponseType = undefined>(
  queryFn: () => Promise<ResponseType>,
  queryKey: string
) => {
  return useQuery<ResponseType, unknown>({
    queryKey: [queryKey],
    queryFn,
  });
};
