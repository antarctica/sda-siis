import { useWatchState } from '@/arcgis/hooks';
import DataGrid from '@/components/common/DataGrid';
import { useFormatNumber } from '@/hooks/useFormatNumber';
import { useSIISMapView } from '@/hooks/useMap';

const SPATIAL_REFERENCE_NAMES: Record<string, string> = {
  '3857': 'WGS 1984 Web Mercator',
  '3031': 'Antarctic Polar Stereographic',
  '3413': 'Arctic Polar Stereographic',
};

export function ProjectionData() {
  const mapView = useSIISMapView();
  const scale = useWatchState(() => mapView?.scale, [mapView]);
  const formatScale = useFormatNumber({
    maximumSignificantDigits: 3,
  });
  const mapProjection = useWatchState(() => mapView?.map.basemap.spatialReference, [mapView]);
  return (
    <DataGrid
      data={[
        {
          label: 'PROJECTION',
          value: mapProjection
            ? (SPATIAL_REFERENCE_NAMES[mapProjection.wkid.toString()] ?? '-')
            : '-',
        },
        { label: 'VIEW SCALE', value: scale ? `1:${formatScale.format(scale)}` : '-' },
      ]}
    ></DataGrid>
  );
}
