import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import { css, cx, sva } from '@styled-system/css';
import { Divider } from '@styled-system/jsx';
import React from 'react';
import { Button } from 'react-aria-components';

import { useCurrentMapView } from '@/arcgis/hooks';
import { ProjectionContext } from '@/arcgis/projection/ProjectionProvider';

import useFormattedLatLon from './useFormattedLatLon';

const cursorLocationControlStyle = sva({
  slots: ['wrapper', 'format', 'value'],
  base: {
    wrapper: {
      display: 'flex',
      bg: 'bg.base',
      cursor: 'pointer',
      gap: '2',
      px: '2',
      py: '1',
      alignItems: 'center',
      fontSize: 'xs',
      borderRadius: 'sm',
      fontWeight: 'semibold',
      boxShadow: 'md',
      borderColor: 'bg.base.border',
      borderWidth: 'thin',
    },
    format: {
      color: 'fg.accent',
    },
    value: {
      flexGrow: 1,
      textAlign: 'center',
      color: 'fg',
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
          w: '[250px]',
        },
      },
      DD: {
        wrapper: {
          w: '[165px]',
        },
      },
      DDM: {
        wrapper: {
          w: '[230px]',
        },
      },
    },
  },
});

function CursorLocationControl() {
  const mapView = useCurrentMapView();
  const { project } = React.useContext(ProjectionContext)!;
  const [lat, setLat] = React.useState<number | undefined>();
  const [lon, setLon] = React.useState<number | undefined>();
  const [format, setFormat] = React.useState<'DD' | 'DMS' | 'DDM'>('DD');

  // Use a ref to keep track of the latest request
  const latestRequestId = React.useRef(0);

  const updateCoordinates = React.useCallback(
    async (point: __esri.Point) => {
      const currentRequestId = ++latestRequestId.current;

      try {
        const projectedPoint = (await project(point, SpatialReference.WGS84)) as __esri.Point;

        // Only update if this is still the latest request
        if (currentRequestId === latestRequestId.current) {
          setLat(projectedPoint.latitude);
          setLon(projectedPoint.longitude);
        }
      } catch (error) {
        console.error('Error projecting point:', error);
      }
    },
    [project],
  );

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
    const formats = ['DD', 'DMS', 'DDM'];
    setFormat((prevFormat) => {
      const currentIndex = formats.indexOf(prevFormat);
      return formats[(currentIndex + 1) % formats.length] as 'DD' | 'DMS' | 'DDM';
    });
  };

  // Use the custom hook to get formatted coordinates
  const formattedLatLon = useFormattedLatLon(lat, lon, format);
  if (!formattedLatLon) return null;
  return (
    <Button
      onPress={handleToggleFormat}
      className={({ isFocusVisible }) => {
        const { wrapper } = cursorLocationControlStyle({
          isFocusVisible,
          Format: format,
        });

        return cx(wrapper);
      }}
    >
      <span
        className={css({
          srOnly: true,
        })}
      >
        Toggle format to{' '}
        {format === 'DD'
          ? 'Degrees Minutes Seconds'
          : format === 'DMS'
            ? 'Degrees Decimal Minutes'
            : 'Decimal Degrees'}
      </span>

      <span className={cursorLocationControlStyle().value}> {formattedLatLon}</span>
      <Divider orientation="vertical" display={'inline-block'} />
      <span className={cursorLocationControlStyle().format}>{format}</span>
    </Button>
  );
}

export default CursorLocationControl;
