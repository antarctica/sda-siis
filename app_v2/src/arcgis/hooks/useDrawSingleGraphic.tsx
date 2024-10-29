import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

import { useGraphicsLayer } from './useLayer';
import { useWatchState } from './useWatchEffect';

type ActiveSketchTools = SketchViewModel['activeTool'];
type CreationTools = Exclude<ActiveSketchTools, 'move' | 'transform' | 'reshape'>;
function isCreationTool(tool: ActiveSketchTools): tool is CreationTools {
  return tool !== 'move' && tool !== 'transform' && tool !== 'reshape';
}

export function useDrawSingleGraphic(mapView: __esri.MapView | __esri.SceneView) {
  const { layer } = useGraphicsLayer(mapView, {
    listMode: 'hide',
  });

  const [geometry, setGeometry] = React.useState<__esri.Geometry | undefined>(undefined);

  const sketchVM = React.useMemo(() => {
    const newSketchVM = new SketchViewModel({
      view: mapView,
      layer,
      defaultCreateOptions: {
        mode: 'click',
      },
      tooltipOptions: {
        enabled: true,
        visibleElements: {
          helpMessage: true,
          coordinates: false,
          distance: false,
          direction: false,
        },
      },
    });
    newSketchVM.on('create', (event) => {
      if (event.state === 'complete') {
        layer.removeAll();
        layer.add(event.graphic);
        setGeometry(event.graphic.geometry);
      }
    });

    newSketchVM.on('update', (event) => {
      const graphic = event.graphics[0];
      if (graphic) {
        setGeometry(graphic.geometry);
      }
    });

    newSketchVM.on('delete', () => {
      setGeometry(undefined);
    });
    return newSketchVM;
  }, [mapView, layer]);

  const clearGeometry = React.useCallback(() => {
    if (isCreationTool(sketchVM.activeTool)) {
      console.log('cancel');
      sketchVM.cancel();
      return;
    }
    layer.removeAll();
    setGeometry(undefined);
  }, [sketchVM, layer]);

  const activeDrawMode = useWatchState(() => sketchVM.activeTool);

  const create = React.useMemo(() => {
    return (...args: Parameters<SketchViewModel['create']>) => {
      if (args[0] === activeDrawMode) {
        sketchVM.cancel();
        return;
      }
      sketchVM.create(...args);
    };
  }, [sketchVM, activeDrawMode]);

  return { geometry, clearGeometry, create, activeDrawMode };
}
