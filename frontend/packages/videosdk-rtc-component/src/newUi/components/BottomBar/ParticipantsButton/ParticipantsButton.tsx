import { IconButton } from '../../IconButton';

type ParticipantsButtonProps = {
  onClick: () => void;
  active: boolean;
  hasNotification: boolean;
};

export function ParticipantsButton({
  active,
  onClick,
  hasNotification,
}: ParticipantsButtonProps) {
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
