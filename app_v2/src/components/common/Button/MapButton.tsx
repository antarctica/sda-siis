import { cva, cx, RecipeVariantProps } from '@styled-system/css';

import { IconButton, IconButtonProps } from './IconButton';

const mapButtonRecipe = cva({
  base: {
    bg: 'bg.base',
    w: '12',
    h: '12',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  variants: {
    isContainer: {
      true: {
        boxShadow: 'md',
        bg: 'bg.base',
        borderColor: 'bg.base.border',
        borderWidth: 'thin',
        borderRadius: 'md',
      },
    },
  },
  defaultVariants: {
    isContainer: true,
  },
});

export function MapButton({
  className,
  isContainer,
  ...props
}: IconButtonProps & RecipeVariantProps<typeof mapButtonRecipe>) {
  return (
    <IconButton
      contained
      variant="mapButton"
      {...props}
      className={cx(mapButtonRecipe({ isContainer }), className)}
    />
  );
}
