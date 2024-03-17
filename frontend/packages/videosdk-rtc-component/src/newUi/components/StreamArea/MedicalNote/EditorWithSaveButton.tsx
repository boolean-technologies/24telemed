import {
  Flex,
  TextEditor,
  Typography,
  addAlpha,
} from '@local/shared-components';
import { Button } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

type EditorWithSaveButtonProps = {
  placeholder: string;
  onSave: (value: string) => void;
  saveText: string;
  title: string;
  value?: string;
  readOnly?: boolean;
};

export function EditorWithSaveButton({
  placeholder,
  onSave,
  saveText,
  title,
  value = '',
  readOnly,
}: EditorWithSaveButtonProps) {
  const [note, setNote] = useState<string>();

  return (
    <>
      <Flex flex={1} fullHeight fullWidth direction="column">
        <StyledTitle
          variant="bodyMd"
          weight="bold"
          color="common.white"
          align="center"
        >
          {title}
        </StyledTitle>
        <Flex flex={1} fullHeight fullWidth direction="column">
          {readOnly ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <TextEditor
              value={value}
              onChange={(e) => setNote(e === '<p><br></p>' ? undefined : e)}
              placeholder={placeholder}
            />
          )}

          <Flex justify="flex-end" fullWidth padding="sm">
            <Button
              disabled={!note}
              type="primary"
              style={{ fontWeight: 'bold' }}
              onClick={() => onSave(note!)}
            >
              {saveText}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

const StyledTitle = styled(Typography)`
  background: ${({ theme }) => theme.palette.primary1.main};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.spacing.xs};
`;
