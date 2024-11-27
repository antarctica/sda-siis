import { RecipeVariantProps, sva } from '@styled-system/css';
import * as React from 'react';
import {
  Dialog as DialogPrimitive,
  Heading as HeadingPrimitive,
  OverlayTriggerStateContext,
} from 'react-aria-components';

import { Button, IconButton } from '../Button';
import SvgIcon from '../SvgIcon';
import { Heading } from '../Typography';

type DialogProps = RecipeVariantProps<typeof dialogRecipe> &
  React.PropsWithChildren<{
    title: string;
    role?: 'dialog' | 'alertdialog';
    hasCloseButton?: boolean;
  }>;

const dialogRecipe = sva({
  slots: ['dialog', 'header', 'content', 'cornerCloseButton', 'footer'],
  base: {
    dialog: {
      position: 'relative',
      py: '6',
      px: '6',
      bg: 'bg.base',
      maxW: 'full',
      outline: 'none',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: '2',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      mt: '4',
    },
    cornerCloseButton: {
      position: 'absolute',
      top: '2',
      right: '2',
    },
  },
  variants: {
    size: {
      sm: {
        dialog: {
          w: 'md',
        },
      },
      md: {
        dialog: {
          w: 'lg',
        },
      },
      lg: {
        dialog: {
          w: 'xl',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

function DialogHeader({ title, hasCloseButton }: { title: string; hasCloseButton: boolean }) {
  const { header, cornerCloseButton } = dialogRecipe();
  const { close } = React.useContext(OverlayTriggerStateContext)!;

  return (
    <div className={header}>
      <HeadingPrimitive slot="title">
        <Heading as="h2" heading="heading-2" margin={false}>
          {title}
        </Heading>
      </HeadingPrimitive>
      {hasCloseButton && (
        <IconButton
          slot="close"
          className={cornerCloseButton}
          aria-label="Close"
          variant="surface"
          size="md"
          icon={<SvgIcon name="icon-x" size={20} />}
          onPress={close}
        />
      )}
    </div>
  );
}

function DialogFooter() {
  const { close } = React.useContext(OverlayTriggerStateContext)!;

  const { footer } = dialogRecipe();
  return (
    <div className={footer}>
      <Button variant="primary" onPress={close}>
        Close
      </Button>
    </div>
  );
}

function Dialog({ title, children, role = 'dialog', hasCloseButton = true, size }: DialogProps) {
  const { dialog, content } = dialogRecipe({ size });
  return (
    <DialogPrimitive role={role} className={dialog}>
      <DialogHeader title={title} hasCloseButton={hasCloseButton} />
      <div className={content}>{children}</div>
      <DialogFooter />
    </DialogPrimitive>
  );
}

export default Dialog;
