import WMSLayer from '@arcgis/core/layers/WMSLayer';
import React from 'react';

import { useTheme } from '@/contexts/Theme/useTheme';
import { LayerManagerContext } from '@/features/mapLayers/components/LayerManager/LayerManagerProvider';

import { convertThemeToStyle } from '../utils';

export function SynchroniseLayerTheme() {
  const theme = useTheme();
  const layerManager = LayerManagerContext.useActorRef();

  React.useEffect(() => {
    const layers = layerManager.getSnapshot().context.layers;
    for (const layer of layers) {
      const layerData = layer.layerData;
      if (layerData?.mapLayer instanceof WMSLayer) {
        layerData.mapLayer.set('customLayerParameters', {
          ...layerData.mapLayer.customLayerParameters,
          STYLES: `${layerData.params?.style}.${convertThemeToStyle(theme.currentTheme)}`,
        });
      }
    }
  }, [theme, layerManager]);

  return null;
}
