import { cva, cx, RecipeVariantProps } from '@styled-system/css';
import * as React from 'react';

import { Text } from '../Typography';

export type BadgeVariant = 'error' | 'info' | 'warning' | 'success' | 'grey';

const badgeRecipe = cva({
  base: {
    display: 'inline-block',
    px: '1',
    rounded: 'md',
    fontSize: 'xs',
    textTransform: 'capitalize',
  },
  variants: {
    variant: {
      primary: { bg: 'app.accent.9', color: 'fg.accent.contrast' },
      error: { bg: 'error.bg', color: 'error.fg' },
      info: { bg: 'info.bg', color: 'info.fg' },
      warning: { bg: 'warning.bg', color: 'warning.fg' },
      success: { bg: 'success.bg', color: 'success.fg' },
      grey: { bg: 'app.grey.8', color: 'app.grey.12' },
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
