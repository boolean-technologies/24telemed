/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Wallet } from './Wallet';
export type CurrentUser = {
  readonly id?: string;
  readonly patient_id?: string;
  readonly covered_by_insurance?: boolean;
  wallet?: Wallet;
  last_login?: string | null;
  /**
   * Designates that this user has all permissions without explicitly assigning them.
   */
  is_superuser?: boolean;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  /**
   * Designates whether the user can log into this admin site.
   */
  is_staff?: boolean;
  /**
   * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
   */
  is_active?: boolean;
  date_joined?: string;
  readonly user_id?: string | null;
  phone_number?: string | null;
  date_of_birth?: string | null;
  description?: string | null;
  user_type?: CurrentUser.user_type;
  insurance_coverage?: CurrentUser.insurance_coverage | null;
  readonly photo?: string | null;
  specialty?: string | null;
  location?: string | null;
  bvn?: string | null;
  /**
   * The groups this user belongs to. A user will get all permissions granted to each of their groups.
   */
  groups?: Array<number>;
  /**
   * Specific permissions for this user.
   */
  user_permissions?: Array<number>;
};
export namespace CurrentUser {
  export enum user_type {
    PERSONNEL = 'personnel',
    DOCTOR = 'doctor',
    CUSTOMER = 'customer',
  }
  export enum insurance_coverage {
    HEALTH_SPRING = 'health_spring',
  }
}
