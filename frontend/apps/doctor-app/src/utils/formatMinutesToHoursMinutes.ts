import { Duration } from 'luxon';

export function formatMinutesToHoursMinutes(totalMinutes: number) {
  const duration = Duration.fromObject({ minutes: totalMinutes });
  const hours = Math.floor(duration.as('hours'));
  const minutes = duration.minutes % 60;

  return `${hours} hr ${minutes} min`;
}
