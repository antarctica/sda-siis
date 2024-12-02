import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

import { isMeasurementLine } from './typeGuards';
import { LineGraphic, MeasurementLineAttributes } from './types';
import { removeSegmentLabelGraphics } from './utils';

type MeasurementItem = {
  id: string;
  graphic: LineGraphic<MeasurementLineAttributes>;
  clear: () => void;
};

export function useMeasurementGraphics(
  measurementGraphicsLayer: __esri.GraphicsLayer,
  internalMeasurementGroupId: string,
  sketchVM: SketchViewModel,
): [MeasurementItem[], React.Dispatch<React.SetStateAction<MeasurementItem[]>>] {
  const [measurements, setMeasurements] = React.useState<MeasurementItem[]>(() => {
    const controlledGraphics = measurementGraphicsLayer.graphics
      .filter(
        (graphic) =>
          isMeasurementLine(graphic) &&
          graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId,
      )
      .toArray() as LineGraphic<MeasurementLineAttributes>[];

    return controlledGraphics.map((graphic) => ({
      id: graphic.attributes.lineId,
      graphic,
      clear: () => {
        // remove label graphics
        sketchVM.cancel();
        removeSegmentLabelGraphics(measurementGraphicsLayer, graphic);
        measurementGraphicsLayer.remove(graphic);
      },
    }));
  });

  React.useEffect(() => {
    const handleGraphicsChange = (event: __esri.CollectionChangeEvent<__esri.Graphic>) => {
      const hasLineChanges =
        event.added.some(
          (graphic) =>
            isMeasurementLine(graphic) &&
            graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId,
        ) ||
        event.removed.some(
          (graphic) =>
            isMeasurementLine(graphic) &&
            graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId,
        );

      if (!hasLineChanges) return;

      const controlledGraphics = measurementGraphicsLayer.graphics
        .filter(
          (graphic) =>
            isMeasurementLine(graphic) &&
            graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId,
        )
        .toArray() as LineGraphic<MeasurementLineAttributes>[];

      setMeasurements(
        controlledGraphics.map((graphic) => ({
          id: graphic.attributes.lineId,
          graphic,
          clear: () => {
            // remove label graphics
            sketchVM.cancel();
            removeSegmentLabelGraphics(measurementGraphicsLayer, graphic);
            measurementGraphicsLayer.remove(graphic);
          },
        })),
      );
    };

    const handle = reactiveUtils.on(
      () => measurementGraphicsLayer.graphics,
      'change',
      handleGraphicsChange,
    );

    return () => handle.remove();
  }, [measurementGraphicsLayer, internalMeasurementGroupId, sketchVM]);

  return [measurements, setMeasurements];
}
