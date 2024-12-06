import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

import { useArcState } from './useWatchEffect';

type ActiveSketchTools = SketchViewModel['activeTool'];
type CreationTools = Exclude<ActiveSketchTools, 'move' | 'transform' | 'reshape'>;
function isCreationTool(tool: ActiveSketchTools): tool is CreationTools {
  return ['point', 'multipoint', 'polyline', 'polygon', 'circle', 'mesh', 'rectangle'].includes(
    tool,
  );
}

export type ControlledUpdate = {
  start: (
    graphic: __esri.Graphic,
    options?: __esri.SketchViewModelUpdateUpdateOptions,
  ) => Promise<void>;
  stop: () => void;
  cancel: () => void;
};

export type DrawSingleGraphicOptions = {
  initialGraphic?: __esri.Graphic;
  onCreateGraphic?: (graphic: __esri.Graphic | undefined) => void;
  onUpdateGraphic?: (graphic: __esri.Graphic | undefined) => void;
  onDeleteGraphic?: () => void;
  sketchOptions?: __esri.SketchViewModelProperties;
};

export function useDrawSingleGraphic(
  mapView: __esri.MapView | __esri.SceneView,
  graphicId: string,
  graphicsLayer?: __esri.GraphicsLayer,
  options?: DrawSingleGraphicOptions,
) {
  const managedGraphicsLayer = React.useMemo(() => {
    if (graphicsLayer) {
      return graphicsLayer;
    } else {
      const newGraphicsLayer = new GraphicsLayer({ listMode: 'hide' });
      mapView.map.add(newGraphicsLayer);
      return newGraphicsLayer;
    }
  }, [mapView.map, graphicsLayer]);

  const [graphic, setGraphic] = React.useState<__esri.Graphic | undefined>(undefined);
  const isControlledUpdate = React.useRef(false);
  const initialGeometry = React.useRef<__esri.Geometry | undefined>(undefined);

  const sketchVM = React.useMemo(() => {
    const newSketchVM = new SketchViewModel({
      view: mapView,
      layer: managedGraphicsLayer,
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
      defaultCreateOptions: {
        mode: 'click',
      },
      ...options?.sketchOptions,
    });
    newSketchVM.on('create', (event) => {
      if (event.state === 'complete') {
        event.graphic.setAttribute('graphicId', graphicId);

        const existingGraphic = managedGraphicsLayer.graphics.find(
          (g) => g.getAttribute('graphicId') === graphicId,
        );
        if (existingGraphic) {
          managedGraphicsLayer.remove(existingGraphic);
        }

        managedGraphicsLayer.add(event.graphic);
        setGraphic(event.graphic);
        options?.onCreateGraphic?.(event.graphic);
      }
    });

    newSketchVM.on('update', (event) => {
      const graphic = event.graphics[0];
      if (graphic) {
        options?.onUpdateGraphic?.(graphic);
        if (event.state === 'complete') {
          if (isControlledUpdate.current) {
            sketchVM.update(graphic, { tool: event.tool });
          }
        }
      }
    });

    newSketchVM.on('delete', () => {
      setGraphic(undefined);
      options?.onDeleteGraphic?.();
    });
    return newSketchVM;
  }, [mapView, managedGraphicsLayer, options, graphicId, isControlledUpdate]);

  const clearGraphic = React.useMemo(() => {
    return () => {
      if (isCreationTool(sketchVM.activeTool)) {
        sketchVM.cancel();
        return;
      }
      const existingGraphic = managedGraphicsLayer.graphics.find(
        (g) => g.getAttribute('graphicId') === graphicId,
      );
      if (existingGraphic) {
        sketchVM.update(existingGraphic).then(() => {
          sketchVM.delete();
        });
      }
    };
  }, [sketchVM, managedGraphicsLayer, graphicId]);

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

  React.useEffect(() => {
    //when graphicslayer changes try to find the graphic with the graphicId
    const graphic = managedGraphicsLayer.graphics.find(
      (g) => g.getAttribute('graphicId') === graphicId,
    );
    setGraphic(graphic);
    options?.onCreateGraphic?.(graphic);
  }, [managedGraphicsLayer, graphicId, options]);

  const controlledUpdate: ControlledUpdate = React.useMemo(() => {
    return {
      start: async (
        graphic: __esri.Graphic,
        options?: __esri.SketchViewModelUpdateUpdateOptions,
      ) => {
        isControlledUpdate.current = true;
        initialGeometry.current = graphic.geometry.clone();
        await sketchVM.update(graphic, options);
      },
      stop: () => {
        isControlledUpdate.current = false;
        sketchVM.complete();
      },
      cancel: () => {
        const updatingGraphic = sketchVM.updateGraphics.getItemAt(0);
        if (updatingGraphic && initialGeometry.current) {
          updatingGraphic.geometry = initialGeometry.current;
        }
        isControlledUpdate.current = false;
        sketchVM.complete();
        initialGeometry.current = undefined;
      },
    };
  }, [sketchVM]);

  const complete = React.useMemo(
    () => () => {
      sketchVM.complete();
    },
    [sketchVM],
  );

  const setGraphicMethod = React.useCallback(
    (graphic: __esri.Graphic | undefined) => {
      if (activeDrawMode) {
        sketchVM.cancel();
      }
      if (graphic === undefined) {
        clearGraphic();
      } else {
        managedGraphicsLayer.removeAll();
        managedGraphicsLayer.add(graphic);
        setGraphic(graphic);
      }
    },
    [activeDrawMode, clearGraphic, managedGraphicsLayer, sketchVM],
  );

  return {
    graphic,
    setGraphic: setGraphicMethod,
    clearGraphic,
    create,
    activeDrawMode,
    controlledUpdate,
    complete,
  };
}
