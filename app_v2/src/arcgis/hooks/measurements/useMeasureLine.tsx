import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

import { useGraphicsLayer } from '../useLayer';
import { useArcState, useWatchEffect } from '../useWatchEffect';
import { DEFAULT_TEXT_SYMBOL_PROPS, DEFAULT_UNIT, getSketchViewModelConfig } from './constants';
import {
  LineGraphic,
  MeasurementLineAttributes,
  MeasurementToolOptions,
  MeasurementUnit,
} from './types';
import { useMeasurementGraphics } from './useMeasurementGraphics';
import { removeSegmentLabelGraphics, updateSegmentLabelGraphics } from './utils';

/**
 * Hook for managing line measurements on an ArcGIS MapView.
 * Provides functionality to draw, measure, and manage line measurements with labels.
 *
 * @param mapView - ArcGIS MapView instance to draw measurements on
 * @param measurementGroupId - Optional unique identifier for grouping measurements
 * @param options - Configuration options for measurements including graphics layer settings,
 *                 text symbol properties, and measurement units
 *
 * @returns {Object} Measurement control methods and state
 * @returns {Function} .startMeasurement - Starts or completes a line measurement
 * @returns {Function} .clearAll - Removes all measurements for this group
 * @returns {boolean} .isActive - Whether measurement mode is currently active
 * @returns {Array} .measurements - Array of existing measurements with their IDs and clear functions
 */
export function useMeasureLine(
  mapView: __esri.MapView,
  measurementGroupId?: string,
  unit?: MeasurementUnit,
  options?: MeasurementToolOptions,
): {
  startMeasurement: () => void;
  clearAll: () => void;
  measurements: {
    id: string;
    graphic: LineGraphic<MeasurementLineAttributes>;
    clear: () => void;
  }[];
  isActive: boolean;
} {
  // Core initialization - these values never change after initial setup
  const internalMeasurementGroupId = React.useMemo(
    () => measurementGroupId ?? crypto.randomUUID(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Layer setup
  const { layer: measurementGraphicsLayer } = useGraphicsLayer(
    mapView,
    options?.graphicsLayer ?? {
      listMode: 'hide',
    },
  );

  const sketchVM = React.useMemo(() => {
    const sketchVm = new SketchViewModel(
      getSketchViewModelConfig(mapView, measurementGraphicsLayer, options?.sketchOptions),
    );

    sketchVm.on('create', (event: __esri.SketchViewModelCreateEvent) => {
      const graphic = event.graphic as LineGraphic<MeasurementLineAttributes>;
      if (event.state === 'start') {
        graphic.setAttribute('lineId', crypto.randomUUID());
        graphic.setAttribute('measurementGroupId', internalMeasurementGroupId);
        graphic.setAttribute('type', 'measurement-line');
        graphic.setAttribute('length', 0);
        graphic.setAttribute('unit', unit ?? DEFAULT_UNIT);
      }
      if (event.state === 'complete' || event.state === 'active') {
        const { totalDistance } = updateSegmentLabelGraphics(
          mapView,
          measurementGraphicsLayer,
          graphic,
          options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
          unit ?? DEFAULT_UNIT,
        );
        graphic.setAttribute('length', totalDistance);
      }
      if (event.state === 'cancel') {
        removeSegmentLabelGraphics(measurementGraphicsLayer, graphic);
      }
    });

    sketchVm.on('update', (event: __esri.SketchViewModelUpdateEvent) => {
      if (event.state === 'active' || event.state === 'complete') {
        const graphic = event.graphics[0];
        if (!graphic || graphic.getAttribute('type') !== 'measurement-line') {
          sketchVm.cancel();
          return;
        }

        const { totalDistance } = updateSegmentLabelGraphics(
          mapView,
          measurementGraphicsLayer,
          graphic as LineGraphic<MeasurementLineAttributes>,
          options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
          unit ?? DEFAULT_UNIT,
        );
        graphic.setAttribute('unit', unit ?? DEFAULT_UNIT);
        graphic.setAttribute('length', totalDistance);
      }
    });

    sketchVm.on('delete', (event: __esri.SketchViewModelDeleteEvent) => {
      event.graphics.forEach((graphic) => {
        removeSegmentLabelGraphics(
          measurementGraphicsLayer,
          graphic as LineGraphic<MeasurementLineAttributes>,
        );
      });
    });

    return sketchVm;
  }, [mapView, measurementGraphicsLayer, options, internalMeasurementGroupId, unit]);

  // State tracking
  const [activeDrawMode] = useArcState(sketchVM, 'activeTool');

  // Measurement management
  const measurements = useMeasurementGraphics(measurementGraphicsLayer, internalMeasurementGroupId);

  // Handle map rotation updates for label positioning
  useWatchEffect(
    () => mapView?.rotation,
    () => {
      measurementGraphicsLayer.graphics.forEach((graphic) => {
        if (
          graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId &&
          graphic.getAttribute('type') === 'measurement-line'
        ) {
          updateSegmentLabelGraphics(
            mapView,
            measurementGraphicsLayer,
            graphic as LineGraphic<MeasurementLineAttributes>,
            options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
            unit ?? DEFAULT_UNIT,
          );
        }
      });
    },
    {
      initial: false,
    },
  );

  React.useEffect(() => {
    // if units change then find all of the lines and update the labels
    measurements.forEach((measurement) => {
      updateSegmentLabelGraphics(
        mapView,
        measurementGraphicsLayer,
        measurement.graphic as LineGraphic<MeasurementLineAttributes>,
        options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
        unit ?? DEFAULT_UNIT,
      );
    });
  }, [measurements, mapView, measurementGraphicsLayer, options, unit]);

  // Public methods
  const startMeasurement = React.useCallback(() => {
    if (activeDrawMode === 'polyline') {
      sketchVM.complete();
      return;
    }
    sketchVM.create('polyline');
  }, [sketchVM, activeDrawMode]);

  const clearAll = React.useCallback(() => {
    if (activeDrawMode === 'polyline') {
      sketchVM.cancel();
    }
    const measurementGraphics = measurementGraphicsLayer.graphics.filter(
      (g) => g.getAttribute('measurementGroupId') === internalMeasurementGroupId,
    );
    measurementGraphicsLayer.removeMany(measurementGraphics.toArray());
  }, [measurementGraphicsLayer, internalMeasurementGroupId, activeDrawMode, sketchVM]);

  return {
    startMeasurement,
    clearAll,
    isActive: activeDrawMode === 'polyline',
    measurements,
  };
}
