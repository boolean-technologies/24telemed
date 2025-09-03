import {
  ApiError,
  SearchResultType,
  UseQueryOptions,
  MedicalEncounter,
  DoctorsService,
} from '@local/api-generated';
import { useQuery } from '@tanstack/react-query';

export const useGetUserMedicalEncounters = (
  params: {
    patient: string;
    page?: string;
    size?: number;
  },
  options?: UseQueryOptions<SearchResultType<MedicalEncounter>>
) =>
  useQuery<SearchResultType<MedicalEncounter>, ApiError>({
    queryKey: ['medicalEncounters', params],
    queryFn: () =>
      DoctorsService.doctorsMedicalEncountersDoctorMedicalEncountersList(
        params.patient,
        params.page,
        params.size
      ),
    ...options,
  });