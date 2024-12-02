import { Flex } from '@styled-system/jsx';
import React from 'react';

import ImportRoute from '@/components/ImportRoute/ImportRoute';
import { useSIISMapView } from '@/hooks/useMap';

function Routes() {
  return (
    <Flex gap="2" direction="column">
      <ImportRoute />
    </Flex>
  );
}

export default Routes;
