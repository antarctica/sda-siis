import { SimpleMarkerSymbol } from '@arcgis/core/symbols';
import { Flex } from '@styled-system/jsx';
import React from 'react';

import CoordinateField, {
  CoordinateInputMapSelectionOptions,
} from '@/components/common/forms/CoordinateInput';
import MeasureLine from '@/components/Map/map-controls/MeasureLine';
import { useSIISMapView } from '@/hooks/useMap';

function Measure() {
  const mapView = useSIISMapView();
  const [coordinate, setCoordinate] = React.useState<string>('');

  const mapSelectionOptions: CoordinateInputMapSelectionOptions = React.useMemo(() => {
    return {
      mapSelectionEnabled: true,
      mapView: mapView,
      updateEnabled: true,
      pointSymbol: new SimpleMarkerSymbol({
        color: [255, 0, 0],
        size: 10,
      }),
    };
  }, [mapView]);

  if (!mapView) return null;
  return (
    <Flex gap="2" direction="column">
      <MeasureLine mapView={mapView as __esri.MapView} />
      <CoordinateField
        label="Mark a coordinate"
        onChange={setCoordinate}
        value={coordinate}
        mapSelectionOptions={mapSelectionOptions}
      />
    </Flex>
  );
}

export default Measure;
