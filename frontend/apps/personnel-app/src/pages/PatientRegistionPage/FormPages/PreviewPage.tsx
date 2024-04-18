import { Card, Flex, Typography } from '@local/shared-components';
import { Divider, Form } from 'antd';
import styled from 'styled-components';

export function PreviewPage() {
  const formData = Form.useFormInstance();
  const user = formData.getFieldsValue(true);
  console.log('user', user);
  return (
    <Root direction="column" fullWidth padding="lg">
      <Flex gap="xxs" direction="column" fullWidth>
        <Typography variant="bodyMd" weight="bold">
          Preview Patient Information
        </Typography>
        <Divider
          style={{
            width: '100%',
          }}
        />
      </Flex>

      <Flex>
        <Avatar src="https://via.placeholder.com/150" />
        <Flex direction="column" fullWidth gap="sm" padding="md">
          <Typography variant="bodySm" weight="bold">
            Ademola Ogunmokun (Male)
          </Typography>
          <Flex direction="row" fullWidth gap="sm">
            <Typography variant="bodySm">Phone Number: 08012345678</Typography>
            <Typography variant="bodySm">ID Number: 123456789</Typography>
          </Flex>
          <Flex>
            <Typography variant="bodySm">Date of Birth: 01/01/2000</Typography>
            <Typography variant="bodySm">Age: 21</Typography>
          </Flex>
        </Flex>
      </Flex>
      <Card>
        <Typography variant="bodyMd" weight="bold">
          Medical Information
        </Typography>
        <Divider />
        <Flex direction="column" fullWidth gap="sm">
          <Flex gap="sm" fullWidth direction="column">
            <Typography variant="bodySm" color="primary2.main">
              Medical History:{' '}
            </Typography>
            <Typography variant="bodySm">None</Typography>
          </Flex>
          <Flex gap="sm" fullWidth direction="column">
            <Typography variant="bodySm" color="primary2.main">
              Allergies:{' '}
            </Typography>
            <Typography variant="bodySm">None</Typography>
          </Flex>

          <Flex gap="sm" fullWidth direction="column">
            <Typography variant="bodySm" color="primary2.main">
              Chronic Conditions:{' '}
            </Typography>
            <Typography variant="bodySm">None</Typography>
          </Flex>
          <Flex gap="sm" fullWidth direction="row" justify='space-between'>
            <Flex direction="column" gap="sm" fullWidth>
              <Flex gap="sm" direction='column' fullWidth>
                <Typography variant="bodySm" color="primary2.main">
                  Blood Group:{' '}
                </Typography>
                <Typography variant="bodySm">O+</Typography>
              </Flex>

              <Flex gap="sm" direction='column' fullWidth>
                <Typography variant="bodySm" color="primary2.main">
                  Genotype:{' '}
                </Typography>
                <Typography variant="bodySm">AA</Typography>
              </Flex>
            </Flex>
            <Flex gap="sm" direction='column' fullWidth>
              <Typography variant="bodySm" color="primary2.main">
                Height:{' '}
              </Typography>
              <Typography variant="bodySm">5'9</Typography>

              <Typography variant="bodySm" color="primary2.main">
                Weight:{' '}
              </Typography>
              <Typography variant="bodySm">70kg</Typography>

              </Flex>
          </Flex>
        </Flex>
      </Card>
      <Card>
        <Typography variant="bodyMd" weight="bold">
          Next of Kin Information
        </Typography>
        <Divider />
        <Flex direction="column" fullWidth gap="sm">
          <Typography variant="bodySm" color="primary2.main">
            Name:{' '}
          </Typography>
          <Typography variant="bodySm">Mrs. Ademola Ogunmokun</Typography>
          <Typography variant="bodySm" color="primary2.main">
            Phone Number:{' '}
          </Typography>
          <Typography variant="bodySm">08012345678</Typography>
          <Typography variant="bodySm" color="primary2.main">
            Relationship:{' '}
          </Typography>
          <Typography variant="bodySm">Spouse</Typography>
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
