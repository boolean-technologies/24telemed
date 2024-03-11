import { startCase } from 'lodash-es';

export const parseApiError = (error_: any): string | undefined => {
    if (!error_) return undefined;
    const error = error_.body as any;
  if (error) {
    if ('msg' in error) return error.msg;
    if (typeof error.detail === 'string') return error.detail;
    if (Array.isArray(error.detail))
      return `${startCase(error.detail[0].loc[1] as string)}: ${
        error.detail[0].msg
      }`;
  }

  return 'An error occured';
};
