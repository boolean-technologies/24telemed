
import { BaseInput } from './BaseInput';
import { ErrorIcon, HelperIcon } from '../Icon';
import {
  Container,
  Label,
  LeftIconContainer,
  InputContainer,
  TextContainer,
  RightIconContainer,
  HelperText,
  ErrorText,
} from './Common';

export interface TextInputProps extends React.ComponentProps<typeof BaseInput> {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  label?: string;
}
export function TextInput({
  helperText,
  error,
  errorText,
  label,
  rightIcon,
  leftIcon,
  ...rest
}: TextInputProps) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer>
        <BaseInput
          {...rest}
          type="text"
          error={error}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        />
        {leftIcon && <LeftIconContainer>{leftIcon}</LeftIconContainer>}
        {rightIcon && <RightIconContainer>{rightIcon}</RightIconContainer>}
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
