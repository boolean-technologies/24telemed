import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const HelperText = styled.span`
  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      font-size: ${({ theme }) => theme.typography.bodyXs.fontSize};
    `)}

  ${({ theme }) =>
    theme.breakpoints.xs.up(css`
      font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
    `)}
  font-family: ${({ theme }) => theme.typography.bodyXs.fontFamily};
  color: #65a3ff;
`;

export const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.bodyXs.fontSize};
  font-family: ${({ theme }) => theme.typography.bodyXs.fontFamily};
  color: ${({ theme }) => theme.palette.error};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Label = styled.label`
font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
font-family: ${({ theme }) => theme.typography.bodyXs.fontFamily};
  color: ${({ theme }) => theme.palette.primary1.main};
  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      font-size: ${({ theme }) => theme.typography.bodyXs.fontSize};
    `)}

    font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
    
`;

export const RightIconContainer = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
`;

export const InputContainer = styled.div`
  position: relative;
  
  display: inline-block;
`;

export const LeftIconContainer = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.xs};
  top: 50%;
  transform: translateY(-50%);
`;
