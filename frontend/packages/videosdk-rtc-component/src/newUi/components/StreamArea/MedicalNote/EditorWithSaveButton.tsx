import { Flex, MessageResult, Typography } from '@local/shared-components';
import { Button, Input } from 'antd';
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
                <StyledContent
                  dangerouslySetInnerHTML={{
                    __html: value.replace(/\n/g, '<br/>'),
                  }}
                />
              ) : (
                <MessageResult
                  icon="chatbubbles"
                  title="No Doctor's Note Available"
                  subTitle="The doctor has not provided any notes at this time. Please check again later for updates."
                />
              )
            ) : (
              <>
                <StyledInputTextArea
                  defaultValue={value}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={placeholder}
                />
                <Flex justify="flex-end" fullWidth padding="none">
                <Button
                  disabled={!note}
                  type="primary"
                  style={{ fontWeight: 'bold' }}
                  onClick={() => onSave(note!)}
                >
                  {saveText}
                </Button>
              </Flex>
              </>
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

const StyledInputTextArea = styled(Input.TextArea)`
  background: ${({ theme }) => theme.palette.primary1.lighter};
  color: ${({ theme }) => theme.palette.primary1.main};
  font-family: ${({ theme }) => theme.typography.bodyMd.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  border: none;
  border-radius: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  resize: none;
  &:focus {
    border: none;
    box-shadow: none;
  }
  flex: 1;
`;