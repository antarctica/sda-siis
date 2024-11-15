import { sva } from '@styled-system/css';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import Panel from '../Panel/Panel';
import { useSidebarActiveItem } from '../Sidebar/SidebarHooks';
import { SidebarContext } from '../Sidebar/SideBarProvider';

const drawerRecipe = sva({
  slots: ['root', 'title', 'description', 'handle', 'content'],
  base: {
    content: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      mx: '[-1px]',
      bg: 'bg.panel',
      display: 'flex',
      h: 'full',
      flexDirection: 'column',
    },
    title: {
      srOnly: true,
    },
    description: {
      srOnly: true,
    },
    handle: {
      // eslint-disable-next-line @pandacss/no-hardcoded-color
      bg: '[bg.base.border !important]',
      h: '1',
      w: '10 !important',
      mx: 'auto',
      mt: '3',
    },
  },
});

const snapPoints = [0.4, 0.6];
function Drawer() {
  const [snap, setSnap] = React.useState<number | string | null>(snapPoints[0] ?? null);
  const { content, handle, title, description } = drawerRecipe();
  const activeItem = useSidebarActiveItem();
  const actorRef = SidebarContext.useActorRef();
  const closePanel = React.useCallback(() => {
    actorRef.send({ type: 'ITEMS.CLOSE_ALL' });
  }, [actorRef]);

  if (!activeItem) return null;

  return (
    <DrawerPrimitive.Root
      modal={false}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      handleOnly
      open={true}
      onClose={closePanel}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Content className={content}>
          <DrawerPrimitive.Handle className={handle} />
          <DrawerPrimitive.Title className={title}>{activeItem.title}</DrawerPrimitive.Title>
          <DrawerPrimitive.Description className={description}>
            {/* Todo make this included in the item definition */}
            {activeItem.title} workflow panel
          </DrawerPrimitive.Description>
          <Panel
            style={{ height: `${parseFloat(snap?.toString() ?? '0') * 100}%`, width: '100%' }}
            title={activeItem.title}
            onClose={closePanel}
            tabs={activeItem.type === 'tabbed-panel' ? activeItem.tabs : undefined}
          >
            {activeItem.type === 'panel' && <activeItem.component />}
          </Panel>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

export default Drawer;
