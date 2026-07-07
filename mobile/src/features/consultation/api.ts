import { OpenAPI } from '@/api';
import { request as __request } from '@/api/core/request';

export type ConsultationDrug = {
  id: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  drug: string;
  drug_detail?: {
    id: string;
    name: string;
    strength?: string | null;
    dosage_form?: string | null;
  };
};

export type ConsultationEncounter = {
  id: string;
  doctor: string;
  doctor_name?: string;
  patient: string;
  reason_for_visit?: string | null;
  assessment_and_diagnosis?: string | null;
  treatment_and_interventions?: string | null;
  follow_up_plans?: string | null;
  prescribed_drugs: ConsultationDrug[];
  created_at: string;
  updated_at: string;
};

export type EncounterNotes = {
  assessment_and_diagnosis?: string;
  treatment_and_interventions?: string;
  follow_up_plans?: string;
};

export type PrescriptionInput = {
  drug_name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
};

export const ConsultationApi = {
  doctorRead: (id: string) =>
    __request<ConsultationEncounter>(OpenAPI, {
      method: 'GET',
      url: `/doctors/medical-encounters/doctor-medical-encounters/${id}/`,
    }),

  patientRead: (id: string) =>
    __request<ConsultationEncounter>(OpenAPI, {
      method: 'GET',
      url: `/doctors/medical-encounters/personnel-medical-encounters/${id}/`,
    }),

  updateNotes: (id: string, notes: EncounterNotes) =>
    __request<ConsultationEncounter>(OpenAPI, {
      method: 'PATCH',
      url: `/doctors/medical-encounters/doctor-medical-encounters/${id}/`,
      body: notes,
    }),

  prescribe: (id: string, prescription: PrescriptionInput) =>
    __request<ConsultationDrug>(OpenAPI, {
      method: 'POST',
      url: `/doctors/medical-encounters/doctor-medical-encounters/${id}/prescribe/`,
      body: prescription,
    }),
};
