import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

import { useGraphicsLayer } from './useLayer';
import { useArcState } from './useWatchEffect';

type ActiveSketchTools = SketchViewModel['activeTool'];
type CreationTools = Exclude<ActiveSketchTools, 'move' | 'transform' | 'reshape'>;
function isCreationTool(tool: ActiveSketchTools): tool is CreationTools {
  return tool !== 'move' && tool !== 'transform' && tool !== 'reshape';
}

export type DrawSingleGraphicOptions = {
  initialGraphic?: __esri.Graphic;
  onCreateGraphic?: (graphic: __esri.Graphic | undefined, sketchVM: SketchViewModel) => void;
  onUpdateGraphic?: (graphic: __esri.Graphic | undefined, sketchVM: SketchViewModel) => void;
  onDeleteGraphic?: (sketchVM: SketchViewModel) => void;
  sketchOptions?: __esri.SketchViewModelProperties;
  updateEnabled?: boolean;
};

export function useDrawSingleGraphic(
  mapView: __esri.MapView | __esri.SceneView,
  options?: DrawSingleGraphicOptions,
) {
  const { layer } = useGraphicsLayer(mapView, {
    listMode: 'hide',
  });

  const [geometry, setGeometry] = React.useState<__esri.Geometry | undefined>(undefined);

  const sketchVM = React.useMemo(() => {
    const updateEnabled = options?.updateEnabled ?? true;

    const defaultUpdateOptions: __esri.SketchViewModelProperties['defaultUpdateOptions'] = {
      ...(updateEnabled === false
        ? {
            enableRotation: false,
            enableScaling: false,
            enableZ: false,
            multipleSelectionEnabled: false,
            toggleToolOnClick: false,
          }
        : {}),
    };

    const newSketchVM = new SketchViewModel({
      view: mapView,
      layer,
      valueOptions: {
        displayUnits: {
          length: 'nautical-miles',
        },
      },
      tooltipOptions: {
        enabled: true,
        visibleElements: {
          area: false,
          coordinates: false,
          helpMessage: true,
          distance: false,
          direction: false,
        },
      },
      ...options?.sketchOptions,
      defaultCreateOptions: {
        mode: 'click',
        ...options?.sketchOptions?.defaultCreateOptions,
      },
      defaultUpdateOptions: {
        ...defaultUpdateOptions,
        ...options?.sketchOptions?.defaultUpdateOptions,
      },
    });
    newSketchVM.on('create', (event) => {
      if (event.state === 'complete') {
        layer.removeAll();
        layer.add(event.graphic);
        setGeometry(event.graphic.geometry);
        options?.onCreateGraphic?.(event.graphic, newSketchVM);
      }
    });

    newSketchVM.on('update', (event) => {
      if (!updateEnabled) {
        newSketchVM.cancel();
        return;
      }

      const graphic = event.graphics[0];
      if (graphic) {
        setGeometry(graphic.geometry);
        options?.onUpdateGraphic?.(graphic, newSketchVM);
      }
    });

    newSketchVM.on('delete', () => {
      setGeometry(undefined);
      options?.onDeleteGraphic?.(newSketchVM);
    });
    return newSketchVM;
  }, [mapView, layer, options]);

  const clearGeometry = React.useCallback(() => {
    if (isCreationTool(sketchVM.activeTool)) {
      console.log('cancel');
      sketchVM.cancel();
      return;
    }
    layer.removeAll();
    setGeometry(undefined);
  }, [sketchVM, layer]);

  const [activeDrawMode] = useArcState(sketchVM, 'activeTool');

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
