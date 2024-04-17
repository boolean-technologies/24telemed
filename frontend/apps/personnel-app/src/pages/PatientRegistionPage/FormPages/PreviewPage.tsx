import { Flex, Typography } from '@local/shared-components';
import { Divider, Form } from 'antd';
import styled from 'styled-components';

export function PreviewPage() {
  const formData = Form.useFormInstance();
    const user = formData.getFieldsValue(true);
  return (
    <Flex direction="column" fullWidth padding="lg">
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
            {
              user?.first_name

            }
          </Typography>
          <Typography variant="bodyMd">Age: 25</Typography>
          <Typography variant="bodyMd"></Typography>
        </Flex>
      </Flex>
    </Flex>
  );
}

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
