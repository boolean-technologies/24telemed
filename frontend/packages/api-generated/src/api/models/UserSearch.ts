/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserSearch = {
  readonly id?: string;
  readonly user_id?: string | null;
  first_name?: string;
  last_name?: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  photo?: string | null;
};
