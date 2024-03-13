import { Card, Flex } from '@local/shared-components';
import styled from 'styled-components';
import { StepState, type StepStateProps } from './StepState';

type FormHeaderProps = {
  total: number;
  current: number;
  steps: StepStateProps[];
};

export function FormHeader({ total, current, steps }: FormHeaderProps) {
  return (
    <StyledRoot>
      <Flex fullWidth justify="space-between" style={{ position: 'relative' }}>
      {steps.map((step) => (
        <StepState
          key={step.name}
          state={current < step.position ? "pending" : step.state}
          position={step.position}
          name={step.name}
          onStep={step.onStep}
        />
      ))}
      <StyledProgressLineWrapper>
        <StyledProgressLine percent={(current / (total - 1)) * 100} />
      </StyledProgressLineWrapper>
    </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Card)`
  position: relative;
`;

const StyledProgressLine = styled.div<{
  percent: number;
}>`
  width: ${({ percent }) => percent}%;
  background: ${({ theme }) => theme.palette.common.black};
  height: 100%;
  transition: width 0.75s ease-out;
  border-radius: 3px;
`;

const StyledProgressLineWrapper = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.palette.primary1.lighter};
  height: 6px;
  right: 35px;
  left: 35px;
  top: 17px;
  z-index: 0;
  border-radius: 3px;

`;
