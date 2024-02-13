import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import React from 'react';
import ErrorImage from '../assets/images/Frame.svg';
import HelperIcon from '../assets/images/HelperIcon.svg';
import AttachmentIcon from '../assets/images/AttachmentIcon.svg';
import CancelIcon from '../assets/images/CancelIcon.svg';
import Eye from '../assets/images/Eye.svg';

export interface InputProps {
  value: string;
  control: any;
  name: string;
  type: 'text' | 'file' | 'password'; 
  label: string;
  placeholder: string;
  inputRightIcon?: React.ReactNode;
  inputLeftIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
}


export function Input(props: InputProps) {
  return (
    <InputLabelContainer>
      <StyledLabel>{props.label}</StyledLabel>
      <Container>
        {props.type === 'text' && (
          <>
            <Controller
              name={props.name}
              control={props.control}
              render={({ field: { onChange, value, ...field } }) => (
                <StyledInput
                  {...field}
                  type={props.type}
                  placeholder={props.placeholder}
                  onChange={onChange}
                  value={value}
                  error={props.error}
                />
              )}
            />
            {props.inputLeftIcon && <LeftIcon>{props.inputLeftIcon}</LeftIcon>}

            {props.inputRightIcon && (
              <RightIcon>{props.inputRightIcon}</RightIcon>
            )}
          </>
        )}

        {props.type === 'file' && (
          <FileLabel>
            <Controller
              name={props.name}
              control={props.control}
              render={({ field: { onChange, value, ...field } }) => (
                <FileInput
                  {...field}
                  type={props.type}
                  placeholder={props.placeholder}
                  onChange={onChange}
                  value={value}
                  error={props.error}
                />
              )}
            />

            <PlaceholderAttachContainer>
              <FileAttachIcon src={AttachmentIcon} alt="attachment" />
              <FilePlaceholder value={props.value}>
                Add attachment
              </FilePlaceholder>
            </PlaceholderAttachContainer>
          </FileLabel>
        )}
        {props.value && props.type === 'file' && (
          <CancelFileIcon
            src={CancelIcon}
            alt="cancel"
            onClick={() => props.control.setValue(props.name, '')}
          />
        )}

        {props.type === 'password' && (
          <>
            <Controller
              name={props.name}
              control={props.control}
              render={({ field: { onChange, value, ...field } }) => (
                <StyledInput
                  {...field}
                  type={props.type}
                  placeholder={props.placeholder}
                  onChange={onChange}
                  value={value}
                  error={props.error}
                />
              )}
            />

            <PasswordRightIcon
              src={Eye}
              alt="eye"
              onClick={() => props.control.setValue(props.name, '')}
            />
          </>
        )}
      </Container>

      {props.error && (
        <ErrorContainer>
          <ErrorImg src={ErrorImage} alt="error" />
          <ErrorText>{props.error}</ErrorText>
        </ErrorContainer>
      )}

      {props.helperText && (
        <HelperContainer>
          <HelperImg src={HelperIcon} alt="helper" />
          <HelperText>{props.helperText}</HelperText>
        </HelperContainer>
      )}
    </InputLabelContainer>
  );
}

const StyledInput = styled.input<Pick<InputProps, 'error'>>`
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid
    ${({ error, theme }) => (error ? theme.colors.error : theme.colors.primary)};
  border-radius: 10px;
  font-size: 16px;
  width: 368px;
  height: 48px;
  box-sizing: border-box;
  &:hover {
    border-color: ${({ error, theme }) =>
      error?.length ? theme.colors.error : theme.colors.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.tertiary};
  }
  & img {
    margin-right: 10px;
  }
`;

const StyledLabel = styled.label`
  font-size: ${(props) => props.theme.fontSizes.md};
  margin-bottom: 5px;
  display: block;
  font-family: ${(props) => props.theme.fonts.primary};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const LeftIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const RightIcon = styled.div`
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
`;

const InputLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
`;

const ErrorText = styled.span`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.fontSizes.sm};
  padding-top: 5px;
  padding-bottom: 5px;
  line-height: 20px;
  font-family: ${({theme}) => theme.fonts.primary};
`;

const ErrorImg = styled.img`
  margin-right: 10px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const HelperText = styled.span`
  color: ${(props) => props.theme.colors.helper};
  font-size: ${(props) => props.theme.fontSizes.sm};
  padding-top: 5px;
  padding-bottom: 5px;
  line-height: 20px;
  font-family: ${({theme}) => theme.fonts.primary};
`;

const HelperImg = styled.img`
  margin-right: 10px;
`;

const HelperContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const FileInput = styled.input<Pick<InputProps, 'error'>>`
  display: none;
`;

const FileLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background-color: #f5f5f5;
  border-radius: 10px;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  &:hover {
    background-color: #e5e5e5;
  }
  border: 1px solid ${(props) => props.theme.colors.primary};
`;

const FileAttachIcon = styled.img`
  margin-right: 10px;
  margin-left: 10px;
  width: 20px;
  height: 20px;
`;

const PlaceholderAttachContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const FilePlaceholder = styled.div<Pick<InputProps, 'value'>>`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${({ theme, value }) =>
    value ? theme.colors.value : theme.colors.primary};
  font-family: ${({theme}) => theme.fonts.primary};
`;

const CancelFileIcon = styled.img`
  margin-right: 10px;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    cursor: pointer;
  }
`;

const PasswordRightIcon = styled.img`
  margin-right: 10px;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    cursor: pointer;
  }
`;
