import { useListData } from '@react-stately/data';
import { css } from '@styled-system/css';
import { Box, Flex, Stack } from '@styled-system/jsx';
import { DialogTrigger, NumberFieldProps } from 'react-aria-components';

import { Button } from '@/components/common/Button';
import NumberField from '@/components/common/forms/NumberField';
import PopoverMenu from '@/components/common/PopoverMenu';
import { Select } from '@/components/common/Select';
import SvgIcon from '@/components/common/SvgIcon';
import { Text, Title } from '@/components/common/Typography';
import { DarkModeSwitch, useTheme } from '@/components/Theme';
import { MeasurementUnit } from '@/features/arcgis/hooks/measurements/types';
import {
  selectDefaultLatLonFormat,
  selectDefaultMeasurementUnit,
  selectLocalTimeOffset,
  setDefaultLatLonFormat,
  setDefaultMeasurementUnit,
  setLocalTimeOffset,
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
      { label: 'Nautical Miles', value: 'nautical-miles', id: 'nautical-miles' },
      { label: 'Miles', value: 'miles', id: 'miles' },
      { label: 'Kilometers', value: 'kilometers', id: 'kilometers' },
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
      { label: 'Degrees Minutes Seconds (DMS)', value: 'DMS', id: 'DMS' },
      { label: 'Degrees Decimal Minutes (DDM)', value: 'DDM', id: 'DDM' },
      { label: 'Decimal Degrees (DD)', value: 'DD', id: 'DD' },
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

function UtcTimeOffsetField(props: NumberFieldProps) {
  const utcTimeOffset = useAppSelector(selectLocalTimeOffset);
  const dispatch = useAppDispatch();
  return (
    <NumberField
      maxValue={14}
      minValue={-12}
      step={1}
      label="Local Time Zone (UTC Hours)"
      value={utcTimeOffset}
      onChange={(value) => dispatch(setLocalTimeOffset(value))}
      {...props}
    />
  );
}

function AppSettingsThemeToggler() {
  const { currentTheme, toggleTheme } = useTheme();
  return (
    <Button
      onPress={() => {
        toggleTheme();
      }}
    >
      <DarkModeSwitch
        moonColor="white"
        sunColor="black"
        checked={currentTheme === 'dark'}
        size={16}
      />{' '}
      Toggle Theme
    </Button>
  );
}

function GlobalSettingsMenu() {
  return (
    <DialogTrigger>
      <Action
        icon={<SvgIcon name="icon-settings" size={20} />}
        aria-label={'Application Settings'}
      />
      <PopoverMenu className={css({ maxWidth: '[calc(100vw - 30px)]', w: 'sm', px: '4', pb: '4' })}>
        <Stack gap="2">
          <Box>
            <Title as="h3" size="lg">
              Application Settings
            </Title>
            <Text margin textStyle="description">
              Customize your application preferences. These settings will persist across browser
              sessions.
            </Text>
          </Box>
          <Flex direction="column" gap="2" mb="2">
            <SelectMeasurementUnit />
            <SelectLatLonFormat />
            <UtcTimeOffsetField />
          </Flex>
          <AppSettingsThemeToggler />
        </Stack>
      </PopoverMenu>
    </DialogTrigger>
  );
}

export default GlobalSettingsMenu;
