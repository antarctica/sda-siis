import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React from 'react';

import { useLayerView } from '../useLayerView';
import { useArcState, useWatchEffect } from '../useWatchEffect';
import { DEFAULT_TEXT_SYMBOL_PROPS, DEFAULT_UNIT, getSketchViewModelConfig } from './constants';
import { isMeasurementLine } from './typeGuards';
import {
  LineGraphic,
  MeasurementLineAttributes,
  MeasurementToolOptions,
  MeasurementUnit,
} from './types';
import { useMeasurementGraphics } from './useMeasurementGraphics';
import {
  createSketchVMEventHandlers,
  updateLineGraphicMeasurements,
  updateSegmentLabelGraphics,
} from './utils';

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
  const { layer: measurementGraphicsLayer } = useLayerView<
    __esri.GraphicsLayer,
    __esri.GraphicsLayerView
  >(
    mapView,
    options?.graphicsLayer ??
      new GraphicsLayer({
        listMode: 'hide',
      }),
  );

  const sketchVM = React.useMemo(() => {
    const newSketchVM = new SketchViewModel(
      getSketchViewModelConfig(mapView, measurementGraphicsLayer, options?.sketchOptions),
    );

    const handlers = createSketchVMEventHandlers({
      mapView,
      measurementGraphicsLayer,
      internalMeasurementGroupId,
      unit: unit ?? DEFAULT_UNIT,
      options,
      sketchVM: newSketchVM,
    });

    const createHandle = newSketchVM.on('create', handlers.handleCreate);
    const updateHandle = newSketchVM.on('update', handlers.handleUpdate);
    const deleteHandle = newSketchVM.on('delete', handlers.handleDelete);

    newSketchVM.addHandles([createHandle, updateHandle, deleteHandle]);

    return newSketchVM;
  }, [mapView, measurementGraphicsLayer, options, internalMeasurementGroupId, unit]);

  // State tracking
  const [activeDrawMode] = useArcState(sketchVM, 'activeTool');

  // Measurement management
  const [measurements, setMeasurements] = useMeasurementGraphics(
    measurementGraphicsLayer,
    internalMeasurementGroupId,
    sketchVM,
  );

  // Handle map rotation updates for label positioning
  useWatchEffect(
    () => mapView?.rotation,
    () => {
      measurementGraphicsLayer.graphics.forEach((graphic) => {
        if (
          isMeasurementLine(graphic) &&
          graphic.getAttribute('measurementGroupId') === internalMeasurementGroupId
        ) {
          updateSegmentLabelGraphics(
            mapView,
            measurementGraphicsLayer,
            graphic,
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
    setMeasurements((measurements) => {
      return measurements.map((measurement) => {
        updateLineGraphicMeasurements(
          measurement.graphic,
          mapView,
          measurementGraphicsLayer,
          unit ?? DEFAULT_UNIT,
          options?.textSymbol ?? DEFAULT_TEXT_SYMBOL_PROPS,
        );
        return measurement;
      });
    });
  }, [setMeasurements, mapView, measurementGraphicsLayer, options, unit]);

  // Public methods
  const startMeasurement = React.useCallback(() => {
    if (activeDrawMode === 'polyline') {
      if (isMeasurementLine(sketchVM.createGraphic)) {
        sketchVM.complete();
      } else {
        sketchVM.cancel();
      }
      return;
    }
    sketchVM.create('polyline');
  }, [sketchVM, activeDrawMode]);

  const clearAll = React.useCallback(() => {
    if (activeDrawMode === 'polyline') {
      sketchVM.cancel();
    }
    const measurementGraphics = measurementGraphicsLayer.graphics
      .filter((g) => g.getAttribute('measurementGroupId') === internalMeasurementGroupId)
      .toArray();
    measurementGraphicsLayer.removeMany(measurementGraphics);
  }, [measurementGraphicsLayer, internalMeasurementGroupId, activeDrawMode, sketchVM]);

  return {
    startMeasurement,
    clearAll,
    isActive: activeDrawMode === 'polyline',
    measurements,
  };
}
