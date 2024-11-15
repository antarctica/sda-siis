interface SidebarItemBase {
  id: string;
  title: string;
  position: SidebarItemPosition;
  icon: React.ReactElement;
}

export type SidebarItemPosition = 'top' | 'bottom';

export interface PanelTab {
  id: string;
  title: string;
  icon: React.ReactElement;
  component: React.ComponentType;
}

export interface SidebarPanelItem extends SidebarItemBase {
  component: React.ComponentType;
  type: 'panel';
}

export interface SidebarTabbedPanelItem extends SidebarItemBase {
  type: 'tabbed-panel';
  tabs: PanelTab[];
}

export interface SidebarActionItem extends SidebarItemBase {
  type: 'action';
  onClick: () => void;
}

export type SidebarItem = SidebarPanelItem | SidebarTabbedPanelItem | SidebarActionItem;
