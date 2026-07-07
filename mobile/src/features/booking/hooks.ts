import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookingApi, type CreateBookingInput } from './api';

const KEY = ['bookings'];

export function usePersonnelBookings() {
  return useQuery({ queryKey: [...KEY, 'personnel'], queryFn: BookingApi.personnelList });
}

export function useDoctorBookings() {
  return useQuery({ queryKey: [...KEY, 'doctor'], queryFn: BookingApi.doctorList });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingInput) => BookingApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useConfirmBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingApi.confirm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeclineBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      BookingApi.decline(id, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
