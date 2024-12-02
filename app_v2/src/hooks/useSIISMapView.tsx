import { MAP_ID } from '@/config/constants';
import { useViewById } from '@/features/arcgis/hooks';

export function useSIISMapView() {
  return useViewById(MAP_ID) as __esri.MapView | undefined;
}
