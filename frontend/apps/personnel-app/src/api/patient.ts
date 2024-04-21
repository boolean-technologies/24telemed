import { useMutation, useQuery } from '@tanstack/react-query';

import { PatientsService, Patient } from '@local/api-generated';

export const useSearchPatients = () =>
  useMutation({
    mutationFn: (searchQuery: string) =>
      PatientsService.patientsSearch(searchQuery),
  });

  export const useGetPatient = (id?: string) =>
  useQuery<Patient>({
    queryKey: ['patients', id],
    queryFn: () => PatientsService.patientsRead(id as string),
    enabled: !!id
  });

  export const useCreatePatient = () =>
  useMutation({
    mutationFn: (patient: Patient) => PatientsService.patientsCreate(patient),
  });
  
  