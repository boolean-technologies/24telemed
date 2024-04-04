import { Flex, Typography } from '@local/shared-components';

import React from 'react';

const TermsOfService = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" direction="column">
      <Typography variant="bodyXl">Terms of Service</Typography>
      <Typography variant="bodySm">
        All content and materials available on the App, including but not
        limited to text, graphics, logos, images, and software, are the property
        of Anambra State Telemedice or its licensors and are protected by
        copyright, trademark, and other intellectual property laws.
      </Typography>
    </Flex>
  );
};

export default TermsOfService;
