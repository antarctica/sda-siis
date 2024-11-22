import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import Graphic from '@arcgis/core/Graphic';
import React from 'react';

import { LineGraphic, MeasurementLineAttributes } from './types';

export function useMeasurementGraphics(
  measurementGraphicsLayer: __esri.GraphicsLayer,
  internalMeasurementGroupId: string,
) {
  const [measurements, setMeasurements] = React.useState<
    {
      id: string;
      graphic: LineGraphic<MeasurementLineAttributes>;
      clear: () => void;
    }[]
  >(() => {
    const controlledGraphics = measurementGraphicsLayer.graphics
      .filter(
        (graphic) =>
          graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId &&
          graphic.getAttribute('type') === 'measurement-line',
      )
      .toArray();

    return controlledGraphics.map((graphic) => ({
      id: graphic.attributes.lineId,
      graphic: graphic as LineGraphic<MeasurementLineAttributes>,
      clear: () => measurementGraphicsLayer.remove(graphic),
    }));
  });

  React.useEffect(() => {
    const handleGraphicsChange = (event: __esri.CollectionChangeEvent<Graphic>) => {
      const hasLineChanges =
        event.added.some(
          (graphic) =>
            graphic.getAttribute('type') === 'measurement-line' &&
            graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId,
        ) ||
        event.removed.some(
          (graphic) =>
            graphic.getAttribute('type') === 'measurement-line' &&
            graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId,
        );

      if (!hasLineChanges) return;

      const controlledGraphics = measurementGraphicsLayer.graphics
        .filter(
          (graphic) =>
            graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId &&
            graphic.getAttribute('type') === 'measurement-line',
        )
        .toArray();

      setMeasurements(
        controlledGraphics.map((graphic) => ({
          id: graphic.attributes.lineId,
          graphic: graphic as LineGraphic<MeasurementLineAttributes>,
          clear: () => measurementGraphicsLayer.remove(graphic),
        })),
      );
    };

    const handle = reactiveUtils.on(
      () => measurementGraphicsLayer.graphics,
      'change',
      handleGraphicsChange,
    );

    return () => handle.remove();
  }, [measurementGraphicsLayer, internalMeasurementGroupId]);

  return measurements;
}
