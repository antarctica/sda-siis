import Graphic from '@arcgis/core/Graphic';
import { SimpleLineSymbol } from '@arcgis/core/symbols';
import { geojsonToArcGIS } from '@terraformer/arcgis';

import { convertRTZPToGeoJSON } from '@/api/api';
import { ROUTE_GRAPHIC_UNIQUE_ID } from '@/config/constants';
import { ROUTE_STYLE } from '@/config/styles';

import { isRouteGraphic } from '../utils';

export function useRouteImport(
  setGraphic: (graphic: __esri.Graphic | undefined) => void,
  mapView: __esri.MapView,
) {
  const handleRouteImport = async (file: File) => {
    if (!file.name.endsWith('.rtzp')) {
      alert('Please select a .rtzp file');
      return;
    }

    try {
      const geoJSONData = await convertRTZPToGeoJSON(file);
      const arcgisFeatureJSON = geojsonToArcGIS(geoJSONData as GeoJSON.Feature);
      const featureGraphic = Graphic.fromJSON(arcgisFeatureJSON);

      if (!isRouteGraphic(featureGraphic)) {
        throw new Error('Invalid route file');
      }

      featureGraphic.setAttribute('graphicId', ROUTE_GRAPHIC_UNIQUE_ID);
      featureGraphic.symbol = new SimpleLineSymbol(ROUTE_STYLE);

      setGraphic(featureGraphic);
      mapView.goTo(featureGraphic);
    } catch (error) {
      console.error('Error importing route:', error);
    }
  };

  return { handleRouteImport };
}
