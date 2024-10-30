import { useViewById } from '@/arcgis/hooks';
import { MAP_ID } from '@/config/constants';

export function useSIISMapView() {
  return useViewById(MAP_ID) as __esri.MapView;
}
