import React from 'react';

import { useSidebarActorRef } from '@/components/Sidebar/SidebarHooks';
import { useResetLayers } from '@/features/layersManagement/components/LayerManager/hooks/useResetLayers';

export function useResetApplicationState() {
  const sidebarActorRef = useSidebarActorRef();
  const resetLayerManagerLayers = useResetLayers();

  const resetApplicationState = React.useCallback(() => {
    return () => {
      resetLayerManagerLayers();
      sidebarActorRef.send({ type: 'ITEMS.CLOSE_ALL' });
    };
  }, [resetLayerManagerLayers, sidebarActorRef]);

  return resetApplicationState;
}
