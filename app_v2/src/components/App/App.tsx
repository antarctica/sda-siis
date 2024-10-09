import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import { Flex } from '@styled-system/jsx';

import { Map } from '../Map/Map';
import Sidebar from '../Sidebar';
import { SideBarProvider } from '../Sidebar/SideBarProvider';
import { SidebarItem } from '../Sidebar/types';
import SvgIcon from '../SvgIcon';
import { ThemeProvider } from '../Theme/ThemeContext';

const testItems: SidebarItem[] = [
  {
    id: '1',
    title: 'Item 1',
    icon: <SvgIcon name="icon-zoom-to" size={16} />,
    position: 'top',
    type: 'panel',
    component: () => <div>Panel 1</div>,
  },
  {
    id: '2',
    title: 'Item 2',
    icon: <SvgIcon name="icon-search-globe" size={16} />,
    position: 'top',
    type: 'panel',
    component: () => <div>Panel 2</div>,
  },
];

export function App() {
  return (
    <>
      <ThemeProvider>
        <SideBarProvider items={testItems}>
          <Flex w={'full'} h={'full'}>
            <Sidebar></Sidebar>
            <Map></Map>
          </Flex>
        </SideBarProvider>
      </ThemeProvider>
    </>
  );
}
