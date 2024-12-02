import '@arcgis/map-components/dist/components/arcgis-scene';

import { ArcgisSceneCustomEvent } from '@arcgis/map-components';
import { ArcgisScene } from '@arcgis/map-components-react';
import React from 'react';

import { useCreateView } from '@/features/arcgis/hooks/useCreateView';

import { ArcInternalViewProvider } from '../../contexts/InternalViewContext/ArcInternalViewProvider';

export function ArcSceneView({
  children,
  onArcgisViewReadyChange,
  ...props
}: React.ComponentProps<typeof ArcgisScene>) {
  const { view, onViewReady } = useCreateView(props.id);
  const containerRef = React.useRef<HTMLArcgisSceneElement>(null);

  const arcgisViewReadyCb = React.useCallback(
    (ev: ArcgisSceneCustomEvent<void>) => {
      if (ev.target !== containerRef.current) return;
      onViewReady(ev.target.view);
      onArcgisViewReadyChange?.(ev);
    },
    [onViewReady, onArcgisViewReadyChange],
  );

  return (
    <ArcInternalViewProvider view={view}>
      <ArcgisScene ref={containerRef} {...props} onArcgisViewReadyChange={arcgisViewReadyCb}>
        {view && children}
      </ArcgisScene>
    </ArcInternalViewProvider>
  );
}
