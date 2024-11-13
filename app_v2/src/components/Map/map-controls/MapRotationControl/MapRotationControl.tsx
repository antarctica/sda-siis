import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { sva } from '@styled-system/css';
import { motion } from 'framer-motion';
import * as React from 'react';
import { Button, TooltipTrigger } from 'react-aria-components';

import { useShipHeading, useShipPosition } from '@/api/useShipSensorData';
import { useCurrentMapView } from '@/arcgis/hooks';
import Tooltip from '@/components/common/Tooltip';
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
      flexDirection: 'column',
      boxShadow: 'md',
      bg: 'bg.base',
      borderColor: 'bg.base.border',
      borderWidth: 'thin',
      borderRadius: 'md',
      position: 'relative',
      overflow: 'hidden',
      w: '16',
    },
    item: {
      py: '2',
      px: '1',
      cursor: 'pointer',
      fontSize: 'sm',
      textAlign: 'center',
      color: 'fg.muted',
      position: 'relative',
      zIndex: 1,
      _hover: {
        bg: 'bg.surface',
      },
      _focusVisible: {
        insetFocusRing: true,
      },
    },
    motionBackground: {
      position: 'absolute',
      left: '0',
      right: '0',
      height: '1/3',
      bg: 'bg.base.active',
      zIndex: 0,
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

function MapRotationToggleGroup() {
  const [value, setValue] = React.useState<MapRotation>(MapRotation.PR_UP);

  const mapView = useCurrentMapView();
  const shipHeading = useShipHeading();
  const { latitude, longitude } = useShipPosition();

  const setMapRotation = React.useCallback(
    (mapRotation: MapRotation) => {
      let rotation = 0;
      switch (mapRotation) {
        case MapRotation.H_UP: {
          const correctedHeading = calculateCorrectedHeading(
            { latitude: latitude ?? 0, longitude: longitude ?? 0 },
            shipHeading?.heading ?? 0,
            MapCRS.ANTARCTIC,
          );
          rotation = -correctedHeading;
          break;
        }
        case MapRotation.PR_UP:
          rotation = 0;
          break;
        case MapRotation.LN_UP:
          rotation = -calculateProjectedBearingToPole(
            { latitude: latitude ?? 0, longitude: longitude ?? 0 },
            MapCRS.ANTARCTIC,
          );
          break;
      }

      reactiveUtils
        .whenOnce(() => !(mapView?.interacting || mapView?.animation))
        .then(() => {
          mapView.rotation = rotation;
        });
    },
    [mapView, shipHeading, latitude, longitude],
  );

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

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(val) => val && setValue(val as MapRotation)}
      className={mapRotationStyle().root}
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
        <ToggleGroup.Item key={option} value={option} asChild>
          <TooltipTrigger delay={800}>
            <Button
              onPress={() => {
                setValue(option);
                setMapRotation(option);
              }}
              className={mapRotationStyle({ itemSelected: value === option }).item}
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
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

export default MapRotationToggleGroup;
