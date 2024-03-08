import styled from 'styled-components';
import { BaseInput } from './BaseInput';
import { useState } from 'react';

import {
  Container,
  Label,
  InputContainer,
  TextContainer,
  HelperText,
  ErrorText,
} from './Common';
import { EyeIcon, HelperIcon,ErrorIcon } from '../Icon';

export interface PasswordInputProps
  extends React.ComponentProps<typeof BaseInput> {
  helperText?: string;
  error: boolean;
  errorText?: string;
  label?: string;
}

export function PasswordInput({
  helperText,
  error,
  errorText,
  label,
  ...rest
}: PasswordInputProps) {
  const [textType, setTextType] = useState('password');
  const toggleShowPassword = () => {
    setTextType(textType === 'password' ? 'text' : 'password');
  };
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer>
        <BaseInput {...rest} type={textType} error={error} />

        <EyeIconContainer onClick={toggleShowPassword}>
          <EyeIcon />
        </EyeIconContainer>
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

const EyeIconContainer = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;
