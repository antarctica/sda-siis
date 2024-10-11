import { useWatchState } from '@/arcgis/hooks';
import { useViewById } from '@/arcgis/hooks/useViewContext';
import DataGrid from '@/components/DataGrid';

export function ProjectionData() {
  const mapView = useViewById('map');
  // Todo - format scale
  const scale = useWatchState(() => mapView?.scale, [mapView]);

  return (
    <DataGrid
      data={[
        { label: 'PROJECTION', value: 'Antarctic Polar Stereographic' },
        { label: 'VIEW SCALE', value: scale ? `1:${scale}` : '-' },
      ]}
    ></DataGrid>
  );
}
