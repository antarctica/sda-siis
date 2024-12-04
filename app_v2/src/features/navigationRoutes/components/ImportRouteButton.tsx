import Graphic from '@arcgis/core/Graphic';
import { SimpleLineSymbol } from '@arcgis/core/symbols';
import { geojsonToArcGIS } from '@terraformer/arcgis';
import { FileTrigger } from 'react-aria-components';

import { convertRTZPToGeoJSON } from '@/api/api';
import { ROUTE_GRAPHIC_UNIQUE_ID } from '@/config/constants';
import { ROUTE_STYLE } from '@/config/styles';

import { Button } from '../../../components/common/Button';
import { isRouteGraphic } from '../utils';

export function ImportRouteButton({
  graphicsLayer,
  setGeometry,
  setRouteName,
}: {
  graphicsLayer: __esri.GraphicsLayer;
  setGeometry: React.Dispatch<React.SetStateAction<__esri.Polyline | undefined>>;
  setRouteName: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
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

      if (!isRouteGraphic(featureGraphic)) {
        console.error('Invalid route file');
        return;
      }

      featureGraphic.setAttribute('graphicId', ROUTE_GRAPHIC_UNIQUE_ID);
      featureGraphic.symbol = new SimpleLineSymbol(ROUTE_STYLE);

      graphicsLayer.removeAll();
      graphicsLayer.addMany([featureGraphic]);
      setGeometry(featureGraphic.geometry);
      setRouteName(featureGraphic.attributes.route_name);
    });
  };

  return (
    <FileTrigger onSelect={onSelect}>
      <Button variant="outline">Import Route</Button>
    </FileTrigger>
  );
}
