interface SidebarItemBase {
  id: string;
  title: string;
  position: SidebarItemPosition;
  icon: React.ReactElement;
}

export type SidebarItemPosition = 'top' | 'bottom';

export interface SidebarPanelItem extends SidebarItemBase {
  component: React.ComponentType;
  type: 'panel';
}

export interface SidebarActionItem extends SidebarItemBase {
  type: 'action';
  onClick: () => void;
}

export type SidebarItem = SidebarPanelItem | SidebarActionItem;
