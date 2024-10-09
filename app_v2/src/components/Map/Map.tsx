import { ArcgisPlacement } from '@arcgis/map-components-react';
import { Box } from '@styled-system/jsx';
import React from 'react';

import { ArcMapView } from '@/arcgis/ArcView/ArcMapView';
import { getMap } from '@/config/map';

import ZoomControl from '../map-controls/ZoomControl';

export function Map() {
  const { map, initialZoom } = React.useMemo(() => {
    return getMap();
  }, []);

  return (
    <Box w={'full'} h={'full'} position={'relative'}>
      <ArcMapView map={map} zoom={initialZoom}>
        <ArcgisPlacement position="bottom-right">
          <ZoomControl />
        </ArcgisPlacement>
      </ArcMapView>
    </Box>
  );
}
