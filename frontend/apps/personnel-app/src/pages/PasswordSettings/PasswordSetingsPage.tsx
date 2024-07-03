import React, { useState } from 'react';

import { Flex, Logo } from '@local/shared-components';
import { Form, Input, Button, Space } from 'antd-mobile';
import { Typography } from '@local/shared-components';
import { BG } from '../../assets';
import styled from 'styled-components';

type FormFieldType = {
  newPassword: string;
  confirmPassword: string;
};
export function PasswordSetingsPage() {
  const onFinish = (values: FormFieldType) => {
    console.log('Success:', values);
  };
  return (
    <StyledRoot
      direction="column"
      gap="sm"
      fullHeight
      justify="center"
      align="flex-start"
    >
      <HeaderImage src={BG} alt="header-image" />
      <Flex
        direction="column"
        align="center"
        justify="center"
        padding="md"
        fullHeight
        fullWidth
        style={{ maxWidth: 860, margin: 'auto', zIndex: 1 }}
      >
        <Flex
          direction="column"
          smAlign="center"
          gap="xl"
          align="flex-start"
          fullWidth
        >
          <Logo
            size="xl"
            style={{
              position: 'absolute',
              top: '0',
              zIndex: 0,
            }}
          />
          <div>
            <Typography variant="bodyXl" weight="bold">
              Change Password
            </Typography>
            <Typography>
              Enter your new password and confirm it to change your password.
            </Typography>
          </div>
        </Flex>
        <Form
          name="password"
          onFinish={onFinish}
          style={{ width: '100%', marginTop: '2rem' }}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
          <Flex padding="sm">
              <Button
                block
                type="submit"
                color="primary"
              >
                Log in
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Flex>
    </StyledRoot>
  );
}

const StyledRoot = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
  height: 100vh;
`;

const HeaderImage = styled.img`
  width: 300px;
  height: 200px;
  position: absolute;
  top: 0;
  z-index: 0;
`;
