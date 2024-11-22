import { SpatialReference } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import { project } from '@arcgis/core/geometry/projection';
import { Flex } from '@styled-system/jsx';

import { useMeasureLine } from '@/arcgis/hooks/useMeasureLine';
import { Button } from '@/components/common/Button';
import Typography from '@/components/common/Typography';

function MeasureLine({ mapView }: { mapView: __esri.MapView }) {
  const { startMeasurement, measurements } = useMeasureLine(mapView);
  console.log(measurements);
  return (
    <>
      <Button onPress={() => startMeasurement()}>Measure Line</Button>
      <Flex>
        {measurements.map(({ graphic, id }) => {
          const polyline = graphic.geometry as __esri.Polyline;
          const projectedPolyline = project(polyline, SpatialReference.WGS84) as __esri.Polyline;
          const [path] = projectedPolyline.paths;
          if (!path || path.length < 2) return;
          const length = geometryEngine.geodesicLength(projectedPolyline, 'nautical-miles');
          graphic.attributes.length = length;
          return (
            <Typography key={id}>
              {id} - {length}nm
            </Typography>
          );
        })}
      </Flex>
    </>
  );
}

export default MeasureLine;
