import { cx, sva } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { motion } from 'framer-motion';
import * as React from 'react';

import { IconButton } from '@/components/common/Button';

import SvgIcon from '../SvgIcon';
import { Title } from '../Typography';

interface MobileSideDialogProps {
  isOpen: boolean;
  title?: string;
  animate?: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  isModal?: boolean;
  footer?: React.ComponentType | React.FunctionComponent;
  className?: string;
}

const dialogRecipe = sva({
  slots: ['root', 'closeBtn', 'header', 'content', 'footer'],
  base: {
    root: {
      position: 'fixed',
      top: '0',
      left: '0',
      height: 'full',
      color: 'fg',
      bg: 'bg.base',
      pointerEvents: 'auto',
    },
    closeBtn: {
      position: 'absolute',
      top: '2',
      right: '2',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      p: '4',
    },
    content: {
      flex: '1',
      py: '4',
      px: '8',
      overflowY: 'auto',
    },
    footer: {
      p: '4',
    },
  },
});

function MobileDialog({
  isOpen,
  title,
  hasCloseBtn = true,
  animate = true,
  onClose,
  children,
  footer: Footer,
  isModal = true,
  className,
}: React.PropsWithChildren<MobileSideDialogProps>) {
  const modalRef = React.useRef<HTMLDialogElement | null>(null);

  const getDialogRef = React.useCallback((node: HTMLDialogElement | null) => {
    if (node !== null) {
      modalRef.current = node;
      if (isOpen) {
        node.showModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleVisibility = React.useCallback(
    (visible: boolean) => {
      const modalElement = modalRef.current;
      if (modalElement) {
        if (visible) {
          if (isModal) {
            modalElement.showModal();
          } else {
            modalElement.show();
          }
        } else {
          if (onClose) {
            onClose();
          }
          modalElement.close();
        }
      }
    },
    [onClose, isModal],
  );

  React.useEffect(() => {
    toggleVisibility(isOpen);
  }, [isOpen, toggleVisibility]);

  const { root, closeBtn, header, content, footer } = dialogRecipe({ className });

  return (
    <motion.dialog
      ref={getDialogRef}
      onClose={() => toggleVisibility(false)}
      animate={animate ? { width: isOpen ? '100%' : '50%', opacity: isOpen ? 1 : 0.8 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 460,
        damping: 35,
        restDelta: 0.01,
      }}
      className={cx(root, className)}
    >
      {hasCloseBtn && (
        <IconButton
          className={cx(closeBtn)}
          variant="surface"
          onPress={() => toggleVisibility(false)}
          icon={<SvgIcon size={16} name="icon-x" />}
          aria-label={'Close'}
        ></IconButton>
      )}
      <Flex flexDirection="column" alignItems="stretch">
        {title && (
          <div className={cx(header)}>
            <Title as="h2" size="lg">
              {title}
            </Title>
          </div>
        )}
        <div className={cx(content)}>{children}</div>
        {Footer && (
          <div className={cx(footer)}>
            <Footer />
          </div>
        )}
      </Flex>
    </motion.dialog>
  );
}
export default MobileDialog;
