import SvgIcon from '@/components/common/SvgIcon';

import { ToggleButton } from '../../../components/common/Button';

export function CreateRouteButton({
  create,
  activeDrawMode,
}: {
  create: __esri.SketchViewModel['create'];
  activeDrawMode: __esri.SketchViewModel['activeTool'];
}) {
  return (
    <ToggleButton
      size="md"
      onPress={() => create('polyline')}
      isSelected={activeDrawMode === 'polyline'}
    >
      <SvgIcon name="icon-add-circle-graphic" size={16} />
      Create Route
    </ToggleButton>
  );
}
