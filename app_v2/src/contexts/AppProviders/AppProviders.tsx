import React from 'react';
import { I18nProvider } from 'react-aria-components';
import { Provider as ReduxProvider } from 'react-redux';

import { SideBarProvider } from '@/components/Sidebar/SideBarProvider';
import { appPanels } from '@/config/panelItems';
import { ThemeProvider } from '@/contexts/Theme/ThemeProvider';
import GeometryToolsLoader from '@/features/arcgis/components/GeometryToolsLoader';
import { ArcViewProvider } from '@/features/arcgis/contexts/ArcViewContext/ArcViewProvider';
import { LayerManagerProvider } from '@/features/mapLayers/components/LayerManager/LayerManagerProvider';
import store from '@/store';

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
