import SvgIcon from '@/components/common/SvgIcon';
import { SidebarItem } from '@/components/Sidebar/types';
import { Legend, MapLayers } from '@/features/layersManagement/components/Panel';
import Measure from '@/features/measurements/Measure';
import Routes from '@/features/navigationRoutes';

export const appPanels: SidebarItem[] = [
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
    id: 'routes',
    title: 'Routes',
    icon: <SvgIcon name="icon-map-polyline" size={16} />,
    position: 'top',
    type: 'panel',
    component: () => <Routes />,
  },
  {
    id: 'measurement',
    title: 'Measure',
    icon: <SvgIcon name="icon-measure" size={16} />,
    position: 'top',
    type: 'panel',
    component: () => <Measure />,
  },
];
