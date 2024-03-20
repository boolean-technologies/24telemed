import { Flex, MessageResult } from '@local/shared-components';

export function ProfilePage() {
  return (
    <Flex fullHeight fullWidth>
      <MessageResult
        icon="construct"
        title="Under Development"
        subTitle="We're working hard on bringing this feature to you. Please check back later."
      />
    </Flex>
  );
}
