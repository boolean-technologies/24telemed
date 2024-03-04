import styled, {css} from 'styled-components';
import { FC } from 'react';
import { makeButtonVariant } from '../styles';
import { ResponsivePropsBase } from '../styles/createResponsiveProps';
import type { NewButtonVariant } from '../styles';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export interface BaseButtonProps extends ResponsivePropsBase {
  text: string;
  disabled?: boolean;
  variant?: NewButtonVariant;
  rightIcon?: React.ReactNode;
  isSubmitting?: boolean;
  leftIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton: FC<BaseButtonProps> = styled.button.attrs<BaseButtonProps>(
  ({ variant = 'primary', isSubmitting, rightIcon, leftIcon, disabled, text, type}) => ({
    variant,
    isSubmitting,
    rightIcon,
    leftIcon,
    type,
    disabled,
  })
)`
  ${makeButtonVariant}
  width: 100%;
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
  text-align: center;
  border-color: ${({ theme, variant }) => variant === 'tertiary' ? theme.border.primary.light : "transparent"};
  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
      height: ${({ theme }) => theme.spacing.md};
      display: flex;
      align-items: center;
      justify-content: center;
    `)}
`;

export function Button(props: BaseButtonProps) {
  return (
    <ButtonContainer>
      <StyledButton
        {...props}
        disabled={props.isSubmitting }
        rightIcon={props.rightIcon}
        variant= {props.variant}
        type={props.type}
      >
        {props.isSubmitting ? <> <AiOutlineLoading3Quarters /> Please wait...</> : props.text}
      
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
  width: 100%;
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
