import { useListData } from '@react-stately/data';
import { Flex } from '@styled-system/jsx';
import { DialogTrigger } from 'react-aria-components';

import { MeasurementUnit } from '@/arcgis/hooks/measurements/types';
import PopoverMenu from '@/components/common/PopoverMenu';
import { Select } from '@/components/common/Select';
import SvgIcon from '@/components/common/SvgIcon';
import {
  selectDefaultLatLonFormat,
  selectDefaultMeasurementUnit,
  setDefaultLatLonFormat,
  setDefaultMeasurementUnit,
} from '@/store/features/appSlice';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { LatLonFormat } from '@/types';

import { Action } from '../Actions';

function SelectMeasurementUnit() {
  const measurementUnit = useAppSelector(selectDefaultMeasurementUnit);
  const dispatch = useAppDispatch();

  const selectItems = useListData({
    initialItems: [
      { label: 'Kilometers', value: 'kilometers', id: 'kilometers' },
      { label: 'Miles', value: 'miles', id: 'miles' },
      { label: 'Nautical Miles', value: 'nautical-miles', id: 'nautical-miles' },
    ],
    initialSelectedKeys: [measurementUnit],
    getKey: (item) => item.id,
  });

  return (
    <Select
      label="Measurement Unit"
      items={selectItems.items}
      selectedKey={measurementUnit}
      onSelectionChange={(key) => dispatch(setDefaultMeasurementUnit(key as MeasurementUnit))}
    ></Select>
  );
}

function SelectLatLonFormat() {
  const latLonFormat = useAppSelector(selectDefaultLatLonFormat);
  const dispatch = useAppDispatch();

  const selectItems = useListData<{ label: string; value: LatLonFormat; id: LatLonFormat }>({
    initialItems: [
      { label: 'Decimal Degrees (DD)', value: 'DD', id: 'DD' },
      { label: 'Degrees Decimal Minutes (DDM)', value: 'DDM', id: 'DDM' },
      { label: 'Degrees Minutes Seconds (DMS)', value: 'DMS', id: 'DMS' },
    ],
    initialSelectedKeys: [latLonFormat],
    getKey: (item) => item.id,
  });

  return (
    <Select
      label="Latitude/Longitude Format"
      items={selectItems.items}
      selectedKey={latLonFormat}
      onSelectionChange={(key) => dispatch(setDefaultLatLonFormat(key as LatLonFormat))}
    ></Select>
  );
}

function GlobalSettingsMenu() {
  return (
    <DialogTrigger>
      <Action
        icon={<SvgIcon name="icon-settings" size={20} />}
        aria-label={'Application Settings'}
      />
      <PopoverMenu>
        <Flex direction="column">
          <SelectMeasurementUnit />
          <SelectLatLonFormat />
        </Flex>
      </PopoverMenu>
    </DialogTrigger>
  );
}

export default GlobalSettingsMenu;
