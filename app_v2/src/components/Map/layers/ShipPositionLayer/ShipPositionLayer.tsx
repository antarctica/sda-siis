import Color from '@arcgis/core/Color';
import { SimpleRenderer } from '@arcgis/core/renderers';
import { SimpleLineSymbol } from '@arcgis/core/symbols';
import React from 'react';

import { useShipPosition } from '@/api/useShipSensorData';
import { ArcFeatureLayer } from '@/arcgis/ArcLayer/generated/ArcFeatureLayer';
import { ArcGraphicsLayer } from '@/arcgis/ArcLayer/generated/ArcGraphicsLayer';
import { MapCRS } from '@/types';

import { useShipBufferGraphic } from './useShipBufferGraphic';
import { useShipLocationGraphic } from './useShipLocationGraphic';
import { REF_ID_ATTRIBUTE } from './utils';

function ShipPositionLayer() {
  const [graphicsLayer, setGraphicsLayer] = React.useState<__esri.GraphicsLayer>();
  const [featureLayer, setFeatureLayer] = React.useState<__esri.FeatureLayer>();
  const { latitude, longitude } = useShipPosition();
  useShipLocationGraphic(
    graphicsLayer,
    latitude && longitude ? { latitude, longitude } : null,
    MapCRS.ANTARCTIC,
  );
  useShipBufferGraphic(featureLayer, latitude && longitude ? { latitude, longitude } : null);

  if (!latitude || !longitude) return null;

  return (
    <>
      <ArcGraphicsLayer
        id="graphics-layer"
        eventHandlers={{
          'layerview-create': (ev) => {
            setGraphicsLayer(ev.layerView.layer as __esri.GraphicsLayer);
          },
        }}
      />
      <ArcFeatureLayer
        eventHandlers={{
          'layerview-create': (ev) => {
            setFeatureLayer(ev.layerView.layer as __esri.FeatureLayer);
          },
        }}
        source={[]}
        id="feature-layers"
        title="buffer"
        fields={[
          {
            name: 'ObjectID',
            alias: 'ObjectID',
            type: 'oid',
          },
          {
            name: REF_ID_ATTRIBUTE,
            alias: REF_ID_ATTRIBUTE,
            type: 'string',
          },
          {
            name: 'label',
            alias: 'label',
            type: 'string',
          },
          {
            name: 'minutes',
            alias: 'minutes',
            type: 'double',
          },
        ]}
        objectIdField="ObjectID"
        geometryType="polyline"
        spatialReference={{
          wkid: 3031,
        }}
        renderer={
          new SimpleRenderer({
            symbol: new SimpleLineSymbol({
              color: new Color([255, 0, 0, 0.8]),
              style: 'dash',
              width: 1,
            }),
          })
        }
        minScale={1000000}
        labelingInfo={[
          {
            symbol: {
              type: 'text',
              color: new Color([255, 0, 0, 1]),

              font: {
                family: 'Ubuntu Mono',
                size: 8,
              },

              yoffset: 2,
            },

            repeatLabel: false,
            deconflictionStrategy: 'none',
            where: 'minutes >= 60',
            labelExpressionInfo: {
              expression: 'return $feature.label',
            },
            maxScale: 0,
            minScale: 0,
          },
          {
            symbol: {
              type: 'text',
              color: new Color([255, 0, 0, 1]),

              font: {
                family: 'Ubuntu Mono',
                size: 8,
                weight: 'normal',
              },
              yoffset: 2,
            },
            deconflictionStrategy: 'none',

            repeatLabel: false,
            where: 'minutes < 60',
            labelExpressionInfo: {
              expression: 'return $feature.label',
            },
            maxScale: 0,
            minScale: 400000,
          },
        ]}
      />
    </>
  );
}

export default ShipPositionLayer;
