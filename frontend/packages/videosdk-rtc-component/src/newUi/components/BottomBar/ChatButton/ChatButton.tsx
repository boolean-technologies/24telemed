import { IconButton } from "../../IconButton";

type ChatButtonProps = {
    onClick: () => void;
    active: boolean;
}

export function ChatButton({ onClick, active } : ChatButtonProps){

    return <IconButton icon="chatbubbles" onClick={onClick} tooltip="Send message" variant={active ? 'primary2' : undefined} />
}