import { CIMSymbol } from '@arcgis/core/symbols';

import { generateCircleRings } from '@/utils/mapUtils';

import { MeasurementUnit } from './types';

/**
 * Default text symbol properties for measurement labels
 */
export const DEFAULT_TEXT_SYMBOL_PROPS: __esri.TextSymbolProperties = {
  color: 'black',
  font: {
    family: 'Arial',
    size: 10,
  },
  haloColor: 'white',
  haloSize: 1,
};

export const DEFAULT_UNIT: MeasurementUnit = 'nautical-miles';

/**
 * Default line symbol configuration for measurement lines
 * Creates a complex line with the following layers (from bottom to top):
 * 1. Gray outer stroke (4px)
 * 2. Black inner stroke (3px)
 * 3. White dashed center line (1px)
 * 4. Vertex markers (black circles with white centers)
 */
export const DEFAULT_LINE_SYMBOL = new CIMSymbol({
  data: {
    type: 'CIMSymbolReference',
    symbol: {
      type: 'CIMLineSymbol',
      symbolLayers: [
        {
          type: 'CIMVectorMarker',
          enable: true,
          size: 6,
          markerPlacement: {
            type: 'CIMMarkerPlacementOnVertices',
            placeOnEndPoints: true,
            placeOnRegularVertices: true,
          },
          frame: {
            xmin: -5,
            ymin: -5,
            xmax: 5,
            ymax: 5,
          },
          markerGraphics: [
            {
              type: 'CIMMarkerGraphic',
              geometry: {
                rings: [generateCircleRings(12, 5)],
              },
              symbol: {
                type: 'CIMPolygonSymbol',
                symbolLayers: [
                  {
                    type: 'CIMSolidFill',
                    enable: true,
                    color: [0, 0, 0, 255],
                  },
                ],
              },
            },
            {
              type: 'CIMMarkerGraphic',
              geometry: {
                rings: [generateCircleRings(12, 4)],
              },
              symbol: {
                type: 'CIMPolygonSymbol',
                symbolLayers: [
                  {
                    type: 'CIMSolidFill',
                    enable: true,
                    color: [255, 255, 255, 255],
                  },
                ],
              },
            },
          ],
        },
        {
          // Center dashed line - creates a white dashed pattern
          type: 'CIMSolidStroke',
          effects: [
            {
              type: 'CIMGeometricEffectDashes',
              dashTemplate: [8, 8, 8, 8], // [dash, gap, dash, gap]
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

export function getSketchViewModelConfig(
  mapView: __esri.MapView,
  measurementGraphicsLayer: __esri.GraphicsLayer,
  sketchOptions?: __esri.SketchViewModelProperties,
): __esri.SketchViewModelProperties {
  return {
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
      highlightOptions: {
        enabled: false,
      },
    },
    polylineSymbol: DEFAULT_LINE_SYMBOL,
    ...sketchOptions,
    view: mapView,
    layer: measurementGraphicsLayer,
  };
}
