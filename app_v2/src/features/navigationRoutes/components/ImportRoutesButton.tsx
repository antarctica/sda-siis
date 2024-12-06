import { FileTrigger } from 'react-aria-components';

import SvgIcon from '@/components/common/SvgIcon';

import { Button } from '../../../components/common/Button';
import { useRouteImport } from '../hooks/useRouteImport';

export function ImportRouteButton({
  setGraphic,
  mapView,
}: {
  setGraphic: (graphic: __esri.Graphic | undefined) => void;
  mapView: __esri.MapView;
}) {
  const { handleRouteImport } = useRouteImport(setGraphic, mapView);

  const onSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    if (!file) {
      return;
    }
    handleRouteImport(file);
  };

  return (
    <FileTrigger onSelect={onSelect}>
      <Button size="md" variant="outline">
        <SvgIcon name="icon-import" size={16} />
        Import Route
      </Button>
    </FileTrigger>
  );
}
