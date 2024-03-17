import { IconButton } from '../../IconButton';

type MenuButtonProps = {
  onClick: () => void;
  active: boolean;
};

export function MenuButton({ onClick, active }: MenuButtonProps) {
  return (
    <IconButton
      icon="medkit"
      onClick={onClick}
      tooltip="Medications"
      variant={active ? 'primary2' : undefined}
    />
  );
}
