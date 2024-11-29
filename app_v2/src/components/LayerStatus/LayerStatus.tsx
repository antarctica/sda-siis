import { cva } from '@styled-system/css';
import { Circle } from '@styled-system/jsx';

import { LayerStatus } from '@/types';

import Badge, { BadgeVariant } from '../common/Badge';

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
        bg: 'error.bg',
        borderColor: 'error.fg',
      },
      error: {
        bg: 'error.bg',
        borderColor: 'error.fg',
      },
      online: {
        bg: 'success.bg',
        borderColor: 'success.fg',
      },
      loading: {
        bg: 'warning.bg',
        borderColor: 'warning.fg',
      },
      static: {
        bg: 'info.bg',
        borderColor: 'info.fg',
      },
      outdated: {
        bg: 'app.grey.8',
        borderColor: 'app.grey.11',
      },
    },
  },
  defaultVariants: {
    status: 'static',
  },
});

export function LayerStatusCircle({ status }: { status: LayerStatus }) {
  return <Circle className={statusCircleRecipe({ status })} size={'4'}></Circle>;
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
