import { PatientSearch, SearchResultType } from '@local/api-generated';
import { Flex, FoundIcon, Typography } from '@local/shared-components';
import React from 'react';
import styled, {css} from 'styled-components';

type Props = {
  data: SearchResultType<PatientSearch>;
};

const PatientFound = ({ data }: Props) => {
  const totalPatients = data.results.length;

  return (
    <Container direction="column" fullWidth padding="xl" justify= 'center'>
      <Flex fullWidth direction="row" padding="xs">
        <FoundIcon />
        <Typography variant="bodyLg" weight="bold">
          {totalPatients} patient(s) found
        </Typography>
      </Flex>
      <Flex fullWidth padding="none">
        <Typography variant="bodySm" align='center'>
          Redirecting to list of available doctors
        </Typography>
      </Flex>
    </Container>
  );
};

export default PatientFound;

const Container = styled(Flex)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
