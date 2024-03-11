import { useQuery } from "@tanstack/react-query";

import {UseQueryOptions, ApiError, PatientSearch, PatientsService, SearchResultType} from "@local/api-generated";

export const useSearchPatients = (
    params: {
        phoneNumber: string,
        page?: number,
        size?: number
    },
    options?: UseQueryOptions<SearchResultType<PatientSearch>>
) =>
    useQuery<SearchResultType<PatientSearch>, ApiError>({
        queryKey: ['patients', params],
        queryFn: () => PatientsService.patientsSearch(
            params.phoneNumber,
            params.page,
            params.size
        ),
        ...options
    });