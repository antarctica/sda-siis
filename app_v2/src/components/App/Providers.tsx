import React from 'react';
import { I18nProvider } from 'react-aria-components';
import { Provider as ReduxProvider } from 'react-redux';

import { ArcViewProvider } from '@/arcgis/ArcView/ArcViewContext/ArcViewProvider';
import GeometryToolsLoader from '@/arcgis/GeometryToolsLoader';
import { appPanels } from '@/config/panelItems';
import store from '@/store';

import { LayerManagerProvider } from '../LayerManager/LayerManagerProvider';
import { SideBarProvider } from '../Sidebar/SideBarProvider';
import { ThemeProvider } from '../Theme/ThemeProvider';

export const Providers = React.memo(({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <I18nProvider locale={'en-GB'}>
        <ReduxProvider store={store}>
          <ThemeProvider>
            <GeometryToolsLoader>
              <ArcViewProvider>
                <LayerManagerProvider>
                  <SideBarProvider items={appPanels}>{children}</SideBarProvider>
                </LayerManagerProvider>
              </ArcViewProvider>
            </GeometryToolsLoader>
          </ThemeProvider>
        </ReduxProvider>
      </I18nProvider>
    </>
  );
});
