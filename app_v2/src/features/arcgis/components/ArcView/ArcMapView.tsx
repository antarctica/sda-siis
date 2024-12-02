import '@arcgis/map-components/dist/components/arcgis-map';

import { ArcgisMapCustomEvent } from '@arcgis/map-components';
import { ArcgisMap } from '@arcgis/map-components-react';
import React from 'react';

import { useCreateView } from '@/features/arcgis/hooks/useCreateView';

import { ArcInternalViewProvider } from '../../contexts/InternalViewContext/ArcInternalViewProvider';

export function ArcMapView({
  children,
  onArcgisViewReadyChange,
  ...props
}: React.ComponentProps<typeof ArcgisMap>) {
  const { view, onViewReady } = useCreateView(props.id);
  const containerRef = React.useRef<HTMLArcgisMapElement>(null);

  const arcgisViewReadyCb = React.useCallback(
    (ev: ArcgisMapCustomEvent<void>) => {
      if (ev.target !== containerRef.current) return;
      onViewReady(ev.target.view);
      onArcgisViewReadyChange?.(ev);
    },
    [onViewReady, onArcgisViewReadyChange],
  );

  return (
    <ArcInternalViewProvider view={view}>
      <ArcgisMap ref={containerRef} {...props} onArcgisViewReadyChange={arcgisViewReadyCb}>
        {view && children}
      </ArcgisMap>
    </ArcInternalViewProvider>
  );
}
