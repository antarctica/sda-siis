import { cva } from '@styled-system/css';
import { Circle } from '@styled-system/jsx';

import Badge, { BadgeVariant } from '@/components/common/Badge';
import { LayerStatus } from '@/types';

const statusCircleRecipe = cva({
  base: {
    borderWidth: 'thin',
    _focusVisible: {
      insetFocusRing: true,
    },
  },
  variants: {
    status: {
      offline: {
        borderColor: 'error.fg',
        bg: 'error.bg',
      },
      error: {
        borderColor: 'error.fg',
        bg: 'error.bg',
      },
      online: {
        borderColor: 'success.fg',
        bg: 'success.bg',
      },
      loading: {
        borderColor: 'warning.fg',
        bg: 'warning.bg',
      },
      static: {
        borderColor: 'info.fg',
        bg: 'info.bg',
      },
      outdated: {
        borderColor: 'app.grey.11',
        bg: 'app.grey.8',
      },
    },
  },
  defaultVariants: {
    status: 'static',
  },
});

export function LayerStatusCircle({ status }: { status: LayerStatus }) {
  return <Circle className={statusCircleRecipe({ status })} size={'2.5'}></Circle>;
}

export function LayerStatusBadge({ status = 'static' }: { status?: LayerStatus }) {
  const badgeVariant: Record<Exclude<LayerStatus, undefined>, BadgeVariant> = {
    offline: 'error',
    error: 'error',
    online: 'success',
    loading: 'warning',
    static: 'info',
    outdated: 'grey',
  };

  return <Badge variant={badgeVariant[status]}>{status}</Badge>;
}
