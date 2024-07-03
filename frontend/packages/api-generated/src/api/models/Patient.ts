/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Patient = {
  readonly id?: string;
  readonly last_seen?: string;
  readonly patient_id?: string;
  phone_number: string;
  readonly photo?: string | null;
  first_name: string;
  last_name: string;
  age: number;
  date_of_birth: string;
  gender: Patient.gender;
  email?: string;
  address?: string | null;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  blood_type?: string;
  weight?: number | null;
  height?: number | null;
  chronic_conditions?: string;
  immunization_record?: string;
  family_medical_history?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  parent?: string | null;
};
export namespace Patient {
  export enum gender {
    MALE = 'Male',
    FEMALE = 'Female',
  }
}
