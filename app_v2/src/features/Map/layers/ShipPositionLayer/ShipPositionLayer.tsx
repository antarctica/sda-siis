import { useShipHeading, useShipSpeed } from '@/api/useShipSensorData';
import { useShipPositionWithVisibility } from '@/hooks/useShipPositionWithVisibility';
import { MapCRS } from '@/types';

import { ShipBufferGraphic } from './ShipBufferGraphic';
import { ShipLocationGraphic } from './ShipLocationGraphic';

function ShipPositionLayer({ crs }: { crs: MapCRS }) {
  const { latitude, longitude, isVisible } = useShipPositionWithVisibility();
  const { heading } = useShipHeading();
  const { speed } = useShipSpeed();
  const shipPosition = latitude && longitude ? { latitude, longitude } : null;

  if (!shipPosition) return null;

  return (
    <>
      <ShipLocationGraphic
        position={shipPosition}
        visible={isVisible}
        shipHeading={heading}
        mapCRS={crs}
      />
      <ShipBufferGraphic position={shipPosition} speed={speed} crs={crs} />
    </>
  );
}

export default ShipPositionLayer;
