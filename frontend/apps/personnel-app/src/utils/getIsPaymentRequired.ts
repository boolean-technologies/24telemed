import { CurrentUser } from '@local/api-generated';

export function getIsPaymentRequired(user?: CurrentUser) {
  return (
    user?.user_type === 'customer' &&
    (user?.wallet?.call_session ?? 0) === 0 &&
    !user?.covered_by_insurance
  );
}
