import { Path } from '../../constants';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

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
