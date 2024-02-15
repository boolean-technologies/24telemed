import styled, { css } from 'styled-components';
import { AttachmentIcon, CancelIcon } from '../Icon';

interface FileInputProps {
  value: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  placeholder?: string;
}

export const FileInput = ({ value, onChange, onCancel, placeholder }: FileInputProps) => {
  return (
    <Container>
      <FileInputContainer>
        <AttachmentIcon />
        <Placeholder value={value}>{value ? value.name : placeholder}</Placeholder>

        <StyledFileInput
          type="file"
          onChange={onChange}
        />
      </FileInputContainer>
      <CancelIconContainer value={value} onClick={onCancel}>
        <CancelIcon />
      </CancelIconContainer>
    </Container>
  );
};

const StyledFileInput = styled.input`
  display: none;
`;

const FileInputContainer = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.palette.primary1.lighter};
  border-radius: ${({ theme }) => theme.spacing.xs};
  width: 368px;
  height: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.palette.secondary1.main};
  }

  ${({ theme }) =>
    theme.breakpoints.md.up(css`
      padding: ${({ theme }) => theme.spacing.md};
      width: 300px;
    `)}
`;

const Placeholder = styled.div<Pick<FileInputProps, 'value'>>`
  color: ${({ theme, value }) => value ? theme.palette.common.black : theme.palette.primary1.lighter};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
`;
const CancelIconContainer = styled.div<Pick<FileInputProps, 'value'>>`
  position: absolute;
  right: 24px;
  cursor: pointer;
  display: ${({ value }) => (value ? 'block' : 'none')};
  color: ${({ theme }) => theme.palette.neutral.light};
  top:70%;
  transform: translateY(-50%);
`;

const Container = styled.div`
  flex-direction: column;
  position: relative;
  width: fit-content;
  display: flex;
  height: 48px;
  padding: ${({ theme }) => theme.spacing.sm};
`;
