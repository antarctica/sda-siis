import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import React from 'react';

export function useGraphicsLayer(
  mapView: __esri.View | undefined,
  layerInput: GraphicsLayer | __esri.GraphicsLayerProperties,
  removeLayerOnUnmount?: boolean,
) {
  const layer = React.useMemo(() => {
    if (layerInput instanceof GraphicsLayer) {
      return layerInput;
    }
    return new GraphicsLayer({ listMode: 'hide', ...layerInput });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [layerView, setLayerView] = React.useState<__esri.LayerView | undefined>(undefined);

  React.useEffect(() => {
    if (!mapView) return;

    // Only add the layer if it's not already in the map
    const isLayerInMap = mapView.map.layers.includes(layer);

    if (!isLayerInMap) {
      layer.on('layerview-create', (event) => {
        setLayerView(event.layerView);
      });
      mapView.map.add(layer);
    }

    return () => {
      // Only remove the layer if we added it
      if (!isLayerInMap) {
        mapView.map.remove(layer);
      }
    };
  }, [mapView, layer, removeLayerOnUnmount]);

  return { layer, layerView };
}
