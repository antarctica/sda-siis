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
        visible={isVisible}
        shipHeading={heading}
        mapCRS={crs}
        position={shipPosition}
      />
      <ShipBufferGraphic speed={speed} crs={crs} position={shipPosition} />
    </>
  );
}

export default ShipPositionLayer;
