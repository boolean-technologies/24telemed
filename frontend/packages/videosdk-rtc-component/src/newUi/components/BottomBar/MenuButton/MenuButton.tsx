import { IconButton } from '../../IconButton';

type MenuButtonProps = {
  onClick: () => void;
  active: boolean;
};

export function MenuButton({ onClick, active }: MenuButtonProps) {
  return (
    <IconButton
      icon="menu"
      badgeCount={2}
      onClick={onClick}
      tooltip="Open menu"
      variant={active ? 'primary2' : undefined}
      size="middle"
    />
  );
}
