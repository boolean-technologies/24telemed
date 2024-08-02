import { PatientProfile } from '../../../components/PatientProfile';
import Header from '../Header';

type AccountPatientProfileProps = {
  patientId: string;
};
export function AccountPatientProfile({
  patientId,
}: AccountPatientProfileProps) {
  return (
    <div>
      <Header />
      <PatientProfile patientId={patientId} />
    </div>
  );
}
