import { IconButton } from '../../IconButton';

type MedicationButtonProps = {
  onClick: () => void;
  active: boolean;
};

export function MedicationButton({ onClick, active }: MedicationButtonProps) {
  return (
    <IconButton
      icon="medkit"
      onClick={onClick}
      tooltip="Medications"
      label="Meds"
      variant={active ? 'primary2' : undefined}
    />
  );
}
