import { sva } from '@styled-system/css';

export const panelStyles = sva({
  slots: ['root', 'layout', 'header', 'panelContent'],
  base: {
    root: {
      bg: 'bg.panel',
      height: 'full',
      width: 'md',
      _dark: {
        borderRightWidth: 'thin',
        borderRightStyle: 'solid',
        borderRightColor: 'bg.base.border',
      },
    },
    layout: {
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      h: 'full',
    },
    header: {
      p: '3',
      borderBottomWidth: 'thin',
      borderBottomStyle: 'solid',
      borderBottomColor: 'bg.base.border',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    panelContent: {
      p: '4',
      flexGrow: 1,
      overflowY: 'auto',
      minH: '0',
    },
  },
});
