import { Divider, Flex } from '@styled-system/jsx';

import { ProjectionData } from './ProjectionData';
import { TemporalData } from './TemporalData';

export function HeaderData() {
  return (
    <Flex gap="4" shrink={1} alignItems="center" minW="0" h="full" overflowX={'auto'}>
      <ProjectionData />
      <Divider
        orientation={'vertical'}
        thickness={'thin'}
        h={'full'}
        color="bg.base.border"
      ></Divider>
      <TemporalData />
    </Flex>
  );
}
