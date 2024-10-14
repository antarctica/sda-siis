import { Divider, Flex } from '@styled-system/jsx';

import { ProjectionData } from './ProjectionData';
import { TemporalData } from './TemporalData';

export function HeaderData() {
  return (
    <Flex gap="4" h="full" alignItems="center" shrink={1} minW="0" overflowX={'auto'}>
      <ProjectionData />
      <Divider
        h={'full'}
        orientation={'vertical'}
        thickness={'thin'}
        color="bg.base.border"
      ></Divider>
      <TemporalData />
    </Flex>
  );
}
