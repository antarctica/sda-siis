import { css, cx } from '@styled-system/css';
import React from 'react';

type IconName =
  | 'icon-add'
  | 'icon-calendar'
  | 'icon-chevron-down'
  | 'icon-chevron-up'
  | 'icon-chevron-right'
  | 'icon-chevron-left'
  | 'icon-circle'
  | 'icon-double-left-arrow'
  | 'icon-double-right-arrow'
  | 'icon-download'
  | 'icon-filter'
  | 'icon-home'
  | 'icon-icechart'
  | 'icon-image'
  | 'icon-menu'
  | 'icon-more'
  | 'icon-search-globe'
  | 'icon-subtract'
  | 'icon-x'
  | 'icon-antarctic-globe'
  | 'icon-arctic-globe'
  | 'icon-hamburger'
  | 'icon-met-globe'
  | 'icon-navigate'
  | 'icon-no-navigate'
  | 'icon-layers'
  | 'icon-properties'
  | 'icon-add-layer'
  | 'icon-page-share'
  | 'icon-zoom-to'
  | 'icon-send-message'
  | 'icon-check-circle'
  | 'icon-measure'
  | 'icon-map-polygon'
  | 'icon-map-polyline'
  | 'icon-trash'
  | 'icon-info'
  | 'icon-settings'
  | 'icon-globe'
  | 'icon-fullscreen';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  color?: string;
}

const SvgIcon: React.FC<IconProps> = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 12, color = 'currentColor', className, style, ...props }, ref) => (
    <svg
      aria-hidden
      ref={ref}
      className={cx(css({ userSelect: 'none' }), className)}
      width={size}
      height={size}
      fill={color}
      style={style}
      {...props}
    >
      <use xlinkHref={`/svg/sprites.svg#${name}`} />
    </svg>
  ),
);

export default SvgIcon;
