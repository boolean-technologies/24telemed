/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrescribedDrug } from './PrescribedDrug';
export type MedicalEncounter = {
  readonly id?: string;
  prescribed_drugs: Array<PrescribedDrug>;
  readonly doctor_name?: string;
  reason_for_visit: string | null;
  assessment_and_diagnosis?: string | null;
  treatment_and_interventions?: string | null;
  follow_up_plans?: string | null;
  readonly created_at?: string;
  readonly updated_at?: string;
  doctor: string;
  patient: string;
};
