import { useMutation } from '@tanstack/react-query';

import { PatientsService } from '@local/api-generated';

export const useSearchPatients = () =>
  useMutation({
    mutationFn: (searchQuery: string) =>
      PatientsService.patientsSearch(searchQuery),
  });
