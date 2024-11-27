import { css } from '@styled-system/css';

import { useSensorData } from '@/api/useShipSensorData';
import { MapButton } from '@/components/common/Button';
import { selectSensorInfoPanelOpen } from '@/store/features/shipSlice';
import { setSensorInfoPanelOpen } from '@/store/features/shipSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import PulsatingDot from '../common/PulsatingDot';
import SvgIcon from '../common/SvgIcon';
import SensorInfoPanel from './SensorInfoPanel';

function SensorStatusDot() {
  const { sensorStatus, isLoading } = useSensorData();

  if (isLoading) return null;

  const getVariant = (status: string) => {
    switch (status) {
      case 'ERROR':
      case 'OFFLINE':
        return 'error';
      case 'PARTIALLY_ONLINE':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <PulsatingDot
      className={css({
        position: 'absolute',
        top: '0',
        right: '0',
      })}
      radius={3}
      weight={6}
      variant={getVariant(sensorStatus)}
    />
  );
}

function SensorInfo() {
  const sensorInfoPanelOpen = useAppSelector(selectSensorInfoPanelOpen);
  const dispatch = useAppDispatch();
  const toggleSensorInfo = () => dispatch(setSensorInfoPanelOpen(!sensorInfoPanelOpen));

  return (
    <div
      className={css({
        position: 'relative',
      })}
    >
      <MapButton
        icon={<SvgIcon name="icon-ship" size={16} />}
        aria-label={sensorInfoPanelOpen ? 'Hide ship sensor info' : 'Show ship sensor info'}
        aria-expanded={sensorInfoPanelOpen}
        aria-controls="sensor-info-panel"
        onPress={toggleSensorInfo}
        className={css({
          position: 'absolute',
          top: '0',
          right: '0',
          ...(sensorInfoPanelOpen
            ? {
                shadow: '[none]',
                borderColor: 'app.accent',
                borderStartRadius: 'radii.none',
                borderBottomRadius: 'radii.none',
              }
            : {}),
        })}
      />
      <SensorStatusDot />
      {sensorInfoPanelOpen && <SensorInfoPanel />}
    </div>
  );
}

export default SensorInfo;
