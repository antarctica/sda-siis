import { Box, Stack } from '@styled-system/jsx';

import { Text } from '@/components/common/Typography';
import { textLineBarRecipe } from '@/components/common/Typography/typographyRecipes';
import { WorkflowItem } from '@/components/WorkflowStepper';

import { CreateRouteButton } from '../CreateRouteButton';
import { ImportRouteButton } from '../ImportRoutesButton';

export function SelectRouteStep({
  itemState,
  setGraphic,
  create,
  activeDrawMode,
  mapView,
}: {
  itemState: 'active' | 'completed';
  setGraphic: (graphic: __esri.Graphic | undefined) => void;
  create: __esri.SketchViewModel['create'];
  activeDrawMode: __esri.SketchViewModel['activeTool'];
  mapView: __esri.MapView;
}) {
  return (
    <WorkflowItem
      title="Add a route"
      description="Import an existing .rtzp file or draw a route on the map."
      state={itemState}
    >
      <Stack gap="2">
        <ImportRouteButton setGraphic={setGraphic} mapView={mapView} />
        <Box w="full" px="4">
          <Text className={textLineBarRecipe({ lineBarPosition: 'middle' })}>OR</Text>
        </Box>
        <CreateRouteButton create={create} activeDrawMode={activeDrawMode} />
      </Stack>
    </WorkflowItem>
  );
}
