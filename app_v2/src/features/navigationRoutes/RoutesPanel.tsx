import * as geodeticLengthOperator from '@arcgis/core/geometry/operators/geodeticLengthOperator';
import { css } from '@styled-system/css';
import { Box, Flex, Stack } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import React from 'react';

import Typography, { Heading } from '@/components/common/Typography';
import { MapGraphicPolylinePreviewSVG } from '@/components/PolylinePreviewSVG';
import { useMapInteractionLayers } from '@/contexts/MapInteractionLayers';
import { useSIISMapView } from '@/hooks/useSIISMapView';
import { selectDefaultMeasurementUnit } from '@/store/features/appSlice';
import { useAppSelector } from '@/store/hooks';

import { getDisplayUnit } from '../arcgis/hooks/measurements/utils';
import { useLayerView } from '../arcgis/hooks/useLayerView';
import { CreateRouteButton } from './components/CreateRouteButton';
import { ImportRouteButton } from './components/ImportRouteButton';

function RoutesPanel() {
  const { routesLayer } = useMapInteractionLayers();
  const siisMapView = useSIISMapView();
  const [geometry, setGeometry] = React.useState<__esri.Polyline | undefined>(undefined);
  const [routeName, setRouteName] = React.useState<string | undefined>(undefined);
  if (!siisMapView) return null;

  return (
    <Stack gap="4">
      <SelectRouteStep
        siisMapView={siisMapView}
        routesLayer={routesLayer}
        setGeometry={setGeometry}
        setRouteName={setRouteName}
      />
      {geometry && routeName !== undefined && (
        <RouteDetailsStep siisMapView={siisMapView} geometry={geometry} routeName={routeName} />
      )}
    </Stack>
  );
}

function RouteDetailsStep({
  geometry,
  routeName,
  siisMapView,
}: {
  geometry: __esri.Polyline;
  routeName: string;
  siisMapView: __esri.MapView;
}) {
  const defaultMeasurementUnit = useAppSelector(selectDefaultMeasurementUnit);
  const length = geodeticLengthOperator.execute(geometry, {
    unit: defaultMeasurementUnit,
  });

  const polylinePreviewOptions = React.useMemo(() => {
    return {
      size: 48,
      padding: 6,
      bgColor: token('colors.bg.surface'),
      lineColor: token('colors.fg.accent'),
    };
  }, []);

  return (
    <Stack gap="2">
      <Box w="full" mb="2">
        <Heading bold as="h3" heading="body" margin={false}>
          Route Details
        </Heading>
        <Typography className={css({ textStyle: 'description' })}>
          View the details of the route.
        </Typography>
      </Box>
      <Box>
        <Flex direction="row" gap="2">
          <MapGraphicPolylinePreviewSVG
            mapView={siisMapView}
            polyline={geometry}
            options={polylinePreviewOptions}
          />
          <Box flexGrow={1}>
            <Heading bold as="h3" heading="body" margin={false}>
              {routeName}
            </Heading>
            <Typography
              className={css({ textStyle: 'description' })}
            >{`${length.toFixed(2)} ${getDisplayUnit(defaultMeasurementUnit)}`}</Typography>
          </Box>
        </Flex>
      </Box>
    </Stack>
  );
}

function SelectRouteStep({
  siisMapView,
  routesLayer,
  setGeometry,
  setRouteName,
}: {
  siisMapView: __esri.MapView;
  routesLayer: __esri.GraphicsLayer;
  setGeometry: React.Dispatch<React.SetStateAction<__esri.Polyline | undefined>>;
  setRouteName: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  useLayerView(siisMapView, routesLayer, false);
  return (
    <Stack gap="2">
      <Box w="full" mb="2">
        <Heading bold as="h3" heading="body" margin={false}>
          Add a route
        </Heading>
        <Typography className={css({ textStyle: 'description' })}>
          Import an existing .rtzp file or draw a route on the map.
        </Typography>
      </Box>
      <ImportRouteButton
        graphicsLayer={routesLayer}
        setGeometry={setGeometry}
        setRouteName={setRouteName}
      />
      <Box w="full" px="4">
        <Typography textPosition="middle">OR</Typography>
      </Box>
      <CreateRouteButton
        mapView={siisMapView}
        graphicsLayer={routesLayer}
        setRouteGeometry={setGeometry}
        setRouteName={setRouteName}
      />
    </Stack>
  );
}

export default RoutesPanel;
