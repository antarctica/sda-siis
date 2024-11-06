import { Point, Polyline } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Graphic from '@arcgis/core/Graphic';
import { CIMSymbol } from '@arcgis/core/symbols';

import shipIcon from '/Ship.png?url';
import { MapCRS } from '@/types';

import {
  calculateCorrectedHeading,
  createSmoothScaledSymbolSize,
} from '../../../../utils/mapUtils';

const SHIP_GRAPHIC_ID = 'ship-graphic';
export const REF_ID_ATTRIBUTE = 'refId';

/**
 * Creates a CIMSymbol representing a ship on the map.
 * @param {Object} position - The ship's position.
 * @param {number} position.latitude - The ship's latitude.
 * @param {number} position.longitude - The ship's longitude.
 * @param {number} heading - The ship's heading in degrees.
 * @param {Function} project - The projection function from ArcGIS.
 * @param {MapCRS} mapCRS - The map's coordinate reference system.
 * @param {number} scale - The current map scale.
 * @param {number} [minScale=32] - The minimum scale for the ship symbol.
 * @param {number} [maxScale=10] - The maximum scale for the ship symbol.
 * @returns {CIMSymbol} The created ship symbol.
 */
export function getShipSymbol(
  position: { latitude: number; longitude: number },
  heading: number,
  mapCRS: MapCRS,
  scale: number,
  mapRotation: number,
  minScale: number = 32,
  maxScale: number = 10,
) {
  const symbolRotation = calculateCorrectedHeading(position, heading, mapCRS) + mapRotation;
  const clampedSize = createSmoothScaledSymbolSize(scale, minScale, maxScale);
  return new CIMSymbol({
    data: {
      type: 'CIMSymbolReference',
      symbol: {
        type: 'CIMPointSymbol',
        symbolLayers: [
          {
            type: 'CIMPictureMarker',
            primitiveName: 'symbol-layer-1',
            enable: true,
            url: shipIcon,
            size: clampedSize,
            rotateClockwise: true,
            rotation: symbolRotation,
          },
        ],
      },
    },
  });
}

/**
 * Sets or updates the ship graphic on the map.
 * @param {__esri.GraphicsLayer} graphicsLayer - The graphics layer to add or update the ship graphic.
 * @param {Object} position - The ship's position.
 * @param {number} position.latitude - The ship's latitude.
 * @param {number} position.longitude - The ship's longitude.
 * @param {number} heading - The ship's heading in degrees.
 * @param {Function} project - The projection function from ArcGIS.
 * @param {MapCRS} mapCRS - The map's coordinate reference system.
 * @param {number} scale - The current map scale.
 */
export function setOrUpdateShipGraphic(
  graphicsLayer: __esri.GraphicsLayer,
  position: { latitude: number; longitude: number },
  heading: number,
  mapCRS: MapCRS,
  mapRotation: number,
  scale: number,
) {
  const shipGraphic = graphicsLayer.graphics.find(
    (g) => g.getAttribute(REF_ID_ATTRIBUTE) === SHIP_GRAPHIC_ID,
  );

  const shipSymbol = getShipSymbol(position, heading, mapCRS, scale, mapRotation);

  if (shipGraphic) {
    // Update existing ship graphic
    shipGraphic.geometry = new Point(position);
    shipGraphic.symbol = shipSymbol;
  } else {
    // Add new ship graphic
    graphicsLayer.graphics.add(
      new Graphic({
        attributes: {
          [REF_ID_ATTRIBUTE]: SHIP_GRAPHIC_ID,
        },
        geometry: new Point(position),
        symbol: shipSymbol,
      }),
    );
  }
}

const SHIP_BUFFER_GRAPHIC_ID_PREFIX = 'ship-buffer-graphic';

export function setOrUpdateShipBufferGraphics(
  featureLayer: __esri.FeatureLayer,
  position: { latitude: number; longitude: number },
  speed: number,
) {
  const timeIntervals = [12, 24, 36, 60, 180]; // in minutes

  const bufferGraphics = timeIntervals.map((minutes) => {
    const distance = (speed / 60) * minutes; // Convert speed to nm per minute and multiply by minutes
    const bufferPolygon = geometryEngine.geodesicBuffer(
      new Point(position),
      distance,
      'nautical-miles',
    ) as __esri.Polygon;

    const bufferPolyline = new Polyline({
      paths: [bufferPolygon.rings[0]!],
    });

    const label =
      minutes < 60
        ? `Distance After ${minutes} min`
        : `Distance After ${minutes / 60} hour${minutes > 60 ? 's' : ''}`;

    return new Graphic({
      attributes: {
        [REF_ID_ATTRIBUTE]: `${SHIP_BUFFER_GRAPHIC_ID_PREFIX}-${minutes}`,
        label: `${label} (${distance.toFixed(1)}nm)`,
        minutes: minutes,
      },
      geometry: bufferPolyline,
    });
  });

  featureLayer
    .queryFeatures({
      where: `${REF_ID_ATTRIBUTE} LIKE '${SHIP_BUFFER_GRAPHIC_ID_PREFIX}%'`,
    })
    .then((result) => {
      if (result.features.length > 0) {
        // Update existing buffer graphics
        const updateFeatures = bufferGraphics.map((newGraphic) => {
          const existingFeature = result.features.find(
            (f) => f.getAttribute(REF_ID_ATTRIBUTE) === newGraphic.getAttribute(REF_ID_ATTRIBUTE),
          );
          if (existingFeature) {
            existingFeature.geometry = newGraphic.geometry;
            existingFeature.attributes = {
              ObjectID: existingFeature.getObjectId(),
              ...existingFeature.attributes,
            };
            return existingFeature;
          }
          return newGraphic;
        });

        featureLayer.applyEdits({
          updateFeatures,
          addFeatures: updateFeatures.filter(
            (f) =>
              !result.features.some(
                (existingF) =>
                  existingF.getAttribute(REF_ID_ATTRIBUTE) === f.getAttribute(REF_ID_ATTRIBUTE),
              ),
          ),
        });
      } else {
        // Add new buffer graphics
        featureLayer.applyEdits({
          addFeatures: bufferGraphics,
        });
      }
    });
}
