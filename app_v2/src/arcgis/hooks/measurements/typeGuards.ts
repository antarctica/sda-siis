import { LineGraphic, MeasurementLabelAttributes, MeasurementLineAttributes } from './types';

/**
 * Type guard to check if a graphic is a measurement line
 */
export function isMeasurementLine(
  graphic: __esri.Graphic | undefined,
): graphic is LineGraphic<MeasurementLineAttributes> {
  if (!graphic) return false;

  return (
    graphic.getAttribute('type') === 'measurement-line' &&
    typeof graphic.getAttribute('lineId') === 'string' &&
    typeof graphic.getAttribute('measurementGroupId') === 'string' &&
    typeof graphic.getAttribute('length') === 'number' &&
    typeof graphic.getAttribute('unit') === 'string' &&
    graphic.geometry?.type === 'polyline'
  );
}

/**
 * Type guard to check if a graphic is a measurement label
 */
export function isMeasurementLabel(
  graphic: __esri.Graphic | undefined,
): graphic is __esri.Graphic & { attributes: MeasurementLabelAttributes } {
  if (!graphic) return false;

  return (
    graphic.getAttribute('type') === 'measurement-label' &&
    typeof graphic.getAttribute('lineId') === 'string' &&
    typeof graphic.getAttribute('measurementGroupId') === 'string' &&
    typeof graphic.getAttribute('segmentIndex') === 'number' &&
    graphic.geometry?.type === 'point'
  );
}

/**
 * Safely gets measurement line attributes if the graphic is a valid measurement line
 */
export function getMeasurementLineAttributes(
  graphic: __esri.Graphic | undefined,
): MeasurementLineAttributes | null {
  if (!isMeasurementLine(graphic)) return null;
  return graphic.attributes;
}

/**
 * Safely gets measurement label attributes if the graphic is a valid measurement label
 */
export function getMeasurementLabelAttributes(
  graphic: __esri.Graphic | undefined,
): MeasurementLabelAttributes | null {
  if (!isMeasurementLabel(graphic)) return null;
  return graphic.attributes;
}
