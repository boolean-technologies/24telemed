import {
  DoctorsService,
  MedicalEncounter,
  ApiError,
  SearchResultType,
  UseQueryOptions,
} from '@local/api-generated';
import { keepPreviousData, useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

export const useGetUserMedicalEncounters = (
  params: {
    patient: string;
    page?: number;
    size?: number;
  },
  options?: UseQueryOptions<SearchResultType<MedicalEncounter>>
) =>
  useQuery<SearchResultType<MedicalEncounter>, ApiError>({
    queryKey: ['medicalEncounters', params],
    queryFn: () =>
      DoctorsService.doctorsMedicalEncountersDoctorMedicalEncountersList(
        params.patient,
        undefined,
        params.page,
        params.size
      ),
    placeholderData: keepPreviousData,
    ...options,
  });

export const useUpdateMedicalEncounter = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicalEncounter }) =>
      DoctorsService.doctorsMedicalEncountersDoctorMedicalEncountersPartialUpdate(
        id,
        data
      ),
  });
