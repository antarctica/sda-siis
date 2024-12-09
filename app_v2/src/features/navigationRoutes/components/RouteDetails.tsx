import { css } from '@styled-system/css';
import { Box, Flex, Stack } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import React from 'react';
import { Form } from 'react-aria-components';

import { Button, IconButton } from '@/components/common/Button';
import TextField from '@/components/common/forms/TextField';
import SvgIcon from '@/components/common/SvgIcon';
import { Text, Title } from '@/components/common/Typography';
import { MapGraphicPolylinePreviewSVG } from '@/components/PolylinePreviewSVG';
import { MeasurementUnit } from '@/features/arcgis/hooks/measurements/types';
import { useGraphicGeodesicLength } from '@/features/arcgis/hooks/measurements/useGraphicGeodesicLength';
import { getDisplayUnit } from '@/features/arcgis/hooks/measurements/utils';
import { ControlledUpdate } from '@/features/arcgis/hooks/useDrawSingleGraphic';
import { selectDefaultMeasurementUnit } from '@/store/features/appSlice';
import { useAppSelector } from '@/store/hooks';

import { useRouteExport } from '../hooks/useRouteExport';
import { RouteGraphic } from '../utils';
import { RouteAction, RouteActionsMenu } from './RouteActionsMenu';

interface RouteDetailsStaticProps {
  routeGraphic: RouteGraphic;
  siisMapView: __esri.MapView;
  polylinePreviewOptions: Record<string, unknown>;
  defaultMeasurementUnit: MeasurementUnit;
  length: number;
  onRouteAction: (action: RouteAction) => void;
}

function RouteDetailsStatic({
  routeGraphic,
  siisMapView,
  polylinePreviewOptions,
  defaultMeasurementUnit,
  length,
  onRouteAction,
}: RouteDetailsStaticProps) {
  return (
    <Flex direction="row" gap="2" align="center">
      <Box>
        <MapGraphicPolylinePreviewSVG
          mapView={siisMapView}
          graphic={routeGraphic}
          options={polylinePreviewOptions}
        />
      </Box>
      <Box flexGrow={1}>
        <Title bold as="h3" size="body" margin={false}>
          {hyphensToSpaces(routeGraphic.attributes.route_name)}{' '}
        </Title>
        <Text className={css({ textStyle: 'description' })}>
          Total length:{' '}
          <span className={css({ whiteSpace: 'nowrap' })}>
            {`${length.toFixed(2)} ${getDisplayUnit(defaultMeasurementUnit)}`}
          </span>
        </Text>
      </Box>
      <IconButton
        size="md"
        variant="outline"
        icon={<SvgIcon name="icon-zoom-to" size={16} />}
        aria-label="Zoom to route"
        onPress={() => siisMapView.goTo(routeGraphic.geometry)}
      ></IconButton>
      <RouteActionsMenu handleRouteAction={onRouteAction} />
    </Flex>
  );
}

interface RouteDetailsEditingProps {
  routeGraphic: RouteGraphic;
  siisMapView: __esri.MapView;
  polylinePreviewOptions: Record<string, unknown>;
  defaultMeasurementUnit: MeasurementUnit;
  length: number;
  onSave: (routeName: string) => void;
  onCancel: () => void;
}

function RouteDetailsEditing({
  routeGraphic,
  siisMapView,
  polylinePreviewOptions,
  defaultMeasurementUnit,
  length,
  onSave,
  onCancel,
}: RouteDetailsEditingProps) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        onSave(data.route_name as string);
      }}
      onReset={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <Stack gap="4">
        <Flex direction="row" gap="2" align="center">
          <Box alignSelf="start">
            <MapGraphicPolylinePreviewSVG
              mapView={siisMapView}
              graphic={routeGraphic}
              options={polylinePreviewOptions}
            />
          </Box>
          <Box flexGrow={1}>
            <Flex gap="2" align="center">
              <TextField
                pattern="^[a-zA-Z0-9 ]+$"
                maxLength={50}
                isRequired
                name="route_name"
                label="Route name"
                className={css({ w: 'full' })}
                defaultValue={hyphensToSpaces(routeGraphic.attributes.route_name)}
                errorMessage="Please enter a name containing only letters, numbers, and spaces"
              />
            </Flex>
            <Text className={css({ textStyle: 'description' })}>
              Total length:{' '}
              <span
                style={{ whiteSpace: 'nowrap' }}
              >{`${length.toFixed(2)} ${getDisplayUnit(defaultMeasurementUnit)}`}</span>
            </Text>
          </Box>
        </Flex>
        <Flex gap="2" align="center">
          <Button variant="outline" size="md" type="submit">
            Save
          </Button>
          <Button variant="outline" size="md" type="reset">
            Cancel
          </Button>
        </Flex>
      </Stack>
    </Form>
  );
}

export function RouteDetails({
  routeGraphic,
  siisMapView,
  clearGraphic,
  setGraphic,
  controlledUpdate,
}: {
  routeGraphic: RouteGraphic;
  setGraphic: (graphic: __esri.Graphic | undefined) => void;
  siisMapView: __esri.MapView;
  clearGraphic: () => void;
  controlledUpdate: ControlledUpdate;
}) {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const defaultMeasurementUnit = useAppSelector(selectDefaultMeasurementUnit);
  const length = useGraphicGeodesicLength(routeGraphic, defaultMeasurementUnit);

  const { exportRoute } = useRouteExport();
  const handleRouteActions = React.useCallback(
    (action: RouteAction) => {
      if (action === 'delete-route') {
        clearGraphic();
      }
      if (action === 'edit-route') {
        setIsEditing(true);
        controlledUpdate.start(routeGraphic, {
          tool: 'reshape',
        });
      }
      if (action === 'export-route') {
        exportRoute(routeGraphic);
      }
    },
    [clearGraphic, controlledUpdate, exportRoute, routeGraphic],
  );

  const handleSave = React.useCallback(
    (routeName: string) => {
      setIsEditing(false);
      controlledUpdate.stop();
      const newRouteGraphic = routeGraphic.clone();
      newRouteGraphic.attributes.route_name = spacesToHyphens(routeName);
      setGraphic(newRouteGraphic);
    },
    [routeGraphic, setGraphic, controlledUpdate],
  );

  const handleCancel = React.useCallback(() => {
    setIsEditing(false);
    controlledUpdate.cancel();
  }, [controlledUpdate]);

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
      <Box
        w="full"
        borderWidth={'thin'}
        borderColor={isEditing ? 'app.accent' : 'bg.base.border'}
        p="4"
      >
        <Stack gap="2">
          {isEditing ? (
            <RouteDetailsEditing
              routeGraphic={routeGraphic}
              siisMapView={siisMapView}
              polylinePreviewOptions={polylinePreviewOptions}
              defaultMeasurementUnit={defaultMeasurementUnit}
              length={length}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <RouteDetailsStatic
              routeGraphic={routeGraphic}
              siisMapView={siisMapView}
              polylinePreviewOptions={polylinePreviewOptions}
              defaultMeasurementUnit={defaultMeasurementUnit}
              length={length}
              onRouteAction={handleRouteActions}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

function spacesToHyphens(text: string): string {
  return text.replace(/\s+/g, '-');
}

function hyphensToSpaces(text: string): string {
  return text.replace(/-+/g, ' ');
}
