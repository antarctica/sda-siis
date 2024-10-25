import { cva, cx, RecipeVariantProps } from '@styled-system/css';

interface PulsatingDotProps {
  radius?: number;
  weight?: number;
  className?: string;
}

const pulsatingDotRecipe = cva({
  base: {
    pointerEvents: 'none',
  },
  variants: {
    variant: {
      error: {
        fill: 'bas_aircraftRed',
        stroke: 'bas_aircraftRed',
        _dark: {
          fill: 'bas_aircraftRed.light',
          stroke: 'bas_aircraftRed.light',
        },
      },
      success: {
        fill: 'bas_green',
        stroke: 'bas_green',
        _dark: {
          fill: 'bas_green.light',
          stroke: 'bas_green.light',
        },
      },
      warning: {
        fill: 'bas_orange',
        stroke: 'bas_orange',
        _dark: {
          fill: 'bas_orange.light',
          stroke: 'bas_orange.light',
        },
      },
    },
  },
});

function PulsatingDot({
  radius = 0,
  weight = 0,
  variant,
  className,
}: PulsatingDotProps & RecipeVariantProps<typeof pulsatingDotRecipe>) {
  const d = radius + weight;
  const d2 = d * 2;

  return (
    <svg
      width={d2}
      height={d2}
      version="1.1"
      viewBox={`-${d} -${d} ${d2} ${d2}`}
      className={cx(pulsatingDotRecipe({ variant }), className)}
    >
      <circle cx="0" cy="0" r={radius} strokeWidth={0} strokeOpacity={1} fillOpacity={1}>
        <animate
          attributeName="stroke-width"
          values={`0;${weight};0`}
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
          keyTimes="0; 0.99999; 1"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0 0 1 1"
        />
        <animate
          attributeName="stroke-opacity"
          values="0.8;0;0.8"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
          keyTimes="0; 0.99999; 1"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0 0 1 1"
        />
      </circle>
    </svg>
  );
}

export default PulsatingDot;
