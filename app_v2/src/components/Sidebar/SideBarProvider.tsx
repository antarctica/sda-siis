import { createActorContext } from '@xstate/react';
import { useLocalStorage } from 'usehooks-ts';

import { sideBarMachine } from './sidebarMachine';
import { SidebarItem } from './types';

export const SidebarContext = createActorContext(sideBarMachine);

export const SIDEBAR_COLLAPSED_KEY = `${import.meta.env.VITE_CACHE_ID}-sidebar-collapsed`;

export function SideBarProvider({
  items,
  children,
}: {
  items: SidebarItem[];
  children: React.ReactNode;
}) {
  const [state] = useLocalStorage(SIDEBAR_COLLAPSED_KEY, false);
  return (
    <SidebarContext.Provider
      logic={sideBarMachine}
      options={{
        snapshot: sideBarMachine.resolveState({
          value: state ? 'Collapsed' : 'Expanded',
          context: {
            items,
            activeItem: null,
          },
        }),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
