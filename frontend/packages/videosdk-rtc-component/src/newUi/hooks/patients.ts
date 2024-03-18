import { Patient, PatientsService } from "@local/api-generated";
import { useQuery } from "@tanstack/react-query";

export const useGetPatient = (id?: string) =>
useQuery<Patient>({
  queryKey: ['patients', id],
  queryFn: () => PatientsService.patientsRead(id as string),
  enabled: !!id
});
