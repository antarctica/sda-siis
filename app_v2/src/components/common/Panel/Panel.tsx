import * as React from 'react';
import { TabPanel, Tabs } from 'react-aria-components';

import { PanelTab } from '../Sidebar/types';
import { PanelHeader } from './header/Header';
import { panelStyles } from './panelRecipe';

function Panel({
  children,
  title,
  onClose,
  tabs,
  style,
}: React.PropsWithChildren<{
  title: string;
  tabs?: PanelTab[];
  onClose: () => void;
  style?: React.CSSProperties;
}>) {
  const { root, panelContent, layout } = panelStyles();

  const hasTabs = tabs?.length;
  const Wrapper = hasTabs ? Tabs : 'div';
  const wrapperProps = hasTabs ? { keyboardActivation: 'manual' as const } : {};

  return (
    <article className={root} style={style}>
      <Wrapper className={layout} {...wrapperProps}>
        <PanelHeader title={title} tabs={tabs} onClose={onClose} />
        {hasTabs ? (
          tabs.map(({ component: Content, id }) => (
            <TabPanel key={id} id={id} className={panelContent}>
              <Content />
            </TabPanel>
          ))
        ) : (
          <div className={panelContent}>{children}</div>
        )}
      </Wrapper>
    </article>
  );
}

export default Panel;
