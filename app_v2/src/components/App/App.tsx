import '@arcgis/core/assets/esri/themes/light/main.css?inline';

import { Flex } from '@styled-system/jsx';

import { useInitialCRS } from '@/hooks/useInitialCRS';
import useIsMobile from '@/hooks/useIsMobile';
import { selectCurrentCRS } from '@/store/features/projectionSlice';
import { useAppSelector } from '@/store/hooks';

import Drawer from '../common/Drawer';
import Header from '../Header';
import { Map } from '../Map/Map';
import Sidebar from '../Sidebar';
import { Providers } from './Providers';

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
