import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import React from 'react';

export function useGraphicsLayer(
  mapView: __esri.View | undefined,
  layerProps: __esri.GraphicsLayerProperties,
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layer = React.useMemo(() => new GraphicsLayer({ listMode: 'hide', ...layerProps }), []);

  const [layerView, setLayerView] = React.useState<__esri.LayerView | undefined>(undefined);

  React.useEffect(() => {
    if (!mapView) return;
    layer.on('layerview-create', (event) => {
      setLayerView(event.layerView);
    });
    mapView.map.add(layer);
    return () => {
      mapView.map.remove(layer);
    };
  }, [mapView, layer]);

  return { layer, layerView };
}
