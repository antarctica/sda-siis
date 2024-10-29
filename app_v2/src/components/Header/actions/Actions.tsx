import { Divider } from '@styled-system/jsx';

import { IconButton } from '@/components/common/Button';

export function Action(
  props: Pick<React.ComponentProps<typeof IconButton>, 'icon' | 'aria-label' | 'onPress'>,
) {
  return (
    <>
      <Divider
        h={'full'}
        orientation={'vertical'}
        thickness={'thin'}
        color="bg.base.border"
        display={{ base: 'none', md: 'block' }}
      ></Divider>
      <IconButton variant="surface" tooltipPlacement="bottom" {...props}></IconButton>
    </>
  );
}
