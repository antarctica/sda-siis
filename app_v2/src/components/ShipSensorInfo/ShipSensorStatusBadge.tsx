import { css } from '@styled-system/css';

import Badge from '@/components/common/Badge';

function ShipSensorStatusBadge({
  variant,
  children,
}: {
  variant: 'error' | 'warning';
  children?: React.ReactNode;
}) {
  return (
    <Badge variant={variant} className={css({ fontSize: 'sm' })}>
      {children ? children : variant === 'error' ? 'Data Error' : 'No Data'}
    </Badge>
  );
}

export default ShipSensorStatusBadge;
