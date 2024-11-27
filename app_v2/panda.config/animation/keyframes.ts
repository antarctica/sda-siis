import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  slideInTop: {
    from: { transform: 'translateY(-10px)' },
    to: { transform: 'translateY(0)' },
  },
  slideOutTop: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(-10px)' },
  },
  slideInRight: {
    from: { transform: 'translateX(10px)' },
    to: { transform: 'translateX(0)' },
  },
  slideOutRight: {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(10px)' },
  },
  slideInLeft: {
    from: { transform: 'translateX(-10px)' },
    to: { transform: 'translateX(0)' },
  },
  slideOutLeft: {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(-10px)' },
  },
  slideInBottom: {
    from: { transform: 'translateY(10px)' },
    to: { transform: 'translateY(0)' },
  },
  slideOutBottom: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(10px)' },
  },
});
