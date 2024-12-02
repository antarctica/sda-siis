import { Point } from '@arcgis/core/geometry';
import * as geodeticDistanceOperator from '@arcgis/core/geometry/operators/geodeticDistanceOperator.js';
import Graphic from '@arcgis/core/Graphic';
import { TextSymbol } from '@arcgis/core/symbols';

import { calculateProjectedMapAngle } from '@/utils/mapUtils';

import { DEFAULT_TEXT_SYMBOL_PROPS } from './constants';
import { isMeasurementLine } from './typeGuards';
import {
  Coordinate,
  LineGraphic,
  MeasurementLabelAttributes,
  MeasurementLineAttributes,
  MeasurementToolOptions,
  MeasurementUnit,
  PointGraphic,
} from './types';

/**
 * Converts a measurement unit to its display abbreviation
 * @param unit - The measurement unit to convert
 * @returns Abbreviated display unit (e.g., 'm' for meters)
 */
export function getDisplayUnit(unit: MeasurementUnit): string {
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

/**
 * Formats a distance value with its unit for display
 * @param distance - The distance value to format
 * @param unit - The measurement unit
 * @returns Formatted string with distance and unit
 */
function formatDistance(distance: number, unit: MeasurementUnit): string {
  return `${distance.toFixed(2)}${getDisplayUnit(unit)}`;
}

/**
 * Creates a label graphic for a line segment
 * @param params - Parameters for creating the segment label
 * @param params.startPoint - Starting coordinate of the segment
 * @param params.endPoint - Ending coordinate of the segment
 * @param params.distance - Length of the segment
 * @param params.spatialReference - Spatial reference system
 * @param params.mapRotation - Current map rotation in degrees
 * @param params.attributes - Label attributes
 * @param params.textSymbol - Text symbol properties
 * @param params.unit - Measurement unit
 * @returns Label graphic or null if creation fails
 */
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

/**
 * Creates label graphics for all segments in a line
 * @param mapView - The ArcGIS MapView instance
 * @param line - The line graphic to create labels for
 * @param textSymbol - Text symbol properties for labels
 * @param unit - Measurement unit
 * @returns Object containing labels, segment distances, and total distance
 */
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

  if (!paths?.length) {
    return { labels: [], segmentDistances: [], totalDistance: 0 };
  }

  let totalDistance = 0;
  const labels: PointGraphic<MeasurementLabelAttributes>[] = [];
  const segmentDistances: number[] = [];

  // Loop through each path in the polyline
  paths.forEach((path, pathIndex) => {
    if (path.length < 2) return;

    // Create labels for each segment in the current path
    for (let i = 1; i < path.length; i++) {
      const startPoint = polyline.getPoint(pathIndex, i - 1);
      const endPoint = polyline.getPoint(pathIndex, i);
      const segmentDistance = geodeticDistanceOperator.execute(startPoint, endPoint, {
        unit,
        curveType: 'geodesic',
      });
      totalDistance += segmentDistance;
      segmentDistances.push(segmentDistance);

      const label = createSegmentLabel({
        startPoint: [startPoint.x, startPoint.y],
        endPoint: [endPoint.x, endPoint.y],
        distance: segmentDistance,
        spatialReference: polyline.spatialReference,
        mapRotation: mapView.rotation,
        attributes: {
          type: 'measurement-label',
          lineId: line.attributes.lineId,
          measurementGroupId: line.attributes.measurementGroupId,
          pathIndex,
          segmentIndex: segmentDistances.length - 1,
        },
        textSymbol,
        unit,
      });

      if (label) {
        labels.push(label);
      }
    }
  });

  return { labels, segmentDistances, totalDistance };
}

/**
 * Adds segment labels to the label layer for a line graphic
 * @param mapView - The ArcGIS MapView instance
 * @param labelLayer - Graphics layer for labels
 * @param line - The line graphic to add labels for
 * @param textSymbol - Text symbol properties for labels
 * @param unit - Measurement unit
 * @returns Object containing segment distances and total distance
 */
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

/**
 * Removes all segment labels associated with a line graphic
 * @param labelLayer - Graphics layer containing labels
 * @param line - The line graphic whose labels should be removed
 */
export function removeSegmentLabelGraphics(
  labelLayer: __esri.GraphicsLayer,
  line: LineGraphic<MeasurementLineAttributes>,
) {
  const existingLabels = findExistingLabelsForLine(labelLayer, line);
  labelLayer.removeMany(existingLabels.toArray());
}

/**
 * Updates segment labels for a line graphic by removing existing labels and adding new ones
 * @param mapView - The ArcGIS MapView instance
 * @param labelLayer - Graphics layer for labels
 * @param line - The line graphic to update labels for
 * @param textSymbol - Text symbol properties for labels
 * @param unit - Measurement unit
 * @param options - Optional segment identification
 * @returns Object containing segment distances and total distance
 */
export function updateSegmentLabelGraphics(
  mapView: __esri.MapView,
  labelLayer: __esri.GraphicsLayer,
  line: LineGraphic<MeasurementLineAttributes>,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
  options?: {
    pathIndex?: number;
    segmentIndex?: number;
  },
): {
  segmentDistances: number[];
  totalDistance: number;
} {
  const existingLabels = findExistingLabelsForLine(labelLayer, line);

  if (options?.pathIndex !== undefined && options?.segmentIndex !== undefined) {
    // Update single segment
    const targetLabel = existingLabels.find(
      (g) =>
        g.getAttribute('pathIndex') === options.pathIndex &&
        g.getAttribute('segmentIndex') === options.segmentIndex,
    );

    const updatedLabel = updateSingleSegmentLabel(
      mapView,
      line,
      options.pathIndex,
      options.segmentIndex,
      textSymbol,
      unit,
    );

    if (updatedLabel) {
      if (targetLabel) {
        labelLayer.remove(targetLabel);
      }
      labelLayer.add(updatedLabel);
    }
  } else {
    // Update all segments
    labelLayer.removeMany(existingLabels.toArray());
    const { labels, segmentDistances, totalDistance } = createSegmentLabelGraphics(
      mapView,
      line,
      textSymbol,
      unit,
    );
    labelLayer.addMany(labels);
    return { segmentDistances, totalDistance };
  }

  // Recalculate all distances even for single segment update
  const { segmentDistances, totalDistance } = createSegmentLabelGraphics(
    mapView,
    line,
    textSymbol,
    unit,
  );

  return { segmentDistances, totalDistance };
}

/**
 * Creates event handlers for the SketchViewModel to manage line measurements
 * @param params - Configuration parameters
 * @param params.mapView - The ArcGIS MapView instance
 * @param params.measurementGraphicsLayer - Graphics layer for measurements
 * @param params.internalMeasurementGroupId - Unique identifier for the measurement group
 * @param params.unit - Measurement unit
 * @param params.options - Optional measurement tool configuration
 * @param params.sketchVM - SketchViewModel instance
 * @returns Object containing event handler functions for create, update, and delete events
 */
export function createSketchVMEventHandlers(params: {
  mapView: __esri.MapView;
  measurementGraphicsLayer: __esri.GraphicsLayer;
  internalMeasurementGroupId: string;
  unit: MeasurementUnit;
  options?: MeasurementToolOptions;
  sketchVM: __esri.SketchViewModel;
}) {
  const { mapView, measurementGraphicsLayer, internalMeasurementGroupId, unit, options, sketchVM } =
    params;

  const handleCreate = (event: __esri.SketchViewModelCreateEvent) => {
    const graphic = event.graphic;
    if (event.state === 'start') {
      initializeLineGraphic(graphic, internalMeasurementGroupId, unit);
    }

    if (isMeasurementLine(graphic)) {
      if (event.state === 'complete' || event.state === 'active') {
        // update the last segment of the line graphic only
        const lastPathIndex = graphic.geometry.paths.length - 1!;
        const lastSegmentIndex = graphic.geometry.paths[lastPathIndex]!.length - 2;
        updateLineGraphicMeasurements(
          graphic,
          mapView,
          measurementGraphicsLayer,
          unit,
          options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
          {
            pathIndex: lastPathIndex,
            segmentIndex: lastSegmentIndex,
          },
        );
      }
      if (event.state === 'cancel') {
        removeSegmentLabelGraphics(measurementGraphicsLayer, graphic);
      }
    }
  };

  const handleUpdate = (event: __esri.SketchViewModelUpdateEvent) => {
    if (event.state === 'active' || event.state === 'complete') {
      const graphic = event.graphics[0];
      if (!graphic || graphic.getAttribute('type') !== 'measurement-line') {
        sketchVM.cancel();
        return;
      }

      if (event.toolEventInfo && isMeasurementLine(graphic)) {
        if (
          event.toolEventInfo.type === 'reshape-start' ||
          event.toolEventInfo.type === 'move-start'
        ) {
          removeSegmentLabelGraphics(measurementGraphicsLayer, graphic);
        }

        if (
          event.toolEventInfo.type === 'reshape-stop' ||
          event.toolEventInfo.type === 'move-stop' ||
          event.toolEventInfo.type === 'vertex-remove' ||
          event.toolEventInfo.type === 'vertex-add'
        ) {
          updateLineGraphicMeasurements(
            graphic as LineGraphic<MeasurementLineAttributes>,
            mapView,
            measurementGraphicsLayer,
            unit,
            options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
          );
        }
      }
    }
  };

  const handleRedoUndo = (
    event: __esri.SketchViewModelUndoEvent | __esri.SketchViewModelRedoEvent,
  ) => {
    const graphic = event.graphics[0];
    if (!graphic || graphic.getAttribute('type') !== 'measurement-line') {
      sketchVM.cancel();
      return;
    }

    if (isMeasurementLine(graphic)) {
      updateLineGraphicMeasurements(
        graphic as LineGraphic<MeasurementLineAttributes>,
        mapView,
        measurementGraphicsLayer,
        unit,
        options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
      );
    }
  };

  const handleDelete = (event: __esri.SketchViewModelDeleteEvent) => {
    event.graphics.forEach((graphic) => {
      removeSegmentLabelGraphics(
        measurementGraphicsLayer,
        graphic as LineGraphic<MeasurementLineAttributes>,
      );
    });
  };

  return { handleCreate, handleUpdate, handleDelete, handleRedoUndo };
}

/**
 * Initializes a new line graphic with measurement attributes
 * @param graphic - The line graphic to initialize
 * @param groupId - Unique identifier for the measurement group
 * @param unit - Measurement unit
 */
export function initializeLineGraphic(
  graphic: __esri.Graphic,
  groupId: string,
  unit: MeasurementUnit,
) {
  // check if graphic is a polyline
  if (graphic.geometry.type !== 'polyline') {
    return;
  }

  graphic.setAttribute('lineId', crypto.randomUUID());
  graphic.setAttribute('measurementGroupId', groupId);
  graphic.setAttribute('type', 'measurement-line');
  graphic.setAttribute('length', 0);
  graphic.setAttribute('unit', unit);
}

/**
 * Updates measurements for a line graphic and its associated labels
 * @param graphic - The line graphic to update
 * @param mapView - The ArcGIS MapView instance
 * @param layer - Graphics layer containing the measurements
 * @param unit - Measurement unit
 * @param options - Optional measurement tool configuration
 */
export function updateLineGraphicMeasurements(
  graphic: LineGraphic<MeasurementLineAttributes>,
  mapView: __esri.MapView,
  layer: __esri.GraphicsLayer,
  unit: MeasurementUnit,
  textSymbol: __esri.TextSymbolProperties,
  options?: {
    pathIndex?: number;
    segmentIndex?: number;
  },
) {
  const { totalDistance } = updateSegmentLabelGraphics(
    mapView,
    layer,
    graphic,
    textSymbol,
    unit,
    options,
  );
  graphic.setAttribute('unit', unit);
  graphic.setAttribute('length', totalDistance);
}

function updateSingleSegmentLabel(
  mapView: __esri.MapView,
  line: LineGraphic<MeasurementLineAttributes>,
  pathIndex: number,
  segmentIndex: number,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
): PointGraphic<MeasurementLabelAttributes> | null {
  const polyline = line.geometry;
  const path = polyline.paths[pathIndex];

  if (!path || segmentIndex >= path.length - 1) {
    return null;
  }

  const startPoint = polyline.getPoint(pathIndex, segmentIndex);
  const endPoint = polyline.getPoint(pathIndex, segmentIndex + 1);
  const segmentDistance = geodeticDistanceOperator.execute(startPoint, endPoint, {
    unit,
    curveType: 'geodesic',
  });

  return createSegmentLabel({
    startPoint: [startPoint.x, startPoint.y],
    endPoint: [endPoint.x, endPoint.y],
    distance: segmentDistance,
    spatialReference: polyline.spatialReference,
    mapRotation: mapView.rotation,
    attributes: {
      type: 'measurement-label',
      lineId: line.attributes.lineId,
      measurementGroupId: line.attributes.measurementGroupId,
      pathIndex,
      segmentIndex,
    },
    textSymbol,
    unit,
  });
}

function findExistingLabelsForLine(
  layer: __esri.GraphicsLayer,
  line: LineGraphic<MeasurementLineAttributes>,
) {
  return layer.graphics.filter(
    (g) =>
      g.getAttribute('lineId') === line.attributes.lineId &&
      g.getAttribute('measurementGroupId') === line.attributes.measurementGroupId &&
      g.getAttribute('type') === 'measurement-label',
  );
}
