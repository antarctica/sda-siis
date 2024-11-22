import { Point, Polyline, SpatialReference } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import { project } from '@arcgis/core/geometry/projection';
import Graphic from '@arcgis/core/Graphic';
import { TextSymbol } from '@arcgis/core/symbols';

import { calculateProjectedMapAngle } from '@/utils/mapUtils';

import {
  Coordinate,
  LineGraphic,
  MeasurementLabelAttributes,
  MeasurementLineAttributes,
  MeasurementUnit,
  PointGraphic,
} from './types';

function isValidCoordinate(point: number[]): point is Coordinate {
  return (
    Array.isArray(point) &&
    point.length === 2 &&
    typeof point[0] === 'number' &&
    typeof point[1] === 'number'
  );
}

function getDisplayUnit(unit: MeasurementUnit): string {
  switch (unit) {
    case 'meters':
      return 'm';
    case 'nautical-miles':
      return 'nm';
    case 'feet':
      return 'ft';
    case 'yards':
      return 'yd';
    case 'miles':
      return 'mi';
    case 'kilometers':
      return 'km';
    default:
      return unit;
  }
}

function formatDistance(distance: number, unit: MeasurementUnit): string {
  return `${distance.toFixed(2)}${getDisplayUnit(unit)}`;
}

// Helper function to create a single segment label
function createSegmentLabel({
  startPoint,
  endPoint,
  distance,
  spatialReference,
  mapRotation,
  attributes,
  textSymbol,
  unit,
}: {
  startPoint: Coordinate;
  endPoint: Coordinate;
  distance: number;
  spatialReference: __esri.SpatialReference;
  mapRotation: number;
  attributes: MeasurementLabelAttributes;
  textSymbol: __esri.TextSymbolProperties;
  unit: MeasurementUnit;
}): PointGraphic<MeasurementLabelAttributes> | null {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  const angle = (calculateProjectedMapAngle(x1, y1, x2, y2) - mapRotation + 360) % 360;

  const centerPoint = new Point({
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
    spatialReference,
  });

  const labelText = ` \n${formatDistance(distance, unit)}`;

  return new Graphic({
    geometry: centerPoint,
    symbol: new TextSymbol({
      ...textSymbol,
      angle: angle > 90 && angle < 270 ? angle * -1 + 180 : angle * -1,
      text: labelText,
    }),
    attributes,
  }) as PointGraphic<MeasurementLabelAttributes>;
}

function createSegmentLabelGraphics(
  mapView: __esri.MapView,
  line: LineGraphic<MeasurementLineAttributes>,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
): {
  labels: PointGraphic<MeasurementLabelAttributes>[];
  segmentDistances: number[];
  totalDistance: number;
} {
  const polyline = line.geometry;
  const paths = polyline.paths;

  if (!paths?.[0] || paths[0].length < 2) {
    return { labels: [], segmentDistances: [], totalDistance: 0 };
  }

  const path = paths[0];

  // Project the entire polyline to geographic coordinates
  const geographicPolyline = project(polyline, SpatialReference.WGS84) as __esri.Polyline;
  const geographicPaths = geographicPolyline.paths;

  if (!geographicPaths?.[0] || geographicPaths[0].length < 2) {
    return { labels: [], segmentDistances: [], totalDistance: 0 };
  }

  const pathGeographic = geographicPaths[0];
  let totalDistance = 0;
  const labels: PointGraphic<MeasurementLabelAttributes>[] = [];
  const segmentDistances: number[] = [];

  // Create labels for each segment
  for (let i = 1; i < path.length; i++) {
    const startPoint = path[i - 1];
    const endPoint = path[i];
    const startPointGeographic = pathGeographic[i - 1];
    const endPointGeographic = pathGeographic[i];

    // Validate all points exist and are valid coordinates
    if (
      !startPoint ||
      !endPoint ||
      !startPointGeographic ||
      !endPointGeographic ||
      !isValidCoordinate(startPoint) ||
      !isValidCoordinate(endPoint) ||
      !isValidCoordinate(startPointGeographic) ||
      !isValidCoordinate(endPointGeographic)
    ) {
      continue;
    }

    const segmentLine = new Polyline({
      paths: [
        [
          [startPointGeographic[0], startPointGeographic[1]],
          [endPointGeographic[0], endPointGeographic[1]],
        ],
      ],
      spatialReference: SpatialReference.WGS84,
    });

    const segmentDistance = geometryEngine.geodesicLength(segmentLine, unit);
    totalDistance += segmentDistance;
    segmentDistances.push(segmentDistance);

    const label = createSegmentLabel({
      startPoint,
      endPoint,
      distance: segmentDistance,
      spatialReference: polyline.spatialReference,
      mapRotation: mapView.rotation,
      attributes: {
        type: 'measurement-label',
        lineId: line.attributes.lineId,
        measurementGroupId: line.attributes.measurementGroupId,
        segmentIndex: i,
      },
      textSymbol,
      unit,
    });

    if (label) {
      labels.push(label);
    }
  }

  return { labels, segmentDistances, totalDistance };
}

export function addSegmentLabelGraphics(
  mapView: __esri.MapView,
  labelLayer: __esri.GraphicsLayer,
  line: LineGraphic<MeasurementLineAttributes>,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
) {
  const { labels, segmentDistances, totalDistance } = createSegmentLabelGraphics(
    mapView,
    line,
    textSymbol,
    unit,
  );
  labelLayer.addMany(labels);
  return { segmentDistances, totalDistance };
}

export function removeSegmentLabelGraphics(
  labelLayer: __esri.GraphicsLayer,
  line: LineGraphic<MeasurementLineAttributes>,
) {
  const existingLabels = labelLayer.graphics.filter(
    (g) =>
      g.getAttribute('lineId') === line.attributes.lineId &&
      g.getAttribute('measurementGroupId') === line.attributes.measurementGroupId &&
      g.getAttribute('type') === 'measurement-label',
  );
  labelLayer.removeMany(existingLabels.toArray());
}

export function updateSegmentLabelGraphics(
  mapView: __esri.MapView,
  labelLayer: __esri.GraphicsLayer,
  line: LineGraphic<MeasurementLineAttributes>,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
): {
  segmentDistances: number[];
  totalDistance: number;
} {
  removeSegmentLabelGraphics(labelLayer, line);
  return addSegmentLabelGraphics(mapView, labelLayer, line, textSymbol, unit);
}
