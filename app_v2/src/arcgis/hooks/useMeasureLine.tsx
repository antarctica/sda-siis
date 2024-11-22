import Collection from '@arcgis/core/core/Collection';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { SpatialReference } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import { project } from '@arcgis/core/geometry/projection';
import Graphic from '@arcgis/core/Graphic';
import CIMSymbol from '@arcgis/core/symbols/CIMSymbol.js';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

import { calculateProjectedMapAngle } from '@/utils/mapUtils';

import { useGraphicsLayer } from './useLayer';
import { useArcState, useWatchEffect } from './useWatchEffect';

const DEFAULT_TEXT_SYMBOL_PROPS: __esri.TextSymbolProperties = {
  color: 'black',
  font: {
    family: 'Arial',
    size: 9,
  },
  haloColor: 'white',
  haloSize: 1,
};

const DEFAULT_UNIT: MeasurementUnit = 'nautical-miles';

const DEFAULT_LINE_SYMBOL = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    symbol: {
      type: 'CIMLineSymbol',
      symbolLayers: [
        {
          // white dashed layer at center of the line
          type: 'CIMSolidStroke',
          effects: [
            {
              type: 'CIMGeometricEffectDashes',
              dashTemplate: [8, 8, 8, 8], // width of dashes and spacing between the dashes
              lineDashEnding: 'NoConstraint',
              offsetAlongLine: 0,
            },
          ],
          enable: true, // must be set to true in order for the symbol layer to be visible
          capStyle: 'Butt',
          joinStyle: 'Round',
          width: 1,
          color: [255, 255, 255, 255],
        },
        {
          // lighter green line layer that surrounds the dashes
          type: 'CIMSolidStroke',
          enable: true,
          capStyle: 'Butt',
          joinStyle: 'Round',
          width: 3,
          color: [0, 0, 0, 255],
        },
        {
          // darker green outline around the line symbol
          type: 'CIMSolidStroke',
          enable: true,
          capStyle: 'Butt',
          joinStyle: 'Round',
          width: 4,
          color: [100, 100, 100, 255],
        },
      ],
    },
  },
});

type MeasurementUnit = 'meters' | 'kilometers' | 'feet' | 'yards' | 'miles' | 'nautical-miles';

type MeasurementToolOptions = {
  unit?: MeasurementUnit;
  textSymbol?: __esri.TextSymbolProperties;
  sketchOptions?: __esri.SketchViewModelProperties;
};

interface MeasurementLine<T extends object> extends __esri.Graphic {
  attributes: T;
  geometry: __esri.Polyline;
}

export type MeasurementLineAttributes = {
  lineId: string;
  length: number;
  unit: MeasurementUnit;
};

type Coordinate = [number, number];

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
function createSegmentLabel(params: {
  startPoint: Coordinate;
  endPoint: Coordinate;
  startPointGeographic: Coordinate;
  endPointGeographic: Coordinate;
  spatialReference: __esri.SpatialReference;
  mapRotation: number;
  lineId: string;
  segmentIndex: number;
  textSymbol: __esri.TextSymbolProperties;
  unit: MeasurementUnit;
}): __esri.Graphic | null {
  const {
    startPoint,
    endPoint,
    startPointGeographic,
    endPointGeographic,
    spatialReference,
    mapRotation,
    lineId,
    segmentIndex,
    textSymbol,
    unit,
  } = params;

  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;
  const [x1_Geographic, y1_Geographic] = startPointGeographic;
  const [x2_Geographic, y2_Geographic] = endPointGeographic;

  const angle = (calculateProjectedMapAngle(x1, y1, x2, y2) - mapRotation + 360) % 360;

  const centerPoint = new Point({
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
    spatialReference,
  });

  //   const bearing = calculateGeographicBearing(
  //     y1_Geographic,
  //     x1_Geographic,
  //     y2_Geographic,
  //     x2_Geographic,
  //   );

  const segmentLine = new Polyline({
    paths: [
      [
        [x1_Geographic, y1_Geographic],
        [x2_Geographic, y2_Geographic],
      ],
    ],
    spatialReference: SpatialReference.WGS84,
  });

  const distance = geometryEngine.geodesicLength(segmentLine, unit);
  const labelText = ` \n${formatDistance(distance, unit)}`;

  return new Graphic({
    geometry: centerPoint,
    symbol: new TextSymbol({
      ...textSymbol,
      angle: angle > 90 && angle < 270 ? angle * -1 + 180 : angle * -1,
      text: labelText,
    }),
    attributes: {
      lineId,
      segmentIndex,
    },
  });
}

function createSegmentLabelGraphics(
  mapView: __esri.MapView,
  line: __esri.Graphic,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
): __esri.Graphic[] {
  const polyline = line.geometry as __esri.Polyline;
  const paths = polyline.paths;

  if (!paths?.[0] || paths[0].length < 2) {
    return [];
  }

  const path = paths[0];

  // Project the entire polyline to geographic coordinates
  const geographicPolyline = project(polyline, SpatialReference.WGS84) as __esri.Polyline;
  const geographicPaths = geographicPolyline.paths;

  if (!geographicPaths?.[0] || geographicPaths[0].length < 2) {
    return [];
  }

  const pathGeographic = geographicPaths[0];
  const labels: __esri.Graphic[] = [];

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

    const label = createSegmentLabel({
      startPoint,
      endPoint,
      startPointGeographic,
      endPointGeographic,
      spatialReference: polyline.spatialReference,
      mapRotation: mapView.rotation,
      lineId: line.attributes?.lineId ?? '',
      segmentIndex: i,
      textSymbol,
      unit,
    });

    if (label) {
      labels.push(label);
    }
  }

  return labels;
}

function addSegmentLabelGraphics(
  mapView: __esri.MapView,
  labelLayer: __esri.GraphicsLayer,
  line: __esri.Graphic,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
) {
  const labels = createSegmentLabelGraphics(mapView, line, textSymbol, unit);
  labelLayer.addMany(labels);
}

function removeSegmentLabelGraphics(labelLayer: __esri.GraphicsLayer, line: __esri.Graphic) {
  const existingLabels = labelLayer.graphics.filter(
    (g) => g.attributes?.lineId === line.attributes?.lineId,
  );
  labelLayer.removeMany(existingLabels.toArray());
}

function updateSegmentLabelGraphics(
  mapView: __esri.MapView,
  labelLayer: __esri.GraphicsLayer,
  line: __esri.Graphic,
  textSymbol: __esri.TextSymbolProperties,
  unit: MeasurementUnit,
) {
  removeSegmentLabelGraphics(labelLayer, line);
  addSegmentLabelGraphics(mapView, labelLayer, line, textSymbol, unit);
}

export function useMeasureLine(
  mapView: __esri.MapView,
  options?: MeasurementToolOptions,
): {
  startMeasurement: () => void;
  clearAll: () => void;
  measurements: {
    id: string;
    graphic: MeasurementLine<MeasurementLineAttributes>;
    clear: () => void;
  }[];
  isActive: boolean;
} {
  const { layer: lineLayer } = useGraphicsLayer(mapView, {
    listMode: 'hide',
  });

  const { layer: labelLayer } = useGraphicsLayer(mapView, {
    listMode: 'hide',
  });

  const [measurements, setMeasurements] = React.useState<
    {
      id: string;
      graphic: MeasurementLine<MeasurementLineAttributes>;
      clear: () => void;
    }[]
  >([]);

  React.useEffect(() => {
    reactiveUtils.on(
      () => lineLayer.graphics,
      'after-changes',
      (event) => {
        const graphics = event.target as Collection<MeasurementLine<MeasurementLineAttributes>>;
        setMeasurements(
          graphics
            .map((graphic) => ({
              id: graphic.attributes.lineId,
              graphic,
              clear: () => lineLayer.remove(graphic),
            }))
            .toArray(),
        );
      },
    );
  }, [lineLayer]);

  useWatchEffect(
    () => mapView?.rotation,
    () => {
      // loop through all of the lines and update the labels
      lineLayer.graphics.forEach((line) => {
        updateSegmentLabelGraphics(
          mapView,
          labelLayer,
          line,
          options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
          options?.unit ?? DEFAULT_UNIT,
        );
      });
    },
  );

  const sketchVM = React.useMemo(() => {
    const newSketchVM = new SketchViewModel({
      view: mapView,
      layer: lineLayer,
      tooltipOptions: {
        enabled: true,
        visibleElements: {
          area: false,
          coordinates: false,
          helpMessage: true,
          distance: false,
          direction: false,
          totalLength: false,
        },
      },
      defaultCreateOptions: {
        mode: 'click',
      },

      defaultUpdateOptions: {
        tool: 'reshape',
        enableRotation: false,
        enableScaling: false,
        enableZ: false,
        multipleSelectionEnabled: false,
      },
      polylineSymbol: DEFAULT_LINE_SYMBOL,
      ...options?.sketchOptions,
    });

    newSketchVM.on('create', (event) => {
      const graphic = event.graphic as MeasurementLine<MeasurementLineAttributes>;
      if (event.state === 'start') {
        graphic.setAttribute('lineId', crypto.randomUUID());
      }
      if (event.state === 'complete' || event.state === 'active') {
        updateSegmentLabelGraphics(
          mapView,
          labelLayer,
          graphic,
          options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
          options?.unit ?? DEFAULT_UNIT,
        );
      }
      if (event.state === 'cancel') {
        removeSegmentLabelGraphics(labelLayer, graphic);
      }
    });

    newSketchVM.on('update', (event) => {
      if (event.state === 'active' || event.state === 'complete') {
        const graphic = event.graphics[0];
        if (!graphic) return;

        updateSegmentLabelGraphics(
          mapView,
          labelLayer,
          graphic,
          options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
          options?.unit ?? DEFAULT_UNIT,
        );
      }
    });

    newSketchVM.on('delete', (event) => {
      event.graphics.forEach((graphic) => {
        removeSegmentLabelGraphics(labelLayer, graphic);
      });
    });

    return newSketchVM;
  }, [mapView, lineLayer, labelLayer, options]);

  const [activeDrawMode] = useArcState(sketchVM, 'activeTool');

  const startMeasurement = React.useCallback(() => {
    if (activeDrawMode === 'polyline') {
      sketchVM.cancel();
      return;
    }

    sketchVM.create('polyline');
  }, [sketchVM, activeDrawMode]);

  const clearAll = React.useCallback(() => {
    if (activeDrawMode === 'polyline') {
      sketchVM.cancel();
    }
    lineLayer.removeAll();
    labelLayer.removeAll();
  }, [lineLayer, labelLayer, activeDrawMode, sketchVM]);

  return {
    startMeasurement,
    clearAll,
    isActive: activeDrawMode === 'polyline',
    measurements,
  };
}
