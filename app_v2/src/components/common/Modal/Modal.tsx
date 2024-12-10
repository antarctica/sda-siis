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
      display: 'flex',
      position: 'fixed',
      inset: '0',
      justifyContent: 'center',
      alignItems: 'center',
      bg: 'modal.overlay',
      backdropFilter: '[blur(2px)]',
      isolation: 'isolate',
    },
    modal: {
      borderColor: 'app.accent',
      borderRadius: 'md',
      borderWidth: 'thin',
      maxW: 'full',
      maxH: 'full',
      m: '4',
      bg: 'bg.base',
      overflow: 'auto',
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
