import { DateTime } from 'luxon';

export function timeDiffInMins(start_time: string, end_time: string) {
  const dateTime1 = DateTime.fromISO(start_time);
  const dateTime2 = DateTime.fromISO(end_time || start_time);
  const diff = dateTime2.diff(dateTime1, 'minutes');
  const minutes = diff.minutes;
  return `${Math.round(minutes)} min`;
}
