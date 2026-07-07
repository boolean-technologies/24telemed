import type { Booking } from './api';

/** How long after the slot ends a call may still be started (people run late). */
const START_GRACE_MS = 30 * 60_000;

export type BookingTiming = {
  startsInFuture: boolean;
  /** The scheduled window (incl. grace) has fully elapsed. */
  isExpired: boolean;
  /**
   * Confirmed/Pending but the window elapsed without the call happening —
   * i.e. it was effectively missed and should no longer be startable.
   */
  isMissed: boolean;
};

export function bookingTiming(
  booking: Pick<Booking, 'scheduled_time' | 'duration_minutes' | 'status'>
): BookingTiming {
  const start = new Date(booking.scheduled_time).getTime();
  const durationMs = (booking.duration_minutes || 30) * 60_000;
  const end = start + durationMs;
  const now = Date.now();

  const isExpired = now > end + START_GRACE_MS;
  const isMissed =
    isExpired &&
    (booking.status === 'Confirmed' || booking.status === 'Pending');

  return {
    startsInFuture: now < start,
    isExpired,
    isMissed,
  };
}
