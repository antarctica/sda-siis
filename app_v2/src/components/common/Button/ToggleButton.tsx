import { cx, RecipeVariantProps } from '@styled-system/css';
import {
  composeRenderProps,
  ToggleButton as ToggleButtonPrimitive,
  TooltipTrigger,
} from 'react-aria-components';

import Tooltip from '../Tooltip';
import { buttonRecipe } from './buttonRecipe';

export type ToggleIconButtonProps = React.ComponentProps<typeof ToggleButtonPrimitive> &
  RecipeVariantProps<typeof buttonRecipe> & {
    className?: string;
  } & {
    icon: React.ReactNode;
    'aria-label': string;
    disableTooltip?: boolean;
    tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';
  };

export function ToggleIconButton({
  icon: Icon,
  className,
  disableTooltip,
  tooltipPlacement,
  ...restProps
}: ToggleIconButtonProps) {
  return (
    <TooltipTrigger delay={800}>
      <ToggleButtonPrimitive
        className={composeRenderProps(className, (className, renderProps) => {
          const [recipeProps] = buttonRecipe.splitVariantProps({ ...restProps, ...renderProps });
          return cx(buttonRecipe({ ...recipeProps, variant: 'outline' }), className);
        })}
        {...restProps}
      >
        {Icon}
      </ToggleButtonPrimitive>
      {!disableTooltip && (
        <Tooltip placement={tooltipPlacement ?? 'right'}>{restProps['aria-label']}</Tooltip>
      )}
    </TooltipTrigger>
  );
}
