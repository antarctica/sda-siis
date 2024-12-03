import Graphic from '@arcgis/core/Graphic';
import { SimpleLineSymbol } from '@arcgis/core/symbols';
import { geojsonToArcGIS } from '@terraformer/arcgis';
import { FileTrigger } from 'react-aria-components';

import { convertRTZPToGeoJSON } from '@/api/api';
import { useLayerView } from '@/features/arcgis/hooks/useLayerView';

import { Button } from '../common/Button';

function ImportRoute({
  graphicsLayer,
  mapView,
}: {
  graphicsLayer: __esri.GraphicsLayer;
  mapView: __esri.MapView;
}) {
  useLayerView(mapView, graphicsLayer);
  const onSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    if (!file) {
      return;
    }

    if (!file.name.endsWith('.rtzp')) {
      // Handle invalid file type
      alert('Please select a .rtzp file');
      return;
    }
    convertRTZPToGeoJSON(file).then((data) => {
      const arcgisFeatureJSON = geojsonToArcGIS(data as GeoJSON.Feature);

      const featureGraphic = Graphic.fromJSON(arcgisFeatureJSON);
      featureGraphic.symbol = new SimpleLineSymbol({
        color: [255, 0, 0],
        width: 4,
      });

      graphicsLayer.removeAll();
      graphicsLayer.addMany([featureGraphic]);
    });
  };

  return (
    <FileTrigger onSelect={onSelect}>
      <Button>Import Route</Button>
    </FileTrigger>
  );
}

export default ImportRoute;
