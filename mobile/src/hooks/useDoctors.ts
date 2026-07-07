import { useQuery } from '@tanstack/react-query';
import { OpenAPI, UsersService, type Doctor } from '@/api';
import { request as __request } from '@/api/core/request';
import type { ProviderRole } from '@/features/consult/types';

type ProvidersResponse = { results?: Doctor[] } | Doctor[];

/**
 * Directory of providers filtered by role (doctors or nurses), via
 * `/users/doctors/?provider_role=`. Used by the booking screen to list the
 * right providers for the chosen consultation type.
 */
export function useProviders(providerRole: ProviderRole = 'doctor') {
  return useQuery({
    queryKey: ['providers', providerRole],
    queryFn: async () => {
      const res = await __request<ProvidersResponse>(OpenAPI, {
        method: 'GET',
        url: '/users/doctors/',
        query: { provider_role: providerRole, size: 100 },
      });
      return Array.isArray(res) ? res : res.results ?? [];
    },
  });
}

/**
 * Directory of doctors. Used by personnel to choose who to call. The live
 * "who is online right now" set comes from the WebSocket (availableDoctors);
 * this list supplies names, photos and specialties to render against those ids.
 */
export function useDoctors(page = 1, size = 100) {
  return useQuery({
    queryKey: ['doctors', page, size],
    queryFn: () => UsersService.usersDoctorsList(page, size),
  });
}

/**
 * Resolve a set of doctor ids (e.g. the online ids from the call socket) to full
 * Doctor records via the read-by-id endpoint. Avoids the list endpoint and only
 * fetches the doctors we actually need.
 */
export function useOnlineDoctors(ids: string[]) {
  const key = [...ids].sort().join(',');
  return useQuery({
    queryKey: ['onlineDoctors', key],
    queryFn: () => Promise.all(ids.map((id) => UsersService.usersDoctorsRead(id))),
    enabled: ids.length > 0,
  });
}
