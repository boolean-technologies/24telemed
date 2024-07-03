import React from 'react';
import { Flex, Logo } from '@local/shared-components';
import { Form, Input, Button, Space } from 'antd-mobile';
import { Typography } from '@local/shared-components';
import { BG } from '../../assets';
import styled from 'styled-components';
styled;

type FormFieldType = {
  emailOrUsernameOrPhone: string;
};
export function ForgotPaswordPage() {
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
              Forgot Password
            </Typography>
            <Typography>
              Enter your email or username or phone number to reset your
              password.
            </Typography>
          </div>
        </Flex>
      <Form 
          name="forgotPassword"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: '100%' }}
          
        >
          <Form.Item
            name="emailOrUsernameOrPhone"
            rules={[
              {
                required: true,
                message: 'Please input your email or username or phone number!',
              },
            ]}
          >
            <Input placeholder="Email or Username or Phone" />
          </Form.Item>
          <Form.Item noStyle>
          <ButtonWrapper>
            <Button block type="submit" color="primary" size="large">
              Reset Password
            </Button>
          </ButtonWrapper>
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
  right: 0;
  top: 0;
  z-index: 0;
`;

const ButtonWrapper = styled(Flex)`
  width: 100%;
  margin-top: 20px;
`;