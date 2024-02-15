import { ErrorIcon, HelperIcon, StarIcon, NigeriaFlagIcon } from '../Icon';

import {
  Container,
  Label,
  InputContainer,
  TextContainer,
  HelperText,
  ErrorText,
} from './Common';
import {BaseInput} from './BaseInput';
import styled from 'styled-components';
export interface NumberInputProps extends React.ComponentProps<'input'> {
  helperText?: string;
  error: boolean;
  errorText?: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  leftIcon?: React.ReactNode;
}

export function NumberInput({
  helperText,
  error,
  errorText,
  label,
  value,
  onChange,
  leftIcon,
  
  ...rest
}: NumberInputProps) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {
          leftIcon && <IconContainer>{leftIcon}</IconContainer>
          
        }
        <BaseInput {...rest} type='tel' name="numberInput" value={value} onChange={onChange} error={error} placeholder="+234"/>
      </InputContainer>
      {helperText && (
        <TextContainer>
          <HelperIcon />
          <HelperText>{helperText}</HelperText>
        </TextContainer>
      )}
      {error && errorText && (
        <TextContainer>
          <ErrorIcon />
          <ErrorText>{errorText}</ErrorText>
        </TextContainer>
      )}
    </Container>
  );
}

const IconContainer = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.xs};
  top: 50%;
  transform: translateY(-50%);
`;
