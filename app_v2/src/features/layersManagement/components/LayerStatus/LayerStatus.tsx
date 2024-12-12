import { cva, RecipeVariant } from '@styled-system/css';
import { Circle } from '@styled-system/jsx';

import Badge from '@/components/common/Badge';
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

type StatusCircleVariant = RecipeVariant<typeof statusCircleRecipe>['status'];

function getLayerStatusColor(status: LayerStatus): StatusCircleVariant {
  if (!status) {
    return 'static';
  }

  switch (status) {
    case 'error':
    case 'offline':
      return 'error';
    case 'outdated':
      return 'outdated';
    case 'online':
    case 'hr_online':
      return 'online';
    case 'loading':
    case 'hr_pending':
    case 'hr_processing':
    case 'hr_requested':
      return 'loading';
    case 'n/a':
      return 'static';
  }
}

export function LayerStatusCircle({ status }: { status: LayerStatus }) {
  return (
    <Circle
      className={statusCircleRecipe({ status: getLayerStatusColor(status) })}
      size={'2.5'}
    ></Circle>
  );
}

export function LayerStatusBadge({ status = 'n/a' }: { status?: LayerStatus }) {
  if (!status) {
    return null;
  }

  if (status === 'error' || status === 'offline') {
    return <Badge variant="error">{status}</Badge>;
  }

  if (status === 'outdated') {
    return <Badge variant="grey">{status}</Badge>;
  }

  if (status === 'online' || status === 'hr_online') {
    return <Badge variant="success">{status}</Badge>;
  }

  if (
    status === 'loading' ||
    status === 'hr_pending' ||
    status === 'hr_processing' ||
    status === 'hr_requested'
  ) {
    return <Badge variant="warning">{status}</Badge>;
  }

  if (status === 'n/a') {
    return <Badge variant="info">static</Badge>;
  }
}
