import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

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

  const graphicRef = React.useRef<__esri.Graphic | undefined>();

  const [geometry, setGeometry] = React.useState<__esri.Geometry | undefined>(undefined);

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
        graphicRef.current = event.graphic;
        setGeometry(event.graphic.geometry);
        options?.onCreateGraphic?.(event.graphic);
      }
    });

    newSketchVM.on('update', (event) => {
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
  }, [mapView, managedGraphicsLayer, options, graphicId]);

  const clearGeometry = React.useCallback(() => {
    if (isCreationTool(sketchVM.activeTool)) {
      sketchVM.cancel();
      return;
    }
    const existingGraphic = managedGraphicsLayer.graphics.find(
      (g) => g.getAttribute('graphicId') === graphicId,
    );
    if (existingGraphic) {
      managedGraphicsLayer.remove(existingGraphic);
    }
    graphicRef.current = undefined;
    setGeometry(undefined);
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
    graphicRef.current = managedGraphicsLayer.graphics.find(
      (g) => g.getAttribute('graphicId') === graphicId,
    );
    setGeometry(graphicRef.current?.geometry);
    options?.onCreateGraphic?.(graphicRef.current);
  }, [managedGraphicsLayer, graphicId, options]);

  return { graphic: graphicRef.current, geometry, clearGeometry, create, activeDrawMode };
}
