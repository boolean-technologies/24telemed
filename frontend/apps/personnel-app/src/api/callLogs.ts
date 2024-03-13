import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import {
  ApiError,
  SearchResultType,
  FullCallLog,
  CallLogsService,
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
  options?: InfiniteData<SearchResultType<FullCallLog>, unknown>
) =>
useInfiniteQuery<InfiniteData<SearchResultType<FullCallLog>, unknown>, ApiError>({
    queryKey: ['callLogs', params],
    queryFn: ({ pageParam = 1 }) => CallLogsService.callLogsList(
      params.status,
      params.callType,
      params.notesIcontains,
      params.order || "-created_at",
      pageParam as number,
      params.size
    ),
    ...options,
    getNextPageParam: (lastPage) => lastPage.next ? Number(new URLSearchParams(lastPage.next).get("page")) : undefined,
  });
