import { SpatialReference } from '@arcgis/core/geometry';
import { project } from '@arcgis/core/geometry/projection';
import { arcgisToGeoJSON } from '@terraformer/arcgis';

import { convertGeoJSONToRTZP } from '@/api/api';

import { RouteGraphic } from '../utils';

export function useRouteExport() {
  const exportRoute = async (routeGraphic: RouteGraphic) => {
    try {
      // Project to WGS84
      const projectedGraphic = routeGraphic.clone();
      projectedGraphic.geometry = project(
        routeGraphic.geometry,
        SpatialReference.WGS84,
      ) as __esri.Polyline;

      const geoJSON = arcgisToGeoJSON(projectedGraphic.toJSON());
      const blob = await convertGeoJSONToRTZP(JSON.stringify(geoJSON));

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${routeGraphic.attributes.route_name}.rtzp`;
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting route:', error);
      throw error;
    }
  };

  return { exportRoute };
}
