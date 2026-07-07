import { useQuery } from '@tanstack/react-query';
import { PatientsService } from '@/api';

/**
 * Search patients by phone number or patient ID. Mirrors the personnel web
 * app's "Find patient's profile" search.
 */
export function usePatientSearch(params: {
  phoneNumber?: string;
  patientId?: string;
  enabled?: boolean;
}) {
  const { phoneNumber, patientId, enabled = true } = params;
  return useQuery({
    queryKey: ['patientSearch', phoneNumber ?? '', patientId ?? ''],
    queryFn: () => PatientsService.patientsSearch(phoneNumber, patientId),
    enabled: enabled && Boolean(phoneNumber || patientId),
  });
}

/** Full patient profile by id. */
export function usePatient(id?: string) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => PatientsService.patientsRead(id as string),
    enabled: Boolean(id),
  });
}
