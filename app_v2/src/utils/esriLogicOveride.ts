import LegendVM from '@arcgis/core/widgets/Legend/LegendViewModel.js';

/**
 * This code extends ArcGIS LegendViewModel to support custom imagery footprint layers in the legend.
 * It preserves the original behavior for standard layers while adding support for our custom layer type.
 */

const originalIsLayerViewSupported = (
  LegendVM.prototype as unknown as {
    _isLayerViewSupported: (layerView: __esri.LayerView) => boolean;
  }
)._isLayerViewSupported;

(
  LegendVM.prototype as unknown as {
    _isLayerViewSupported: (layerView: __esri.LayerView) => boolean;
  }
)._isLayerViewSupported = function (layerView: __esri.LayerView) {
  const CUSTOM_LAYER_TYPE = 'custom.ImageryFootprintLayer';

  if (layerView.layer.declaredClass === CUSTOM_LAYER_TYPE) {
    return true;
  }

  return originalIsLayerViewSupported.call(this, layerView);
};

// Log to confirm the override
console.debug('Overridden LegendViewModel layer validation to support custom layers');
