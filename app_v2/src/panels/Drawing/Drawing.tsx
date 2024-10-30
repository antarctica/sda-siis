import { today } from '@internationalized/date';
import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';

import { useDrawSingleGraphic } from '@/arcgis/hooks/useDrawSingleGraphic';
import { Button } from '@/components/common/Button';
import { DatePicker, DateRangePicker } from '@/components/common/forms/DatePicker';
import TextField from '@/components/common/forms/TextField/TextField';
import { Select, SelectItem } from '@/components/Select/Select';
import { useSIISMapView } from '@/hooks/useMap';

function Drawing() {
  const mapView = useSIISMapView();
  if (!mapView) return null;
  return (
    <Flex gap="2" direction="column">
      <DrawModeButton mapView={mapView as __esri.MapView} />
      <TextField label="Draw a line" placeholder="Draw a line" />
      <Select label="Select a shape">
        <SelectItem value={{ type: 'line' }}>Line</SelectItem>
        <SelectItem value={{ type: 'point' }}>Point</SelectItem>
        <SelectItem value={{ type: 'polygon' }}>Polygon</SelectItem>
      </Select>
      <DatePicker label="Select a date" maxValue={today('UTC')} />
      <DateRangePicker label="Select a date range" maxRange={{ months: 1 }} />
    </Flex>
  );
}

function DrawModeButton({ mapView }: { mapView: __esri.MapView }) {
  const { create, geometry, activeDrawMode } = useDrawSingleGraphic(mapView);
  console.log(geometry);
  return (
    <Button
      variant={activeDrawMode === 'polyline' ? 'primary' : 'outline'}
      size="lg"
      onPress={() => create('polyline')}
      className={css({ width: 'fit' })}
    >
      Draw Line
    </Button>
  );
}

export default Drawing;
