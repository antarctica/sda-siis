import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { Flex } from '@styled-system/jsx';

import MeasureLine from '@/components/Map/map-controls/MeasureLine';
import { useSIISMapView } from '@/hooks/useMap';

const measurementGraphicsLayer = new GraphicsLayer({
  listMode: 'hide',
});

function Measure() {
  const mapView = useSIISMapView();

  if (!mapView) return null;
  return (
    <Flex gap="2" direction="column">
      <MeasureLine graphicsLayer={measurementGraphicsLayer} mapView={mapView as __esri.MapView} />
    </Flex>
  );
}

export default Measure;
