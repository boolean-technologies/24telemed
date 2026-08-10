import { AccountScreen } from '@/components/AccountScreen';

export default function PatientAccount() {
  return (
    <AccountScreen
      editHref="/(patient)/(tabs)/records"
      editLabel="Medical records"
      walletHref="/(patient)/wallet"
    />
  );
}
