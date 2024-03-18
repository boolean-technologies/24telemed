import { Flex, IonIcon, Typography } from '@local/shared-components';
import { SettingsButton } from './SettingsButton';
import { PatientProfileButton } from './PatientProfileButton';

export function TopBar() {
  return (
    <Flex padding="sm" justify="space-between">
      <Flex>
        <IonIcon name="videocam" color="common.white" />
        <Typography color="common.white" weight="bold">
          Video Call
        </Typography>
      </Flex>
      <Flex>
        <PatientProfileButton />
        <SettingsButton />
      </Flex>
    </Flex>
  );
}
