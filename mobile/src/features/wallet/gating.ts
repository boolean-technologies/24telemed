import { Alert } from 'react-native';
import type { Router } from 'expo-router';
import type { CurrentUser } from '@/api';

/**
 * Mirrors the web app's getIsPaymentRequired (frontend/apps/personnel-app/src/
 * utils/getIsPaymentRequired.ts) exactly, so funding behavior stays consistent
 * across platforms: only 'customer' users are billed, and having any insurance
 * coverage on file exempts them.
 */
export function isPaymentRequired(user?: CurrentUser | null): boolean {
  return (
    user?.user_type === 'customer' &&
    (user?.wallet?.call_session ?? 0) === 0 &&
    !user?.insurance_coverage
  );
}

/**
 * Gate for call/booking entry points. Returns true if the action should
 * proceed; otherwise prompts the user to fund their wallet first.
 */
export function ensureWalletFunded(
  user: CurrentUser | null | undefined,
  router: Router
): boolean {
  if (!isPaymentRequired(user)) return true;
  Alert.alert(
    'Insufficient balance',
    'Fund your wallet to place a call or book an appointment.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Fund wallet', onPress: () => router.push('/(patient)/wallet/fund') },
    ]
  );
  return false;
}
