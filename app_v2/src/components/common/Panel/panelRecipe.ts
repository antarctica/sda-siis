import { sva } from '@styled-system/css';

export const panelStyles = sva({
  slots: ['root', 'layout', 'header', 'panelContent'],
  base: {
    root: {
      width: 'md',
      height: 'full',
      bg: 'bg.panel',
      _dark: {
        borderRightWidth: 'thin',
        borderRightColor: 'bg.base.border',
        borderRightStyle: 'solid',
      },
    },
    layout: {
      display: 'flex',
      flexDirection: 'column',
      h: 'full',
      overflowX: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 'thin',
      borderBottomColor: 'bg.base.border',
      px: '3',
      borderBottomStyle: 'solid',
    },
    panelContent: {
      flexGrow: 1,
      minH: '0',
      p: '4',
      pb: '8',
      overflowX: 'hidden',
      overflowY: 'auto',
    },
  },
});
