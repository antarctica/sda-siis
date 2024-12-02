import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { geojsonToArcGIS } from '@terraformer/arcgis';
import * as React from 'react';
import { FileTrigger } from 'react-aria-components';

import { convertRTZPToGeoJSON } from '@/api/api';
import { useSIISMapView } from '@/hooks/useMap';

import { Button } from '../common/Button';

function ImportRoute() {
  const mapView = useSIISMapView();
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
      const arcgisFeatureJSON = geojsonToArcGIS({
        type: 'FeatureCollection',
        features: [data as GeoJSON.Feature],
      });
      console.log(arcgisFeatureJSON);

      const featureCollection = {
        type: 'FeatureCollection',
        features: [data],
      };
      const dataBlob = new Blob([JSON.stringify(featureCollection)], { type: 'application/json' });

      if (!mapView) return;
      const geojsonLayer = new GeoJSONLayer({
        url: URL.createObjectURL(dataBlob),
      });
      mapView.map.add(geojsonLayer);
    });
  };

  return (
    <FileTrigger onSelect={onSelect}>
      <Button>Import Route</Button>
    </FileTrigger>
  );
}

export default ImportRoute;
