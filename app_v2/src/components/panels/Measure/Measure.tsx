import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

import MeasureLine from '@/components/Map/map-controls/MeasurePolylineControl';
import { useSIISMapView } from '@/hooks/useMap';

const measurementGraphicsLayer = new GraphicsLayer({
  listMode: 'hide',
});

function Measure() {
  const mapView = useSIISMapView();

  if (!mapView) return null;
  return (
    <MeasureLine
      graphicsLayer={measurementGraphicsLayer}
      mapView={mapView as __esri.MapView}
      measurementID="MeasureLine"
    />
  );
}

export default Measure;
