import { DateTime } from "luxon"

export function calculateAge(dateOfBirth: string): number {
    return DateTime.now().diff(DateTime.fromISO(dateOfBirth), 'years').years
}