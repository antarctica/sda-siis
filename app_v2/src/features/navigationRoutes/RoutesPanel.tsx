import { SimpleLineSymbol } from '@arcgis/core/symbols';
import React from 'react';

import WorkflowStepper from '@/components/WorkflowStepper/WorkflowStepper';
import { ROUTE_GRAPHIC_UNIQUE_ID } from '@/config/constants';
import { ROUTE_STYLE } from '@/config/styles';
import { useMapInteractionLayers } from '@/contexts/MapInteractionLayers';
import { useSIISMapView } from '@/hooks/useSIISMapView';

import {
  DrawSingleGraphicOptions,
  useDrawSingleGraphic,
} from '../arcgis/hooks/useDrawSingleGraphic';
import { useLayerView } from '../arcgis/hooks/useLayerView';
import { RouteDetailsStep } from './components/WorkFlowSteps/RouteDetailsStep';
import { SelectRouteStep } from './components/WorkFlowSteps/SelectRouteStep';
import { RouteGraphic } from './utils';

function RoutesPanel() {
  const siisMapView = useSIISMapView();

  if (!siisMapView) return null;

  return (
    <WorkflowStepper
      style={
        { '--workflow-item-spacing': '2rem', '--bullet-size': '1.4rem' } as React.CSSProperties
      }
    >
      <WorkFlowSteps mapView={siisMapView} />
    </WorkflowStepper>
  );
}

function WorkFlowSteps({ mapView }: { mapView: __esri.MapView }) {
  const { routesLayer, shipPositionLayer } = useMapInteractionLayers();
  useLayerView(mapView, routesLayer, false);
  const options: DrawSingleGraphicOptions = React.useMemo(
    () => ({
      sketchOptions: {
        updateOnGraphicClick: false,
        polylineSymbol: new SimpleLineSymbol(ROUTE_STYLE),
        snappingOptions: {
          enabled: true,
          selfEnabled: false,
          featureSources: [
            {
              layer: shipPositionLayer,
              enabled: true,
            },
          ],
        },
        tooltipOptions: {
          enabled: true,
          visibleElements: {
            area: false,
            coordinates: false,
            helpMessage: true,
            distance: false,
            direction: false,
            totalLength: false,
          },
        },
      },
      onCreateGraphic: (graphic) => {
        if (graphic) {
          (graphic as RouteGraphic).attributes.route_name = 'Route';
        }
      },
    }),
    [shipPositionLayer],
  );
  const { create, activeDrawMode, clearGraphic, graphic, setGraphic, controlledUpdate } =
    useDrawSingleGraphic(mapView, ROUTE_GRAPHIC_UNIQUE_ID, routesLayer, options);

  return (
    <>
      <SelectRouteStep
        setGraphic={setGraphic}
        itemState={!!graphic ? 'completed' : 'active'}
        create={create}
        activeDrawMode={activeDrawMode}
        mapView={mapView}
      />
      <RouteDetailsStep
        routeGraphic={graphic as RouteGraphic | undefined}
        siisMapView={mapView}
        setGraphic={setGraphic}
        clearGraphic={clearGraphic}
        controlledUpdate={controlledUpdate}
      />
    </>
  );
}

export default RoutesPanel;
