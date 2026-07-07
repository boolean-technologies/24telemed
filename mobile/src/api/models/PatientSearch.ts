/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PatientSearch = {
  readonly id?: string;
  readonly patient_id?: string;
  phone_number?: string | null;
  readonly photo?: string | null;
  first_name: string;
  last_name: string;
  gender?: PatientSearch.gender | null;
  address?: string | null;
};
export namespace PatientSearch {
  export enum gender {
    MALE = 'Male',
    FEMALE = 'Female',
  }
}
