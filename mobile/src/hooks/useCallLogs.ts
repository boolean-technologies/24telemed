import { useQuery } from '@tanstack/react-query';
import { CallLogsService, DoctorsService, PersonnelService } from '@/api';

/** A single call log by id (used to get the VideoSDK meeting_id for the room). */
export function useCallLog(id?: string) {
  return useQuery({
    queryKey: ['callLog', id],
    queryFn: () => CallLogsService.callLogsRead(id as string),
    enabled: Boolean(id),
  });
}

/** Personnel's call history (paginated). */
export function usePersonnelCallLogs(page = 1, size = 20) {
  return useQuery({
    queryKey: ['callLogs', 'personnel', page, size],
    queryFn: () =>
      PersonnelService.personnelCallLogsList(
        undefined,
        undefined,
        undefined,
        '-start_time',
        page,
        size
      ),
  });
}

/** Doctor's call history (paginated). */
export function useDoctorCallLogs(page = 1, size = 20) {
  return useQuery({
    queryKey: ['callLogs', 'doctor', page, size],
    queryFn: () =>
      DoctorsService.doctorsCallLogsList(
        undefined,
        undefined,
        undefined,
        '-start_time',
        page,
        size
      ),
  });
}

/** Aggregate call stats for the doctor dashboard. */
export function useDoctorCallStats() {
  return useQuery({
    queryKey: ['callStats', 'doctor'],
    queryFn: () => DoctorsService.doctorsCallLogsCallStats(),
  });
}
