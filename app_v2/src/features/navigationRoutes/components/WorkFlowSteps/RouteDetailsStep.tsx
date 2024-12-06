import { Box, Flex, Stack } from '@styled-system/jsx';

import SvgIcon from '@/components/common/SvgIcon';
import { Text } from '@/components/common/Typography';
import { WorkflowItem } from '@/components/WorkflowStepper';
import { ControlledUpdate } from '@/features/arcgis/hooks/useDrawSingleGraphic';

import { RouteGraphic } from '../../utils';
import { RouteDetails } from '../RouteDetails';

export function RouteDetailsStep({
  routeGraphic,
  siisMapView,
  setGraphic,
  clearGraphic,
  controlledUpdate,
}: {
  routeGraphic: RouteGraphic | undefined;
  siisMapView: __esri.MapView;
  setGraphic: (graphic: __esri.Graphic | undefined) => void;
  clearGraphic: () => void;
  controlledUpdate: ControlledUpdate;
}) {
  return (
    <WorkflowItem
      state={routeGraphic ? 'active' : 'disabled'}
      title="Route Details"
      description="Explore information about your selected route."
    >
      <Stack gap="2">
        {routeGraphic ? (
          <RouteDetails
            key={routeGraphic.attributes.route_name}
            routeGraphic={routeGraphic}
            siisMapView={siisMapView}
            clearGraphic={clearGraphic}
            setGraphic={setGraphic}
            controlledUpdate={controlledUpdate}
          />
        ) : (
          <Box w="full" bg="bg.surface" p="4">
            <Flex direction="row" gap="2" align="center">
              <SvgIcon name="icon-info" size={16} />
              <Text>Please add a route to view details.</Text>
            </Flex>
          </Box>
        )}
      </Stack>
    </WorkflowItem>
  );
}
