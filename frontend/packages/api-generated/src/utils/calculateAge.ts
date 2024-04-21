import { DateTime } from 'luxon';

export function calculateAge(dateOfBirth: Date): number {
  const dateToString = new Date(dateOfBirth).toISOString().split('T')[0];
  const dob = DateTime.fromISO(dateToString);
  const now = DateTime.now();
  const absoulteAge = Math.abs(now.diff(dob, 'years').years);
  return Math.floor(absoulteAge);
}
