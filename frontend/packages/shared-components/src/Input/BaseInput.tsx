import styled, { css } from 'styled-components';

export interface BaseInputProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  name: string;
  type: string;
  placeholder: string;
}

export function BaseInput({
  error,
  type,
  name,
  value,
  onChange,
  ...props
}: BaseInputProps) {
  return (
    <StyledInput
      {...props}
      onChange={onChange}
      value={value}
      error={error}
      type={type}
      aria-label={name}
    />
  );
}

const StyledInput = styled.input<
  Pick<BaseInputProps, 'error' | 'rightIcon' | 'leftIcon'>
>`
  padding-left: ${({ theme, leftIcon }) =>
    leftIcon ? theme.spacing.xl : theme.spacing.lg};
  padding-right: ${({ theme, rightIcon }) =>
    rightIcon ? theme.spacing.xl : theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.textarea};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};

  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
      width: 100%;
      height: ${({ theme }) => theme.spacing.md};
    `)}

  ${({ theme }) =>
    theme.breakpoints.xs.up(css`
      width: 100%;
      height: ${({ theme }) => theme.spacing.xl};
    `)}

  
  box-sizing: border-box;
  outline: none;
  ${({ error, theme }) => css`
    border: 1px solid
      ${error ? theme.palette.error : theme.palette.primary1.lighter};
  `}

  &:focus {
    border: 1px solid
      ${({ theme, error }) =>
        error ? theme.palette.error : theme.palette.secondary1.main};
  }
  font-family: ${({ theme }) => theme.typography.bodyMd.fontFamily};
  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.palette.primary1.lighter};
    font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
    font-family: ${({ theme }) => theme.typography.bodyMd.fontFamily};
  }
`;
