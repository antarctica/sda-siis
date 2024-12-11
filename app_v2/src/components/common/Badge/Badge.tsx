import { cva, cx, RecipeVariantProps } from '@styled-system/css';
import * as React from 'react';

import { Text } from '../Typography';

export type BadgeVariant = 'error' | 'info' | 'warning' | 'success' | 'grey';

const badgeRecipe = cva({
  base: {
    display: 'inline-block',
    rounded: 'full',
    px: '2',
    textTransform: 'capitalize',
    fontSize: 'xs',
    fontWeight: 'medium',
  },
  variants: {
    variant: {
      primary: { color: 'fg.accent.contrast', bg: 'app.accent.9' },
      error: { color: 'error.fg', bg: 'error.bg' },
      info: { color: 'info.fg', bg: 'info.bg' },
      warning: { color: 'warning.fg', bg: 'warning.bg' },
      success: { color: 'success.fg', bg: 'success.bg' },
      grey: { color: 'app.grey.12', bg: 'app.grey.a3' },
    },
  },
});

function Badge({
  children,
  variant,
  className,
  ...restProps
}: React.PropsWithChildren<
  RecipeVariantProps<typeof badgeRecipe> & React.ComponentProps<typeof Text>
>) {
  return (
    <Text className={cx(badgeRecipe({ variant }), className)} {...restProps}>
      {children}
    </Text>
  );
}

export default Badge;
