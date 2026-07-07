import { OpenAPI } from '@/api';
import { request as __request } from '@/api/core/request';
import type { PatientSearch, UserSearch } from '@/api';

/**
 * Hand-written client for the new /bookings/ endpoints. These post-date the
 * vendored OpenAPI client, so we call them through the same request core (which
 * applies the base URL + bearer token). When the backend schema is regenerated
 * these can move into the generated client.
 */

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Declined'
  | 'Cancelled'
  | 'Completed';

export type Booking = {
  id: string;
  doctor: string;
  doctor_detail?: UserSearch;
  health_care_assistant: string;
  health_care_assistant_detail?: UserSearch;
  patient: string | null;
  patient_detail?: PatientSearch;
  scheduled_time: string;
  duration_minutes: number;
  reason?: string | null;
  priority: number;
  status: BookingStatus;
  decline_note?: string | null;
  call_log_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBookingInput = {
  doctor: string;
  patient: string;
  scheduled_time: string;
  duration_minutes?: number;
  reason?: string;
  priority?: number;
  consultation_type?: string;
};

export type StartBookingResult = {
  booking: Booking;
  call_log_id: string;
  meeting_id: string | null;
};

type BookingListResponse =
  | Booking[]
  | {
      results?: Booking[];
    };

async function listBookings(url: string): Promise<Booking[]> {
  const response = await __request<BookingListResponse>(OpenAPI, {
    method: 'GET',
    url,
  });

  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response?.results) ? response.results : [];
}

export const BookingApi = {
  // ---- Personnel ----
  personnelList: () => listBookings('/bookings/personnel/'),

  create: (data: CreateBookingInput) =>
    __request<Booking>(OpenAPI, {
      method: 'POST',
      url: '/bookings/personnel/',
      body: data,
    }),

  cancel: (id: string) =>
    __request<Booking>(OpenAPI, {
      method: 'POST',
      url: `/bookings/personnel/${id}/cancel/`,
    }),

  personnelStart: (id: string) =>
    __request<StartBookingResult>(OpenAPI, {
      method: 'POST',
      url: `/bookings/personnel/${id}/start/`,
    }),

  // ---- Doctor ----
  doctorList: () => listBookings('/bookings/doctor/'),

  confirm: (id: string) =>
    __request<Booking>(OpenAPI, {
      method: 'POST',
      url: `/bookings/doctor/${id}/confirm/`,
    }),

  decline: (id: string, note?: string) =>
    __request<Booking>(OpenAPI, {
      method: 'POST',
      url: `/bookings/doctor/${id}/decline/`,
      body: { note },
    }),

  doctorStart: (id: string) =>
    __request<StartBookingResult>(OpenAPI, {
      method: 'POST',
      url: `/bookings/doctor/${id}/start/`,
    }),
};
