import { ActorRefFrom } from 'xstate';

import SvgIcon from '@/components/common/SvgIcon';

import { sideBarMachine } from '../sidebarMachine';
import { SidebarButton } from './SidebarButton';

export function CollapseToggle({
  actorRef,
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  actorRef: ActorRefFrom<typeof sideBarMachine>;
}) {
  return (
    <SidebarButton
      collapsed={isCollapsed}
      onPress={() => {
        onToggle(!isCollapsed);
        actorRef.send({ type: 'COLLAPSE.TOGGLE' });
      }}
      title={isCollapsed ? 'Expand' : 'Collapse'}
      icon={
        <SvgIcon
          name={isCollapsed ? 'icon-double-right-arrow' : 'icon-double-left-arrow'}
        ></SvgIcon>
      }
      active={false}
    ></SidebarButton>
  );
}
