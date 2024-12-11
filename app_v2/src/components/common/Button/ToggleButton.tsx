import { cx } from '@styled-system/css';
import { ButtonVariantProps } from '@styled-system/recipes';
import { button } from '@styled-system/recipes/button.mjs';
import {
  composeRenderProps,
  ToggleButton as ToggleButtonPrimitive,
  TooltipTrigger,
} from 'react-aria-components';

import Tooltip from '../Tooltip';

export type ToggleIconButtonProps = React.ComponentProps<typeof ToggleButtonPrimitive> &
  ButtonVariantProps & {
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
          const [recipeProps] = button.splitVariantProps({ ...restProps, ...renderProps });
          return cx(button({ ...recipeProps, variant: 'outline' }), className);
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

export type ToggleButtonProps = React.ComponentProps<typeof ToggleButtonPrimitive> &
  ButtonVariantProps & {
    className?: string;
  };

export function ToggleButton({ className, ...restProps }: ToggleButtonProps) {
  return (
    <ToggleButtonPrimitive
      className={composeRenderProps(className, (className, renderProps) => {
        const [recipeProps] = button.splitVariantProps({ ...restProps, ...renderProps });
        return cx(button({ ...recipeProps, variant: 'outline' }), className);
      })}
      {...restProps}
    />
  );
}
