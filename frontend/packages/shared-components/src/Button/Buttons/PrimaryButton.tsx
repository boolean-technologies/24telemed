import styled, { css } from 'styled-components';
import { FC } from 'react';
import { MakeButtonVariant } from '../../styles';
import type { Theme } from '../../styles';
export interface BaseButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  text: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const mapping = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
};

const Button:FC = styled.button<BaseButtonProps>`
  ${MakeButtonVariant}
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.duration.shortest}ms ${({ theme }) => theme.transitions.easing.easeOut};
  &:hover {
    background-color: ${({ theme }) => theme.button.primary.hoverBackgroundColor};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.button.primary.disabledBackgroundColor};
    color: ${({ theme }) => theme.button.primary.disabledColor};
    cursor: not-allowed;
  }
`;

export function PrimaryButton(props: BaseButtonProps) {
  return (
    <ButtonContainer>
      <Button {...props}>{props.text}</Button>
      {props.rightIcon && <RightIconContainer>{props.rightIcon}</RightIconContainer>}

      
    </ButtonContainer>

  )
}

const ButtonContainer = styled.div`
  position: relative;
`;

const RightIconContainer = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
`;

