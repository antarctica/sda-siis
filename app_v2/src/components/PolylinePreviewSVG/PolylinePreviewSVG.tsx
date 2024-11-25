import * as minimumBoundingCircleOperator from '@arcgis/core/geometry/operators/minimumBoundingCircleOperator.js';

import { useArcState } from '@/arcgis/hooks';

type Point = [number, number];

interface SvgPreviewOptions {
  size?: number;
  padding?: number;
  bgColor?: string;
  lineColor?: string;
  lineWidth?: number;
}

/**
 * Scales and centers polyline points to fit within a circular viewport
 * @param polyline - Input polyline geometry
 * @param size - SVG viewport size
 * @param padding - Padding inside circle
 * @returns Normalized points scaled to fit viewport
 */
function normalizePoints(polyline: __esri.Polyline, size: number, padding: number): Point[][] {
  const boundingCircle = minimumBoundingCircleOperator.execute(polyline);
  const center = boundingCircle.centroid;
  const radius = boundingCircle.extent.width / 2;
  const availableRadius = size / 2 - padding;
  const scale = radius === 0 ? 1 : availableRadius / radius;

  return polyline.paths.map((path) => {
    return path.map(([x, y]) => [
      ((x ?? 0) - center.x) * scale + size / 2,
      size - (((y ?? 0) - center.y) * scale + size / 2),
    ]);
  });
}

/**
 * Converts array of point paths to SVG path data strings
 */
function generatePathData(paths: Point[][]): string[] {
  return paths.map((path) =>
    path.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`).join(' '),
  );
}

export default function PolylinePreviewSVG({
  mapView,
  polyline,
  options,
}: {
  mapView: __esri.MapView;
  polyline: __esri.Polyline;
  options: SvgPreviewOptions;
}): JSX.Element {
  const {
    size = 100,
    padding = 10,
    bgColor = '#f0f0f0',
    lineColor = '#000000',
    lineWidth = 2,
  } = options;

  const normalizedPoints = normalizePoints(polyline, size, padding);
  const pathData = generatePathData(normalizedPoints);

  const [mapRotation] = useArcState(mapView, 'rotation');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${mapRotation}deg)`,
      }}
    >
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={bgColor} />
      {pathData.map((path, index) => (
        <path key={index} d={path} stroke={lineColor} strokeWidth={lineWidth} fill="none" />
      ))}
    </svg>
  );
}
