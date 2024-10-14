import { ArcgisPlacement } from '@arcgis/map-components-react';
import { Box } from '@styled-system/jsx';
import React from 'react';

import { ArcMapView } from '@/arcgis/ArcView/ArcMapView';
import { getMap } from '@/config/map';

import ScaleControl from './map-controls/ScaleControl';
import ZoomControl from './map-controls/ZoomControl';

export function Map() {
  const { map, initialZoom } = React.useMemo(() => {
    return getMap();
  }, []);

  return (
    <Box w={'full'} h={'full'} position={'relative'}>
      <ArcMapView id="map" map={map} zoom={initialZoom}>
        <ArcgisPlacement position="bottom-right">
          <ZoomControl />
        </ArcgisPlacement>
        <ArcgisPlacement position="bottom-left">
          <ScaleControl />
        </ArcgisPlacement>
      </ArcMapView>
    </Box>
  );
}
