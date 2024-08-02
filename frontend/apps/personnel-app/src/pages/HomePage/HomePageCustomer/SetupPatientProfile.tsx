import { Flex, MessageResult } from '@local/shared-components';
import { Button } from 'antd';
import { Path } from '../../../constants';
import { Link } from 'react-router-dom';


export function SetupPatientProfile() {
  return (
    <Flex fullHeight fullWidth>
      <MessageResult
        icon="pulse-outline"
        title="Set Up Your Patient Profile"
        subTitle={
          <div>
            You haven't set up your patient profile yet. <br />
            Please complete your profile setup to access all features.
          </div>
        }
        extra={
          <Link to={Path.setupAccount}>
            <Button type="primary">Setup profile</Button>
          </Link>
        }
      />
    </Flex>
  );
}
