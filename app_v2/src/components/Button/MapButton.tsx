import { cva, cx, RecipeVariantProps } from '@styled-system/css';

import { IconButton, IconButtonProps } from './IconButton';

const mapButtonRecipe = cva({
  base: {
    bg: 'bg.base',
    md: {
      w: '10',
      h: '10',
    },
    mdDown: {
      w: '8',
      h: '8',
    },
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
      variant="mapButton"
      {...props}
      className={cx(mapButtonRecipe({ isContainer }), className)}
    />
  );
}
