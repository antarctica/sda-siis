import { cva, cx, RecipeVariantProps } from '@styled-system/css';

import { IconButton, IconButtonProps } from './IconButton';

const mapButtonRecipe = cva({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    w: '12',
    h: '12',
    bg: 'bg.base',
  },
  variants: {
    isContainer: {
      true: {
        borderColor: 'bg.base.border',
        borderRadius: 'md',
        borderWidth: 'thin',
        bg: 'bg.base',
        boxShadow: 'md',
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
