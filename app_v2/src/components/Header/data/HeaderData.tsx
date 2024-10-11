import { Divider, Flex } from '@styled-system/jsx';

import DataGrid from '../../DataGrid';
import { ProjectionData } from './ProjectionData';

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
      <DataGrid
        data={[
          { label: 'UTC', value: '13/09/2024 16:04:32' },
          { label: 'LOCAL', value: '13/09/2024 19:04:32 (UTC +3)' },
        ]}
      ></DataGrid>
    </Flex>
  );
}
