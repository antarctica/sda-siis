import { css, cx, sva } from '@styled-system/css';
import * as React from 'react';
import {
  composeRenderProps,
  Dialog,
  OverlayArrow,
  Popover,
  PopoverProps,
} from 'react-aria-components';

const popoverMenuStyles = sva({
  slots: ['root', 'dialog', 'arrow'],
  base: {
    root: {
      borderColor: 'bg.base.border',
      borderRadius: 'sm',
      borderWidth: 'thin',
      bg: 'bg.popover',
      shadow: 'sm',
      borderStyle: 'solid',
      _dark: {
        borderColor: 'app.accent',
        color: 'fg',
        bg: 'bg.base',
      },
      _light: { borderColor: 'app.accent', shadow: 'sm' },
    },
    dialog: {
      outline: 'none',
      p: '2',
    },
    arrow: {
      '[data-placement=top] &': {
        transform: 'rotate(0deg) translate(0, 0)',
      },
      '[data-placement="right"] &': {
        transform: 'rotate(90deg) translate(0, 0)',
      },
      '[data-placement="bottom"] &': {
        transform: 'rotate(180deg) translate(0, 0)',
      },
      '[data-placement="left"] &': {
        transform: 'rotate(-90deg) translate(0, 0)',
      },
    },
  },
});

function PopoverMenu({ children, className, ...props }: React.PropsWithChildren<PopoverProps>) {
  const { root, dialog, arrow } = popoverMenuStyles();
  return (
    <Popover
      className={composeRenderProps(className, (className) => cx(root, className))}
      {...props}
    >
      <OverlayArrow style={{ zIndex: 1000 }}>
        <svg className={arrow} width={12} height={12} viewBox="0 0 8 8">
          {/* Background triangle */}
          <path
            d="M0 0 L4 4 L8 0 Z"
            className={css({
              fill: 'bg.base',
            })}
          />
          {/* Angled sides only */}
          <path
            d="M0 0 L4 4 M4 4 L8 0"
            className={css({
              strokeWidth: '1px',
              stroke: 'fg.accent',
            })}
          />
        </svg>
      </OverlayArrow>
      <Dialog className={dialog}>{children}</Dialog>
    </Popover>
  );
}

export default PopoverMenu;
