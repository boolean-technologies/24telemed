import { Flex, IonIcon, Typography } from '@local/shared-components';
import { Tag } from 'antd';
import styled, { css } from 'styled-components';

export type StepStateProps = {
  state: 'progress' | 'pending' | 'completed';
  position: number;
  name: string;
  onStep: () => void;
};

export function StepState({ state, position, name, onStep }: StepStateProps) {
  const tagColor = {
    progress: 'processing',
    pending: undefined,
    completed: 'success',
  };
  return (
    <Flex direction="column" align="center" style={{ zIndex: 1 }}>
      <StyledStepCircle justify="center" state={state} onClick={onStep}>
        {state === 'progress' ? (
          <Typography
            weight="bold"
            align="center"
            variant="bodyLg"
            color="primary2.main"
          >
            {position}
          </Typography>
        ) : null}
        {state === 'pending' ? <StyledInnerCircle /> : null}
        {state === 'completed' ? (
          <IonIcon name="checkmark" color="primary2.main" size={20} />
        ) : null}
      </StyledStepCircle>
      <Flex
        direction="column"
        gap="none"
        align="center"
        justify="center"
        style={{ opacity: state === 'pending' ? 0.5 : 1, transition: "opacity 0.75s ease-out" }}
      >
        <Typography align="center" color="primary1.lighter">
          Step {position + 1}
        </Typography>
        <Typography variant="bodyLg" weight="bold" align="center">
          {name}
        </Typography>
        <Tag
          color={tagColor[state]}
          style={{ margin: 0, textTransform: 'capitalize', borderRadius: 16 }}
        >
          {state}
        </Tag>
      </Flex>
    </Flex>
  );
}

const StyledInnerCircle = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid ${({ theme }) => theme.palette.common.black};
  border-radius: 100%;
  background: ${({ theme }) => theme.palette.primary2.main};
`;

const StyledStepCircle = styled(Flex)<{
  state: StepStateProps['state'];
}>`
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: ${({ theme, state }) =>
    state === 'pending'
      ? theme.palette.primary1.lighter
      : theme.palette.primary1.main};
  ${({ state, theme }) =>
    state === 'progress'
      ? css`
          outline: 3px solid ${theme.palette.primary2.main};
          outline-offset: 2px;
          outline-background: red;
        `
      : ''}
`;
