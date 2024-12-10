import { project } from '@arcgis/core/geometry/projection';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import { cx, sva } from '@styled-system/css';
import { Divider, VisuallyHidden } from '@styled-system/jsx';
import React from 'react';
import { Button } from 'react-aria-components';

import { useCurrentMapView } from '@/features/arcgis/hooks';
import { selectDefaultLatLonFormat } from '@/store/features/appSlice';
import { useAppSelector } from '@/store/hooks';
import { LatLonFormat } from '@/types';
import { formatCoordinate } from '@/utils/formatCoordinates';

const cursorLocationControlStyle = sva({
  slots: ['wrapper', 'format', 'value'],
  base: {
    wrapper: {
      display: 'flex',
      gap: '2',
      alignItems: 'center',
      borderColor: 'bg.base.border',
      borderRadius: 'sm',
      borderWidth: 'thin',
      py: '1',
      px: '2',
      fontSize: 'xs',
      fontWeight: 'semibold',
      bg: 'bg.base',
      boxShadow: 'md',
      cursor: 'pointer',
      pointerEvents: 'auto',
    },
    format: {
      color: 'fg.accent',
    },
    value: {
      flexGrow: 1,
      color: 'fg',
      textAlign: 'center',
    },
  },
  variants: {
    isFocusVisible: {
      true: {
        wrapper: {
          insetFocusRing: true,
        },
      },
      false: {
        wrapper: {
          insetFocusRing: false,
        },
      },
    },
    Format: {
      DMS: {
        wrapper: {
          w: '[16.5rem]',
        },
      },
      DD: {
        wrapper: {
          w: '44',
        },
      },
      DDM: {
        wrapper: {
          w: '60',
        },
      },
    },
  },
});

function CursorLocationControl() {
  const mapView = useCurrentMapView();
  const [lat, setLat] = React.useState<number | undefined>();
  const [lon, setLon] = React.useState<number | undefined>();
  const defaultLatLonFormat = useAppSelector(selectDefaultLatLonFormat);
  const [format, setFormat] = React.useState<LatLonFormat>(defaultLatLonFormat);

  // Use a ref to keep track of the latest request
  const latestRequestId = React.useRef(0);

  const updateCoordinates = React.useCallback((point: __esri.Point) => {
    const currentRequestId = ++latestRequestId.current;

    try {
      const projectedPoint = project(point, SpatialReference.WGS84) as __esri.Point;

      // Only update if this is still the latest request
      if (currentRequestId === latestRequestId.current) {
        setLat(projectedPoint.latitude);
        setLon(projectedPoint.longitude);
      }
    } catch (error) {
      console.error('Error projecting point:', error);
    }
  }, []);

  React.useEffect(() => {
    const handle = mapView.on('pointer-move', (e) => {
      const point = mapView.toMap({
        x: e.x,
        y: e.y,
      });
      updateCoordinates(point);
    });

    return () => {
      handle.remove();
      // Abort any ongoing requests when unmounting
      // eslint-disable-next-line react-hooks/exhaustive-deps
      latestRequestId.current++;
    };
  }, [mapView, updateCoordinates]);

  // Toggle between different formats
  const handleToggleFormat = () => {
    const formats: LatLonFormat[] = ['DD', 'DMS', 'DDM'];
    setFormat((prevFormat) => {
      const currentIndex = formats.indexOf(prevFormat);
      return formats[(currentIndex + 1) % formats.length] as LatLonFormat;
    });
  };

  // Use the custom hook to get formatted coordinates
  const formattedLatLon = formatCoordinate(lat, lon, format);
  if (!formattedLatLon) return null;
  return (
    <Button
      className={({ isFocusVisible }) => {
        const { wrapper } = cursorLocationControlStyle({
          isFocusVisible,
          Format: format,
        });

        return cx(wrapper);
      }}
      onPress={handleToggleFormat}
    >
      <VisuallyHidden>
        Toggle format to{' '}
        {format === 'DD'
          ? 'Degrees Minutes Seconds'
          : format === 'DMS'
            ? 'Degrees Decimal Minutes'
            : 'Decimal Degrees'}
      </VisuallyHidden>

      <span className={cursorLocationControlStyle().value}> {formattedLatLon}</span>
      <Divider orientation="vertical" display={'inline-block'} />
      <span className={cursorLocationControlStyle().format}>{format}</span>
    </Button>
  );
}

export default CursorLocationControl;
