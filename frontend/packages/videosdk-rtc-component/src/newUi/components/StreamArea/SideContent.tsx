import { Flex, IonIcon, Typography, addAlpha } from '@local/shared-components';
import { Divider } from 'antd';
import { ReactNode } from 'react';
import styled from 'styled-components';

type SideContentProps = {
    onClose: () => void;
    children: ReactNode;
    title: string;
}

export function SideContent({ onClose, children, title }: SideContentProps) {
  return (
    <StyledRoot fullWidth fullHeight direction="column" gap="none">
      <Flex padding="sm" justify="space-between">
        <Typography weight="bold" color="common.white">
          {title}
        </Typography>
        <StyledCloseButton onClick={onClose}>
          <IonIcon name="close" outlined size="md" color="primary1.lighter" />
        </StyledCloseButton>
      </Flex>
      <Flex flex={1} align="flex-start" direction="column" gap="none">
        <StyledDivider orientationMargin={0} />
        {children}
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  background: ${({ theme }) => addAlpha(theme.palette.primary1.lighter, 0.2)};
  border-radius: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
`;

const StyledCloseButton = styled(Flex)`
  cursor: pointer;
`;

const StyledDivider = styled(Divider)`
  margin-top: 0px;
  margin-bottom: 0px;
  background: ${({ theme }) => addAlpha(theme.palette.primary1.lighter, 0.15)};
`;