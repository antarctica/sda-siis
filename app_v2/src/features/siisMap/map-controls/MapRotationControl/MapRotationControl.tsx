import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { sva } from '@styled-system/css';
import { motion } from 'framer-motion';
import * as React from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { Button, TooltipTrigger } from 'react-aria-components';

import { useShipHeading, useShipPosition } from '@/api/useShipSensorData';
import Tooltip from '@/components/common/Tooltip';
import { useCurrentMapView } from '@/features/arcgis/hooks';
import { useShipPositionWithVisibility } from '@/hooks/useShipPositionWithVisibility';
import { MapCRS } from '@/types';
import { calculateCorrectedHeading, calculateProjectedBearingToPole } from '@/utils/mapUtils';

enum MapRotation {
  H_UP = 'H UP',
  PR_UP = 'PR UP',
  LN_UP = 'LN UP',
}

const mapRotationStyle = sva({
  slots: ['root', 'item', 'motionBackground'],
  base: {
    root: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      borderColor: 'bg.base.border',
      borderRadius: 'md',
      borderWidth: 'thin',
      w: '16',
      bg: 'bg.base',
      boxShadow: 'md',
      overflow: 'hidden',
      pointerEvents: 'auto',
    },
    item: {
      zIndex: 1,
      position: 'relative',
      w: 'full',
      py: '2',
      px: '1',
      color: 'fg.muted',
      textAlign: 'center',
      fontSize: 'sm',
      cursor: 'pointer',
      _focusVisible: {
        insetFocusRing: true,
      },
      _hover: {
        bg: 'bg.surface',
      },
    },
    motionBackground: {
      zIndex: 0,
      position: 'absolute',
      left: '0',
      right: '0',
      height: '1/3',
      bg: 'bg.base.active',
    },
  },
  variants: {
    itemSelected: {
      true: {
        item: {
          color: 'fg.accent',
          fontWeight: 'extrabold',
        },
      },
    },
  },
});

function useSetMapRotationFromControl(value: MapRotation, crs: MapCRS) {
  const mapView = useCurrentMapView();
  const { heading } = useShipHeading();
  const { latitude, longitude } = useShipPosition();

  React.useEffect(() => {
    if (!crs) return;
    let rotation = 0;
    switch (value) {
      case MapRotation.H_UP: {
        const correctedHeading = calculateCorrectedHeading(
          { latitude: latitude ?? 0, longitude: longitude ?? 0 },
          heading ?? 0,
          crs,
        );
        console.log('correctedHeading', correctedHeading);
        rotation = -correctedHeading;
        break;
      }
      case MapRotation.PR_UP:
        rotation = 0;
        break;
      case MapRotation.LN_UP:
        if (crs === MapCRS.MERCATOR) {
          rotation = 0;
        } else {
          rotation = -calculateProjectedBearingToPole(
            { latitude: latitude ?? 0, longitude: longitude ?? 0 },
            crs,
          );
        }
        break;
    }

    reactiveUtils
      .whenOnce(() => !(mapView?.interacting || mapView?.animation))
      .then(() => {
        mapView.rotation = rotation;
      });
  }, [value, mapView, heading, latitude, longitude, crs]);
}

function MapRotationToggleGroup({ crs }: { crs: MapCRS }) {
  const [value, setValue] = React.useState<MapRotation>(MapRotation.PR_UP);
  const { isVisible } = useShipPositionWithVisibility();

  useSetMapRotationFromControl(value, crs);
  const getSlidePosition = () => {
    switch (value) {
      case MapRotation.H_UP:
        return 0;
      case MapRotation.PR_UP:
        return 1;
      case MapRotation.LN_UP:
        return 2;
      default:
        return 0;
    }
  };

  if (!isVisible) return null;

  return (
    <RadioGroup
      className={mapRotationStyle().root}
      value={value}
      aria-label="Map Rotation"
      onChange={(val) => val && setValue(val as MapRotation)}
    >
      <motion.div
        className={mapRotationStyle().motionBackground}
        animate={{
          y: `${getSlidePosition() * 100}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 35,
          bounce: 0,
        }}
      />

      {Object.values(MapRotation).map((option) => (
        <Radio key={option} value={option}>
          <TooltipTrigger delay={800}>
            <Button
              className={mapRotationStyle({ itemSelected: value === option }).item}
              onPress={() => {
                setValue(option);
              }}
              aria-label={option}
            >
              {option}
            </Button>
            <Tooltip placement="left">
              {option === MapRotation.H_UP && 'Heading Up'}
              {option === MapRotation.PR_UP && 'Projection Up'}
              {option === MapRotation.LN_UP && 'Local North Up'}
            </Tooltip>
          </TooltipTrigger>
        </Radio>
      ))}
    </RadioGroup>
  );
}

export default MapRotationToggleGroup;
