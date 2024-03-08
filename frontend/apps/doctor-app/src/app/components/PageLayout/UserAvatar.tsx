import styled, { css } from "styled-components";
import userAvatar from '../../../assets/user-1.jpg';

type UserAvatarProps = {
    size?: "sm" | "md" | "lg"
}

export function UserAvatar({ size } : UserAvatarProps){
    return (
        <StyledUserAvatar src={userAvatar} alt="User avatar" size={size} />
    )
}

const sizeWidths = {
    sm: 40,
    md: 60,
    lg: 80
}

const StyledUserAvatar = styled.img<UserAvatarProps>`
  ${({ size = "sm" }) => css`
    width: ${sizeWidths[size]}px;
    height: ${sizeWidths[size]}px;
    border-radius: ${sizeWidths[size]}px;
  `}
`;