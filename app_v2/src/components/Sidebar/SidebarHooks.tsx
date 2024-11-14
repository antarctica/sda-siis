import { SidebarContext } from './SideBarProvider';

export const useSidebarIsCollapsed = () => {
  return SidebarContext.useSelector((state) => state.matches('Collapsed'));
};

export const useSidebarActiveItem = () => {
  return SidebarContext.useSelector((state) => {
    const { activeItem, items } = state.context;

    if (!activeItem) {
      return null;
    }

    const activeItemData = items.find((item) => item.id === state.context.activeItem);
    if (activeItemData && activeItemData.type === 'panel') {
      return activeItemData;
    } else {
      return null;
    }
  });
};

export const useSidebarItems = () => {
  return SidebarContext.useSelector((state) => state.context.items);
};

export const useSidebarActorRef = () => {
  return SidebarContext.useActorRef();
};

export function useMinimiseSidebar() {
  const actorRef = SidebarContext.useActorRef();
  return () => {
    actorRef.send({ type: 'COLLAPSE.MINIMISE' });
    actorRef.send({ type: 'ITEMS.CLOSE_ALL' });
  };
}
