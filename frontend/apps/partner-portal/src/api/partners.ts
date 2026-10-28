import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tokenManager } from '@local/shared-components';
import { apiFetch } from './client';

export type PartnerDoctor = {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string | null;
  photo: string | null;
};

export type PartnerService = {
  id: string;
  name: string;
  description: string;
  fee: string;
  currency: string;
  doctors: PartnerDoctor[];
};

export type Partner = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  services: PartnerService[];
};

export type ConsultationStatus = 'pending_payment' | 'paid' | 'completed' | 'cancelled';

export type Consultation = {
  id: string;
  service: string;
  service_detail: PartnerService;
  patient: string | null;
  reason: string;
  amount: string;
  currency: string;
  status: ConsultationStatus;
  reference: string;
  paid_at: string | null;
  completed_at: string | null;
  created_at: string;
  authorization_url?: string;
};

export type RegistrationInput = {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
};

type Paginated<T> = { results: T[] };

export const usePartner = (slug?: string) =>
  useQuery({
    queryKey: ['partner', slug],
    queryFn: () => apiFetch<Partner>(`/partners/${slug}/`),
    enabled: !!slug,
    retry: false,
  });

export const useMyPartner = () =>
  useQuery({
    queryKey: ['myPartner'],
    queryFn: () => apiFetch<Partner>('/partners/me/'),
    enabled: !!tokenManager.getToken(),
    retry: false,
  });

export const useConsultations = () =>
  useQuery({
    queryKey: ['consultations'],
    queryFn: () => apiFetch<Paginated<Consultation>>('/partners/consultations/').then((page) => page.results),
  });

export const useConsultation = (id?: string) =>
  useQuery({
    queryKey: ['consultations', id],
    queryFn: () => apiFetch<Consultation>(`/partners/consultations/${id}/`),
    enabled: !!id,
  });

export const useRegister = (slug: string) =>
  useMutation({
    mutationFn: (data: RegistrationInput) =>
      apiFetch<{ access: string }>(`/partners/${slug}/register/`, { method: 'POST', body: data }),
  });

/** Creates a consultation and returns it with the Paystack checkout URL. */
export const useStartCheckout = () =>
  useMutation({
    mutationFn: (data: { service: string; reason?: string }) =>
      apiFetch<Consultation>('/partners/consultations/', { method: 'POST', body: data }),
  });

export const useRetryCheckout = () =>
  useMutation({
    mutationFn: (id: string) =>
      apiFetch<Consultation>(`/partners/consultations/${id}/pay/`, { method: 'POST' }),
  });

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<Consultation>(`/partners/consultations/${id}/verify/`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['consultations'] }),
  });
};
