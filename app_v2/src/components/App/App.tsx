import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import { Flex } from '@styled-system/jsx';
import React from 'react';
import { I18nProvider } from 'react-aria-components';
import { Provider as ReduxProvider } from 'react-redux';

import { ArcViewProvider } from '@/arcgis/ArcView/ArcViewContext';
import CoordinateToolsLoader from '@/arcgis/CoordinateToolsLoader';
import { useInitialCRS } from '@/hooks/useInitialCRS';
import useIsMobile from '@/hooks/useIsMobile';
import Drawing from '@/panels/Drawing';
import { Legend, MapLayers } from '@/panels/MapLayers';
import store from '@/store';
import { selectCurrentCRS } from '@/store/features/projectionSlice';
import { useAppSelector } from '@/store/hooks';

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
    type: 'tabbed-panel',
    tabs: [
      {
        id: 'map-layers',
        title: 'Map Layers',
        icon: <SvgIcon name="icon-layers" size={16} />,
        component: () => <MapLayers />,
      },
      {
        id: 'legend',
        title: 'Legend',
        icon: <SvgIcon name="icon-legend-list" size={16} />,
        component: () => <Legend />,
      },
    ],
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
            <CoordinateToolsLoader>
              <ArcViewProvider>
                <LayerManagerProvider>
                  <SideBarProvider items={appPanels}>{children}</SideBarProvider>
                </LayerManagerProvider>
              </ArcViewProvider>
            </CoordinateToolsLoader>
          </ThemeProvider>
        </ReduxProvider>
      </I18nProvider>
    </>
  );
});

function AppContent() {
  const isMobile = useIsMobile();
  useInitialCRS();
  const crs = useAppSelector(selectCurrentCRS);

  if (!crs) {
    return null;
  }

  return (
    <Flex direction={'column'} w={'full'} h={'full'} pointerEvents={'auto'} overflow={'hidden'}>
      <Header />
      <Flex w={'full'} flexGrow={1} minH={'0'}>
        {isMobile ? <Drawer /> : <Sidebar />}
        <Map key={crs} crs={crs} />
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
