import { useMapInteractionLayers } from '@/contexts/MapInteractionLayers';
import MeasureLine from '@/features/siisMap/map-controls/MeasurePolylineControl';
import { useSIISMapView } from '@/hooks/useSIISMapView';

function Measure() {
  const mapView = useSIISMapView();
  const { measurementInteraction } = useMapInteractionLayers();
  if (!mapView) return null;
  return (
    <MeasureLine
      graphicsLayer={measurementInteraction.layer}
      mapView={mapView as __esri.MapView}
      measurementID="MeasureLine"
    />
  );
}

export default Measure;
