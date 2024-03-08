import { useQuery } from '@tanstack/react-query';
import {
  DoctorsService,
  ApiError,
  SearchResultType,
  FullCallLog,
  UseQueryOptions,
} from '@local/api-generated';

export const useSearchCallLogs = (
  params: {
    status?:
      | 'Initiated'
      | 'In Progress'
      | 'Completed'
      | 'Declined'
      | 'Failed'
      | 'Busy',
    callType?: 'Video' | 'Audio',
    notesIcontains?: string,
    order?:
      | 'start_time'
      | '-start_time'
      | 'created_at'
      | '-created_at'
      | 'priority'
      | '-priority',
    page?: number,
    size?: number
  },
  options?: UseQueryOptions<SearchResultType<FullCallLog>>
) =>
  useQuery<SearchResultType<FullCallLog>, ApiError>({
    queryKey: ['callLogs', params],
    queryFn: () => DoctorsService.doctorsCallLogsList(
      params.status,
      params.callType,
      params.notesIcontains,
      params.order || "-created_at",
      params.page,
      params.size
    ),
    ...options,
  });
