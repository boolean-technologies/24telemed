import { IconButton } from '../../IconButton';

type MedicalNotesButtonProps = {
  onClick: () => void;
  active: boolean;
  hasNotification: boolean;
};

export function MedicalNotesButton({
  active,
  onClick,
  hasNotification,
}: MedicalNotesButtonProps) {
  return (
    <IconButton
      icon="document-text"
      onClick={onClick}
      tooltip="Medical notes"
      variant={active ? 'primary2' : undefined}
      badgeIsDot={hasNotification}
    />
  );
}
