import React from 'react';

export function useFeatureLayerInMap(mapView: __esri.MapView, featureLayer: __esri.FeatureLayer) {
  const [featureLayerView, setFeatureLayerView] = React.useState<__esri.FeatureLayerView | null>(
    null,
  );

  React.useEffect(() => {
    let isMounted = true;

    const getLayerView = async () => {
      try {
        const layerView = await mapView.whenLayerView(featureLayer);
        if (isMounted) {
          setFeatureLayerView(layerView);
        }
      } catch (error) {
        console.error('Error getting layer view:', error);
        if (isMounted) {
          setFeatureLayerView(null);
        }
      }
    };

    getLayerView();

    return () => {
      isMounted = false;
    };
  }, [mapView, featureLayer]);

  return featureLayerView;
}
