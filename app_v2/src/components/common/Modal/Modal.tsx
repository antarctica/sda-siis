import { sva } from '@styled-system/css';
import {
  Modal as ModalPrimitive,
  ModalOverlay as ModalOverlayPrimitive,
  ModalOverlayProps,
} from 'react-aria-components';

const modalRecipe = sva({
  slots: ['overlay', 'modal'],
  base: {
    overlay: {
      position: 'fixed',
      inset: '0',
      isolation: 'isolate',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bg: 'modal.overlay',
      backdropFilter: '[blur(2px)]',
    },
    modal: {
      bg: 'bg.base',
      borderRadius: 'md',
      overflow: 'auto',
      m: '4',
      maxH: 'full',
      maxW: 'full',
      borderColor: 'app.accent',
      borderWidth: 'thin',
    },
  },
});

export default function Modal(props: ModalOverlayProps) {
  const { overlay, modal } = modalRecipe();
  return (
    <ModalOverlayPrimitive {...props} className={overlay}>
      <ModalPrimitive {...props} className={modal} />
    </ModalOverlayPrimitive>
  );
}
