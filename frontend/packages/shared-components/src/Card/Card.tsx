import { ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '../Typography';
import { Flex } from '../Flex';
import { SpacingVariants } from '../styles';

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  padding?: SpacingVariants;
};

export function Card({ title, subtitle, children, className, padding = "md" }: CardProps) {
  return (
    <StyledRoot className={className} direction="column" padding={padding}>
      {(title || subtitle) && (
        <Flex direction="column" gap="none">
          <Typography weight="bold" variant="h6">{title}</Typography>
          <Typography color="primary1.light">{subtitle}</Typography>
        </Flex>
      )}
      {children}
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-radius: ${({ theme }) => theme.radius.dropdown};
  background-color: ${({ theme }) => theme.palette.common.white};
`;
