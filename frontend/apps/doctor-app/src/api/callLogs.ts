import { useQuery } from '@tanstack/react-query';
import {
  DoctorsService,
  ApiError,
  SearchResultType,
  FullCallLog,
  UseQueryOptions,
  CallStats,
} from '@local/api-generated';

type SearchType = {
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
}

export const useSearchCallLogs = (
  params: SearchType,
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

export const useGetCallLogStats = (
  params: SearchType,
  options?: UseQueryOptions<CallStats>
) =>
  useQuery<CallStats, ApiError>({
    queryKey: ['callLogsStats', params],
    queryFn: () => DoctorsService.doctorsCallLogsCallStats(
      params.status,
      params.callType,
      params.notesIcontains,
      params.order || "-created_at",
      params.page,
      params.size
    ),
    ...options,
  });
