import * as React from 'react';

import { PanelHeader } from './header/Header';
import { panelStyles } from './panelRecipe';

function Panel({
  children,
  title,
  onClose,
}: React.PropsWithChildren<{
  title: string;
  onClose: () => void;
}>) {
  const { root, panelContent, layout } = panelStyles();

  return (
    <article className={root}>
      <div className={layout}>
        <PanelHeader title={title} onClose={onClose} />
        <div className={panelContent}>{children}</div>
      </div>
    </article>
  );
}

export default Panel;
