import { IconButton } from '@/components/common/Button';

export function Action(
  props: Pick<React.ComponentProps<typeof IconButton>, 'icon' | 'aria-label' | 'onPress'>,
) {
  return <IconButton variant="surface" tooltipPlacement="bottom" {...props}></IconButton>;
}
