import { css, RecipeVariantProps, sva } from '@styled-system/css';
import * as React from 'react';
import {
  Dialog as DialogPrimitive,
  Heading as HeadingPrimitive,
  OverlayTriggerStateContext,
} from 'react-aria-components';

import { IconButton } from '../Button';
import SvgIcon from '../SvgIcon';
import { Text } from '../Typography';

type DialogProps = RecipeVariantProps<typeof dialogRecipe> &
  React.PropsWithChildren<{
    title: string;
    role?: 'dialog' | 'alertdialog';
    hasCloseButton?: boolean;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
  }>;

const dialogRecipe = sva({
  slots: ['dialog', 'header', 'title', 'content', 'cornerCloseButton', 'footer'],
  base: {
    dialog: {
      position: 'relative',
      py: '6',
      px: '6',
      bg: 'bg.base',
      maxW: 'full',
      outline: 'none',
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: '4',
    },
    footer: {
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

function DialogHeader({
  title,
  hasCloseButton,
  icon,
}: {
  title: string;
  hasCloseButton: boolean;
  icon?: React.ReactNode;
}) {
  const { header, cornerCloseButton, title: titleClassName } = dialogRecipe();
  const { close } = React.useContext(OverlayTriggerStateContext)!;

  return (
    <div className={header}>
      <HeadingPrimitive slot="title" className={titleClassName}>
        {icon}
        <Text as="span" className={css({ textStyle: 'heading1' })} margin={false}>
          {title}
        </Text>
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

function DialogFooter({ children }: React.PropsWithChildren) {
  const { footer } = dialogRecipe();
  return <div className={footer}>{children}</div>;
}

function Dialog({
  title,
  children,
  role = 'dialog',
  hasCloseButton = true,
  size,
  icon,
  footer,
}: DialogProps) {
  const { dialog, content } = dialogRecipe({ size });
  return (
    <DialogPrimitive role={role} className={dialog}>
      <DialogHeader title={title} hasCloseButton={hasCloseButton} icon={icon} />
      <div className={content}>{children}</div>
      {footer && <DialogFooter>{footer}</DialogFooter>}
    </DialogPrimitive>
  );
}

export default Dialog;
