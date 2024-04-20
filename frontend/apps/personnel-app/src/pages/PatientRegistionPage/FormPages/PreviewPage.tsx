import { calculateAge } from '@local/api-generated';
import { Card, Flex, Typography } from '@local/shared-components';
import { Divider } from 'antd';

import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import type { RegistrationFormField } from '../PatientRegistionPage';
export function PreviewPage() {
  const { watch } = useFormContext<RegistrationFormField>();

  const {
    first_name,
    last_name,
    gender,
    phone_number,
    date_of_birth,
    family_medical_history,
    allergies,
    chronic_conditions,
    blood_type,
    height,
    weight,
    city,
    address,
    email,
    genetype,
  } = watch();
  const fullName = `${first_name} ${last_name}`;

  return (
    <Root direction="column" fullWidth padding="lg">
      <Flex gap="xxs" direction="column" fullWidth>
        <Typography variant="bodyMd" weight="bold">
          Preview Patient Information
        </Typography>
      </Flex>

      <Flex gap="sm" fullWidth>
        <Avatar src="https://via.placeholder.com/150" />
        <Flex direction="column" fullWidth gap="sm" padding="md">
          <Typography variant="bodySm" weight="bold">
            {`${fullName} (${gender})`}
          </Typography>
          <NumberContainer direction="row" fullWidth gap="sm" padding="xxs">
            <Typography variant="bodySm" color="primary2.main">
              Phone Number: {phone_number}
            </Typography>
          </NumberContainer>
          <Flex>
            <Typography variant="bodySm">
              Date of Birth: {new Date(date_of_birth).toDateString()}
            </Typography>
            <AgeContainer direction="row" fullWidth gap="sm" padding="xxs">
              <Typography variant="bodySm">
                {`${calculateAge(date_of_birth) ?? '-'} years old`}
              </Typography>
            </AgeContainer>
          </Flex>
        </Flex>
      </Flex>
      <Card>
        <Typography variant="bodyMd" weight="bold">
          Medical Information
        </Typography>
        <Divider />
        <Flex direction="column" fullWidth gap="sm">
          <InfoText
            title="Family Medical History"
            value={family_medical_history}
          />
          <InfoText title="Allergies" value={allergies} />

          <InfoText title="Chronic Conditions" value={chronic_conditions} />
          <Flex gap="sm" fullWidth direction="row" justify="space-between">
            <Flex direction="column" gap="sm" fullWidth>
              <InfoText title="Blood Type" value={blood_type} />

              <InfoText title="Genotype" value={genetype} />
            </Flex>
            <Flex gap="sm" direction="column" fullWidth>
              <Typography variant="bodySm" color="primary2.main">
                Height:{' '}
              </Typography>
              <Typography variant="bodySm">{`${height} cm`}</Typography>

              <Typography variant="bodySm" color="primary2.main">
                Weight:{' '}
              </Typography>
              <Typography variant="bodySm">{`${weight} kg`}</Typography>
            </Flex>
          </Flex>
        </Flex>
      </Card>
      <Card>
        <Typography variant="bodyMd" weight="bold">
          Contact Information
        </Typography>
        <Divider />
        <Flex gap="sm" fullWidth direction="row" justify="space-between">
          <InfoText title="Phone Number" value={phone_number} />
          <InfoText title="Email" value={email} />
        </Flex>
        <Flex gap="sm" fullWidth direction="row" justify="space-between">
          <InfoText title="Address" value={address} />
          <InfoText title="City" value={city} />
        </Flex>
      </Card>
    </Root>
  );
}

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
const Root = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.neutral.light};
`;

const NumberContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.black};
  width: fit-content;
`;

const AgeContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.primary2.light};
  width: fit-content;
  border-radius: 5px;
`;

const InfoText = ({ title, value }: { title: string; value: string }) => (
  <Flex gap="sm" fullWidth direction="column">
    <Typography variant="bodySm" color="primary2.main">
      {title}
    </Typography>
    <Typography variant="bodySm">{value}</Typography>
  </Flex>
);
