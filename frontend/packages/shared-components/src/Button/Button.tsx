import styled from 'styled-components';
import { FC } from 'react';
import { makeButtonVariant } from '../styles';
import { ResponsivePropsBase } from '../styles/createResponsiveProps';
import type { NewButtonVariant } from '../styles';

export interface BaseButtonProps extends ResponsivePropsBase {
  text: string;
  variant?: NewButtonVariant;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

const StyledButton: FC<BaseButtonProps> = styled.button.attrs<BaseButtonProps>(
  ({ variant = 'primary', disabled, rightIcon, leftIcon, text }) => ({
    variant,
    disabled,
    rightIcon,
    leftIcon,
  })
)`
  ${makeButtonVariant}
  padding-top: ${({ theme }) => ` ${theme.spacing.sm}`};
  padding-bottom: ${({ theme }) => ` ${theme.spacing.sm}`};
  padding-left: ${({ theme, leftIcon }) =>
    ` ${leftIcon ? theme.spacing.xl : theme.spacing.sm}`};
  padding-right: ${({ theme, rightIcon }) =>
    ` ${rightIcon ? theme.spacing.xl : theme.spacing.sm}`};
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.ontFamily};
  border: ${({ theme }) => theme.border.primary.light};
  border-color: ${({ theme, variant }) => variant === 'tertiary' ? theme.border.primary.light : "transparent"};
`;

export function Button(props: BaseButtonProps) {
  return (
    <ButtonContainer>
      <StyledButton
        {...props}
        disabled={props.disabled}
        rightIcon={props.rightIcon}
        variant= {props.variant}
      >
        {props.text}
      </StyledButton>
      {props.rightIcon && (
        <RightIconContainer>{props.rightIcon}</RightIconContainer>
      )}

      {props.leftIcon && (
        <LeftIconContainer>{props.leftIcon}</LeftIconContainer>
      )}
    </ButtonContainer>
  );
}

const ButtonContainer = styled.div`
  position: relative;
  width: fit-content;
`;

const RightIconContainer = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
`;

const LeftIconContainer = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
`;
