import { SimpleLineSymbol } from '@arcgis/core/symbols';
import React from 'react';

import { ROUTE_GRAPHIC_UNIQUE_ID } from '@/config/constants';
import { ROUTE_STYLE } from '@/config/styles';
import {
  DrawSingleGraphicOptions,
  useDrawSingleGraphic,
} from '@/features/arcgis/hooks/useDrawSingleGraphic';

import { ToggleButton } from '../../../components/common/Button';

export function CreateRouteButton({
  graphicsLayer,
  mapView,
  setRouteGeometry,
  setRouteName,
}: {
  graphicsLayer: __esri.GraphicsLayer;
  mapView: __esri.MapView;
  setRouteGeometry: (geometry: __esri.Polyline) => void;
  setRouteName: (name: string) => void;
}) {
  const options: DrawSingleGraphicOptions = React.useMemo(
    () => ({
      sketchOptions: {
        updateOnGraphicClick: false,
        polylineSymbol: new SimpleLineSymbol(ROUTE_STYLE),
      },
      onCreateGraphic: (graphic) => {
        if (graphic) {
          setRouteGeometry(graphic.geometry as __esri.Polyline);
          setRouteName('SIIS Route');
        }
      },
    }),
    [setRouteGeometry, setRouteName],
  );
  const { create, activeDrawMode } = useDrawSingleGraphic(
    mapView,
    ROUTE_GRAPHIC_UNIQUE_ID,
    graphicsLayer,
    options,
  );

  return (
    <ToggleButton onPress={() => create('polyline')} isSelected={activeDrawMode === 'polyline'}>
      Create Route
    </ToggleButton>
  );
}
