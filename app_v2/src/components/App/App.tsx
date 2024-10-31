import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import { Flex } from '@styled-system/jsx';
import React from 'react';
import { I18nProvider } from 'react-aria-components';
import { Provider as ReduxProvider } from 'react-redux';

import { ArcViewProvider } from '@/arcgis/ArcView/ArcViewContext';
import { ProjectionProvider } from '@/arcgis/projection/ProjectionProvider';
import useIsMobile from '@/hooks/useIsMobile';
import Drawing from '@/panels/Drawing';
import MapLayers from '@/panels/MapLayers';
import store from '@/store';

import SvgIcon from '../common/SvgIcon';
import Drawer from '../Drawer';
import Header from '../Header';
import { LayerManagerProvider } from '../LayerManager/LayerManagerProvider';
import { Map } from '../Map/Map';
import Sidebar from '../Sidebar';
import { SideBarProvider } from '../Sidebar/SideBarProvider';
import { SidebarItem } from '../Sidebar/types';
import { ThemeProvider } from '../Theme/ThemeContext';

const appPanels: SidebarItem[] = [
  {
    id: 'map-layers',
    title: 'Map Layers',
    icon: <SvgIcon name="icon-layers" size={16} />,
    position: 'top',
    type: 'panel',
    component: () => <MapLayers />,
  },
  {
    id: 'drawing',
    title: 'Drawing',
    icon: <SvgIcon name="icon-map-polyline" size={16} />,
    position: 'top',
    type: 'panel',
    component: () => <Drawing />,
  },
];

const Providers = React.memo(({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <I18nProvider locale={'en-GB'}>
        <ReduxProvider store={store}>
          <ThemeProvider>
            <ProjectionProvider>
              <ArcViewProvider>
                <LayerManagerProvider>
                  <SideBarProvider items={appPanels}>{children}</SideBarProvider>
                </LayerManagerProvider>
              </ArcViewProvider>
            </ProjectionProvider>
          </ThemeProvider>
        </ReduxProvider>
      </I18nProvider>
    </>
  );
});

function AppContent() {
  const isMobile = useIsMobile();
  return (
    <Flex direction={'column'} w={'full'} h={'full'} pointerEvents={'auto'}>
      <Header />
      <Flex w={'full'} flexGrow={1} minH={'0'}>
        {isMobile ? <Drawer /> : <Sidebar />}
        <Map />
      </Flex>
    </Flex>
  );
}

export function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
