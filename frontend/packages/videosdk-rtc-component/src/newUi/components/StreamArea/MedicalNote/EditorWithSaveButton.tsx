import {
  Flex,
  IonIcon,
  MessageResult,
  TextEditor,
  Typography,
  addAlpha,
} from '@local/shared-components';
import { Button, Result } from 'antd';
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

        <StyledContentArea flex={1} fullHeight fullWidth direction="column">
          <StyledInnerContentArea
            flex={1}
            fullHeight
            fullWidth
            direction="column"
          >
            {readOnly ? (
              value ? (
                <StyledContent dangerouslySetInnerHTML={{ __html: value }} />
              ) : (
                <MessageResult
                  icon="chatbubbles"
                  title="No Doctor's Note Available"
                  subTitle="The doctor has not provided any notes at this time. Please check again later for updates."
                />
              )
            ) : (
              <TextEditor
                value={value}
                onChange={(e) => setNote(e === '<p><br></p>' ? undefined : e)}
                placeholder={placeholder}
              />
            )}
            {readOnly ? null : (
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
            )}
          </StyledInnerContentArea>
        </StyledContentArea>
      </Flex>
    </>
  );
}

const StyledTitle = styled(Typography)`
  background: ${({ theme }) => theme.palette.primary1.main};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.spacing.xs};
`;

const StyledContent = styled.div`
  color: ${({ theme }) => theme.palette.primary1.lighter};
  font-family: ${({ theme }) => theme.typography.bodyLg.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  p {
    margin: 0;
  }
`;

const StyledContentArea = styled(Flex)`
  position: relative;
`;

const StyledInnerContentArea = styled(Flex)`
  position: absolute;
  overflow: scroll;
`;
