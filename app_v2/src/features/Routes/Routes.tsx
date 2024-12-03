import { Flex } from '@styled-system/jsx';

import ImportRoute from '@/components/ImportRoute/ImportRoute';
import { useMapInteractionLayers } from '@/contexts/MapInteractionLayers';
import { useSIISMapView } from '@/hooks/useSIISMapView';

function Routes() {
  const { routesLayer } = useMapInteractionLayers();
  const siisMapView = useSIISMapView();

  if (!siisMapView) return null;

  return (
    <Flex gap="2" direction="column">
      <ImportRoute mapView={siisMapView} graphicsLayer={routesLayer} />
    </Flex>
  );
}

export default Routes;
