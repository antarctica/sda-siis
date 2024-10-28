import { useDrawSingleGraphic } from '@/arcgis/hooks/useGraphicSketch';
import { useViewById } from '@/arcgis/hooks/useViewContext';
import { Button } from '@/components/common/Button';

function Drawing() {
  const mapView = useViewById('map');
  if (!mapView) return null;
  return <DrawModeButton mapView={mapView as __esri.MapView} />;
}

function DrawModeButton({ mapView }: { mapView: __esri.MapView }) {
  const { create, geometry, activeDrawMode } = useDrawSingleGraphic(mapView);
  console.log(geometry);
  return (
    <Button
      variant={activeDrawMode === 'polyline' ? 'primary' : 'outline'}
      onPress={() => create('polyline')}
    >
      Draw Line
    </Button>
  );
}

export default Drawing;
