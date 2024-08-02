import { User } from '@local/api-generated';
import { SetupPatientProfile } from './SetupPatientProfile';
import { AccountPatientProfile } from './AccountPatientProfile';

type HomePageCustomerProps = {
  user: User;
};

export function HomePageCustomer({ user }: HomePageCustomerProps) {
  if (user.patient_id) return <AccountPatientProfile patientId={user.patient_id} />;
  return <SetupPatientProfile />;
}
