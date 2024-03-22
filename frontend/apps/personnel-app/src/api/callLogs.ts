import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  ApiError,
  SearchResultType,
  FullCallLog,
  CallLogsService,
  CallLog,
  PersonnelService
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
) =>
useInfiniteQuery<SearchResultType<FullCallLog>, ApiError>({
    initialPageParam: 1,
    queryKey: ['callLogs', params],
    queryFn: ({ pageParam = 1 }) => PersonnelService.personnelCallLogsList(
      params.status,
      params.callType,
      params.notesIcontains,
      params.order || "-created_at",
      pageParam as number,
      params.size
    ),
    getNextPageParam: (lastPage) => lastPage.next ? Number(new URLSearchParams(lastPage.next).get("page")) : undefined,
  });



export const useGetCallLog = (id?: string) =>
useQuery<CallLog, ApiError>({
  queryKey: ['fullCallLogs', id],
  queryFn: () => CallLogsService.callLogsRead(id as string),
  enabled: !!id,
});
