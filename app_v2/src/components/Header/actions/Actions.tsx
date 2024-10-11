import { Divider, Flex } from '@styled-system/jsx';

import useIsMobile from '@/hooks/useIsMobile';

import { IconButton } from '../../Button';
import SvgIcon from '../../SvgIcon';
import { FullScreen } from './FullScreen';

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

export function Actions() {
  const isMobile = useIsMobile();

  return (
    <Flex gap="3" h="full" pr="1" alignItems="center">
      {!isMobile && <FullScreen />}
      <Action
        icon={<SvgIcon name="icon-settings" size={20} />}
        aria-label={'Settings'}
        onPress={() => {}}
      ></Action>
      <Action
        icon={<SvgIcon name="icon-globe" size={20} />}
        aria-label={'Select Projection'}
        onPress={() => {}}
      ></Action>
      <Action
        icon={<SvgIcon name="icon-info" size={20} />}
        aria-label={'Information'}
        onPress={() => {}}
      ></Action>
    </Flex>
  );
}
