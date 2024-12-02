import Color from '@arcgis/core/Color';
import { SimpleRenderer } from '@arcgis/core/renderers';
import { SimpleLineSymbol } from '@arcgis/core/symbols';
import React from 'react';

import { ArcFeatureLayer } from '@/arcgis/ArcLayer/generated/ArcFeatureLayer';
import { useCurrentMapView } from '@/arcgis/hooks';
import { CRS_LOOKUP } from '@/config/constants';
import { selectShowDistanceCircles } from '@/store/features/shipSlice';
import { useAppSelector } from '@/store/hooks';
import { MapCRS } from '@/types';

import { REF_ID_ATTRIBUTE, setOrUpdateShipBufferGraphics } from './utils';

export function ShipBufferGraphic({
  position,
  speed,
  crs,
}: {
  position: { latitude: number; longitude: number } | null;
  speed: number | null;
  crs: MapCRS;
}) {
  const [featureLayer, setFeatureLayer] = React.useState<__esri.FeatureLayer | undefined>(
    undefined,
  );
  const currentMapView = useCurrentMapView();
  const showDistanceCircles = useAppSelector(selectShowDistanceCircles);

  React.useEffect(() => {
    if (!featureLayer || !position || !currentMapView) return;
    setOrUpdateShipBufferGraphics(featureLayer, position, speed ?? 0);
  }, [featureLayer, position, speed, currentMapView]);

  return (
    <ArcFeatureLayer
      visible={showDistanceCircles}
      eventHandlers={{
        'layerview-create': (ev) => {
          setFeatureLayer(ev.layerView.layer as __esri.FeatureLayer);
        },
      }}
      source={[]}
      id="feature-layers"
      title="Ship Position Distance Rings"
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
        wkid: CRS_LOOKUP[crs].wkid,
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
  );
}
