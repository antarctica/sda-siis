import { cva, cx, RecipeVariantProps } from '@styled-system/css';
import * as React from 'react';

import Typography from '../Typography';

const badgeRecipe = cva({
  base: {
    display: 'inline-block',
    px: '1',
    rounded: 'md',
  },
  variants: {
    variant: {
      error: { bg: 'error.bg', color: 'error.fg' },
      info: { bg: 'info.bg', color: 'info.fg' },
      warning: { bg: 'warning.bg', color: 'warning.fg' },
    },
  },
});

function Badge({
  children,
  variant,
  className,
  ...restProps
}: React.PropsWithChildren<
  RecipeVariantProps<typeof badgeRecipe> & React.ComponentProps<typeof Typography>
>) {
  return (
    <Typography className={cx(badgeRecipe({ variant }), className)} {...restProps}>
      {children}
    </Typography>
  );
}

export default Badge;
