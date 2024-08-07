import { useMutation, useQuery } from '@tanstack/react-query';

import { PatientsService, Patient } from '@local/api-generated';
type SearchQueries = {
  phoneNumber?: string;
  patientId?: string;
};
export const useSearchPatients = () =>
  useMutation({
    mutationFn: (searchQuery: SearchQueries) =>
      PatientsService.patientsSearch(searchQuery.phoneNumber, searchQuery.patientId),
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
  
  export const useUpdatePatient = () =>
  useMutation({
    mutationFn: ({id, data }: {id: string, data: Patient}) =>
      PatientsService.patientsPartialUpdate(id, data),
  });


  

  