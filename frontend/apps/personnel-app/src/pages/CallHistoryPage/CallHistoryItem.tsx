import { Flex, IonIcon, Typography } from '@local/shared-components';
import styled from 'styled-components';

export function CallHistoryItem() {
  return (
    <Flex fullWidth justify="space-between">
       <Flex>
       <StyledIconWrapper justify="center">
            <IonIcon name="arrow-back" />
        </StyledIconWrapper>
      <Flex direction="column" gap="none">
        <Typography weight="bold">Dr. Julia Thompson</Typography>
        <Typography variant="bodySm" color="primary1.light">
          Patient: Ruth (125412521)
        </Typography>
      </Flex> 
       </Flex>
      <Flex gap="xs">
        <IonIcon name="time" outlined />
        <Typography variant="bodySm" color="primary1.light">
          9:32am
        </Typography>
      </Flex>
    </Flex>
  );
}

const StyledIconWrapper = styled(Flex)`
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: ${({ theme }) => theme.border.primary.main};
`;