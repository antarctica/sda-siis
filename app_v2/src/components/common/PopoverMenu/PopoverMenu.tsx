import { cx, sva } from '@styled-system/css';
import * as React from 'react';
import { composeRenderProps, Dialog, Popover, PopoverProps } from 'react-aria-components';

const popoverMenuStyles = sva({
  slots: ['root', 'dialog'],
  base: {
    root: {
      overflow: 'auto',
      borderColor: 'bg.base.border',
      borderWidth: 'thin',
      borderStyle: 'solid',
      bg: 'bg.popover',
      borderRadius: 'sm',
      shadow: 'sm',
    },
    dialog: {
      p: '2',
    },
  },
});

function PopoverMenu({ children, className, ...props }: React.PropsWithChildren<PopoverProps>) {
  const { root, dialog } = popoverMenuStyles();
  return (
    <Popover
      className={composeRenderProps(className, (className) => cx(root, className))}
      {...props}
    >
      <Dialog className={dialog}>{children}</Dialog>
    </Popover>
  );
}

export default PopoverMenu;
