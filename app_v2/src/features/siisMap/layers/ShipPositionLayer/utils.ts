import { Point, Polyline } from '@arcgis/core/geometry';
import * as geodesicBufferOperator from '@arcgis/core/geometry/operators/geodesicBufferOperator.js';
import Polygon from '@arcgis/core/geometry/Polygon';
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
export function setOrUpdateShipPositionGraphic(
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

  const shipSymbol = getShipSymbol(position, heading, mapCRS, scale, mapRotation, 42, 14);

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

/**
 * Deletes buffer graphics when speed is zero.
 */
async function deleteBufferGraphics(featureLayer: __esri.FeatureLayer): Promise<void> {
  const result = await featureLayer.queryFeatures({
    where: `${REF_ID_ATTRIBUTE} LIKE '${SHIP_BUFFER_GRAPHIC_ID_PREFIX}%'`,
  });
  await featureLayer.applyEdits({ deleteFeatures: result.features });
}

/**
 * Deletes duplicate buffer graphics.
 */
async function deleteDuplicateBufferGraphics(featureLayer: __esri.FeatureLayer): Promise<void> {
  const result = await featureLayer.queryFeatures({
    where: `${REF_ID_ATTRIBUTE} LIKE '${SHIP_BUFFER_GRAPHIC_ID_PREFIX}%'`,
  });

  const groupedFeatures = result.features.reduce(
    (acc, feature) => {
      const refId = feature.getAttribute(REF_ID_ATTRIBUTE);
      if (!acc[refId]) {
        acc[refId] = [];
      }
      acc[refId].push(feature);
      return acc;
    },
    {} as Record<string, __esri.Graphic[]>,
  );

  const featuresToDelete = Object.values(groupedFeatures)
    .filter((group) => group.length > 1)
    .flatMap((group) => group.slice(1));

  if (featuresToDelete.length > 0) {
    await featureLayer.applyEdits({ deleteFeatures: featuresToDelete });
  }
}

/**
 * Creates buffer graphics based on speed and time intervals.
 */
function createBufferGraphics(
  position: { latitude: number; longitude: number },
  speed: number,
): Graphic[] {
  const timeIntervals = [12, 24, 36, 60, 180];
  return timeIntervals
    .map((minutes) => {
      const distance = (speed / 60) * minutes;
      const bufferPolygon = geodesicBufferOperator.execute(new Point(position), distance, {
        unit: 'nautical-miles',
      });

      if (!bufferPolygon || !(bufferPolygon instanceof Polygon)) return null;

      const [rings] = bufferPolygon.rings;
      if (!rings) return null;

      const boundaryPolyline = new Polyline({
        paths: [rings],
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
        geometry: boundaryPolyline,
      });
    })
    .filter((g) => g !== null) as Graphic[];
}

/**
 * Updates or adds buffer graphics to the feature layer.
 */
async function updateOrAddBufferGraphics(
  featureLayer: __esri.FeatureLayer,
  bufferGraphics: Graphic[],
): Promise<void> {
  const result = await featureLayer.queryFeatures({
    where: `${REF_ID_ATTRIBUTE} LIKE '${SHIP_BUFFER_GRAPHIC_ID_PREFIX}%'`,
  });

  const updateFeatures = bufferGraphics.map((newGraphic) => {
    const existingFeature = result.features.find(
      (f) => f.getAttribute(REF_ID_ATTRIBUTE) === newGraphic.getAttribute(REF_ID_ATTRIBUTE),
    );
    if (existingFeature) {
      existingFeature.geometry = newGraphic.geometry;
      existingFeature.attributes = {
        ObjectID: existingFeature.getObjectId(),
        ...newGraphic.attributes,
      };
      return existingFeature;
    }
    return newGraphic;
  });

  await featureLayer.applyEdits({
    updateFeatures: updateFeatures.filter((f) =>
      result.features.some(
        (existingF) =>
          existingF.getAttribute(REF_ID_ATTRIBUTE) === f.getAttribute(REF_ID_ATTRIBUTE),
      ),
    ),
    addFeatures: updateFeatures.filter(
      (f) =>
        !result.features.some(
          (existingF) =>
            existingF.getAttribute(REF_ID_ATTRIBUTE) === f.getAttribute(REF_ID_ATTRIBUTE),
        ),
    ),
  });
}

/**
 * Sets or updates the ship buffer graphics on the map.
 */
export async function setOrUpdateShipBufferGraphics(
  featureLayer: __esri.FeatureLayer,
  position: { latitude: number; longitude: number },
  speed: number,
): Promise<void> {
  if (speed === 0) {
    await deleteBufferGraphics(featureLayer);
    return;
  }

  await deleteDuplicateBufferGraphics(featureLayer);

  const bufferGraphics = createBufferGraphics(position, speed);
  await updateOrAddBufferGraphics(featureLayer, bufferGraphics);
}
