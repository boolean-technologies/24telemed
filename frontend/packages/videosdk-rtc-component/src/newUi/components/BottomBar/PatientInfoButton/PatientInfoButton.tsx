import { IconButton } from '../../IconButton';

type PatientInfoButtonProps = {
  onClick: () => void;
  active: boolean;
};

export function PatientInfoButton({ onClick, active }: PatientInfoButtonProps) {
  return (
    <IconButton
      icon="information-circle"
      onClick={onClick}
      tooltip="Patient Info"
      label="Patient"
      variant={active ? 'primary2' : undefined}
    />
  );
}
