import { Flex, IonIcon, Typography } from '@local/shared-components';
import styled from 'styled-components';

type SideContentProps = {
    onClose: () => void;
}

export function SideContent({ onClose }: SideContentProps) {
  return (
    <StyledRoot fullWidth fullHeight direction="column">
      <Flex padding="sm" justify="space-between">
        <Typography weight="bold" color="common.white">
          Polls
        </Typography>
        <StyledCloseButton onClick={onClose}>
          <IonIcon name="close" outlined size="lg" color="primary1.lighter" />
        </StyledCloseButton>
      </Flex>
      <Flex flex={1}></Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  background: ${({ theme }) => theme.palette.primary1.light};
  border-radius: ${({ theme }) => theme.spacing.sm};
`;

const StyledCloseButton = styled(Flex)`
  cursor: pointer;
`;
