import { IconButton } from "../../IconButton";

type ParticipantsButtonProps = {
    onClick: () => void;
    active: boolean;
}

export function ParticipantsButton({ active, onClick }: ParticipantsButtonProps){

    return <IconButton icon="people" onClick={onClick} tooltip="Participants" variant={active ? 'primary2' : undefined} />
}