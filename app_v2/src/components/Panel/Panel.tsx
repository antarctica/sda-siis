import { sva } from '@styled-system/css';
import * as React from 'react';

import { Button } from '../Button';
import { useSidebarActorRef } from '../Sidebar/SidebarHooks';
import SvgIcon from '../SvgIcon';
import { HeaderAction } from './header/Action';

const panelStyles = sva({
  slots: ['root', 'header', 'content'],
  base: {
    root: {
      bg: 'bg.panel',
      height: 'full',
      width: '[400px]',
      _light: {
        shadow: '2xl',
      },
      _dark: {
        borderRightWidth: 'thin',
        borderRightStyle: 'solid',
        borderRightColor: 'bg.base.border',
      },
    },
    header: {
      p: '4',
      fontSize: 'lg',
      borderBottomWidth: 'thin',
      borderBottomStyle: 'solid',
      borderBottomColor: 'bg.base.border',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 'semibold',
    },
    content: {
      p: '4',
    },
  },
});

function Panel({
  children,
  title,
}: React.PropsWithChildren<{
  title: string;
}>) {
  const { root, header, content } = panelStyles();

  const sidebarActor = useSidebarActorRef();

  return (
    <article className={root}>
      <header className={header}>
        <h2>{title}</h2>
        <div>
          <HeaderAction
            onClick={() => {
              sidebarActor.send({ type: 'ITEMS.CLOSE_ALL' });
            }}
            title="Close"
            icon={<SvgIcon size={20} name="icon-x"></SvgIcon>}
          ></HeaderAction>
        </div>
      </header>
      <div className={content}>
        <div>
          <Button size="sm" variant="surface">
            Button
          </Button>
          <Button size="md" variant="surface">
            Button
          </Button>
          <Button size="lg" variant="surface">
            Button
          </Button>
        </div>
        {children}
      </div>
    </article>
  );
}

export default Panel;
