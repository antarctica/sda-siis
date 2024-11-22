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
  onCreateGraphic?: (graphic: __esri.Graphic | undefined) => void;
  onUpdateGraphic?: (graphic: __esri.Graphic | undefined) => void;
  onDeleteGraphic?: () => void;
  sketchOptions?: __esri.SketchViewModelProperties;
  updateEnabled?: boolean;
  graphicsLayer?: __esri.GraphicsLayer;
};

export function useDrawSingleGraphic(
  mapView: __esri.MapView | __esri.SceneView,
  graphicId: string,
  options?: DrawSingleGraphicOptions,
) {
  const { layer: graphicsLayer } = useGraphicsLayer(
    mapView,
    options?.graphicsLayer ?? {
      listMode: 'hide',
    },
  );
  const graphicRef = React.useRef<__esri.Graphic | undefined>();

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
      layer: graphicsLayer,
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
        event.graphic.setAttribute('graphicId', graphicId);

        const existingGraphic = graphicsLayer.graphics.find(
          (g) => g.getAttribute('graphicId') === graphicId,
        );
        if (existingGraphic) {
          graphicsLayer.remove(existingGraphic);
        }

        graphicsLayer.add(event.graphic);
        graphicRef.current = event.graphic;
        setGeometry(event.graphic.geometry);
        options?.onCreateGraphic?.(event.graphic);
      }
    });

    newSketchVM.on('update', (event) => {
      if (!updateEnabled) {
        newSketchVM.cancel();
        return;
      }

      const graphic = event.graphics[0];
      if (graphic) {
        graphicRef.current = graphic;
        setGeometry(graphic.geometry);
        options?.onUpdateGraphic?.(graphic);
      }
    });

    newSketchVM.on('delete', () => {
      graphicRef.current = undefined;
      setGeometry(undefined);
      options?.onDeleteGraphic?.();
    });
    return newSketchVM;
  }, [mapView, graphicsLayer, options, graphicId]);

  const clearGeometry = React.useCallback(() => {
    if (isCreationTool(sketchVM.activeTool)) {
      sketchVM.cancel();
      return;
    }
    const existingGraphic = graphicsLayer.graphics.find(
      (g) => g.getAttribute('graphicId') === graphicId,
    );
    if (existingGraphic) {
      graphicsLayer.remove(existingGraphic);
    }
    graphicRef.current = undefined;
    setGeometry(undefined);
  }, [sketchVM, graphicsLayer, graphicId]);

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
    graphicRef.current = graphicsLayer.graphics.find(
      (g) => g.getAttribute('graphicId') === graphicId,
    );
    setGeometry(graphicRef.current?.geometry);
    options?.onCreateGraphic?.(graphicRef.current);
  }, [graphicsLayer, graphicId, options]);

  return { graphic: graphicRef.current, geometry, clearGeometry, create, activeDrawMode };
}
