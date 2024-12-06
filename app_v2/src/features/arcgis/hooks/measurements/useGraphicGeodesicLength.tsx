import * as geodeticLengthOperator from '@arcgis/core/geometry/operators/geodeticLengthOperator';
import { useDebouncedValue } from '@mantine/hooks';

import { LineGraphic } from '@/types';

import { useArcState } from '../useWatchEffect';
import { MeasurementUnit } from './types';

export function useGraphicGeodesicLength<T extends LineGraphic>(graphic: T, unit: MeasurementUnit) {
  const [geometry] = useArcState(graphic, 'geometry');
  const [debouncedGeometry] = useDebouncedValue(geometry, 50);
  return geodeticLengthOperator.execute(debouncedGeometry, {
    unit,
  });
}
