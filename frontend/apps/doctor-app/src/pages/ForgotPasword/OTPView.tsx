import { useOTPValidation } from '@local/api-generated';
import { Flex, Typography } from '@local/shared-components';
import { Alert, Form, Input, Button, Result } from 'antd';


import { Link } from 'react-router-dom';
import { Path } from '../../constants';



export function OTPView() {
  const otpValidation = useOTPValidation();
  if (otpValidation.isSuccess) {
    return <ResetSuccesss />;
  }
  return (
    <Flex
      fullWidth
      padding="md"
      direction="column"
      align="center"
      justify="center"
    >
      {otpValidation.isError && (
        <Flex padding="sm" fullWidth justify="center">
          <Alert message={'Invalid OTP'} type="error" showIcon />
        </Flex>
      )}
      <Typography variant="bodyXl">Enter OTP</Typography>
      <Typography>Enter the OTP sent to your email</Typography>

      <Form onFinish={(values) => otpValidation.mutate(values)}>
        <Form.Item
          name="otp"
          rules={[
            {
              required: true,
              message: 'Please input your OTP!',
            },
          ]}
        >
          <Input.OTP variant="outlined" placeholder="Enter OTP" />
        </Form.Item>
        <Button
          type="primary"
          color="primary"
          style={{ width: '100%' }}
          loading={otpValidation.isPending}
          disabled={otpValidation.isPending}
        >
          Submit
        </Button>
      </Form>
    </Flex>
  );
}



export function ResetSuccesss() {
  return (
    <Result
      status="success"
      title="Password Reset Successfully"
      subTitle="Your password has been reset successfully. Please login with your new password."
      extra={[
        <Link to={Path.login} key="login">
          <Button type="primary"> Go to Login </Button>
        </Link>,
      ]}
    />
  );
}