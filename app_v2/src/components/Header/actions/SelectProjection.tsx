import React from 'react';
import { DialogTrigger } from 'react-aria-components';

import { SelectionMenuItem, StaticSelectionMenu } from '@/components/common/SelectionMenu';
import SvgIcon from '@/components/common/SvgIcon';
import { Action } from '@/components/Header/actions/Actions';
import { useResetApplicationState } from '@/hooks/useResetApplicationState';
import { useSIISMapView } from '@/hooks/useSIISMapView';
import { selectCurrentCRS, setNewCRS } from '@/store/features/projectionSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { MapCRS } from '@/types';

const items: SelectionMenuItem<MapCRS>[] = [
  {
    label: 'Antarctic',
    id: MapCRS.ANTARCTIC,
    value: MapCRS.ANTARCTIC,
    icon: 'icon-antarctic-globe',
  },
  { label: 'Arctic', value: MapCRS.ARCTIC, id: MapCRS.ARCTIC, icon: 'icon-arctic-globe' },
  { label: 'Mercator', value: MapCRS.MERCATOR, id: MapCRS.MERCATOR, icon: 'icon-met-globe' },
];

export function SelectProjection() {
  const currentCRS = useAppSelector(selectCurrentCRS);
  const dispatch = useAppDispatch();
  const resetApplicationState = useResetApplicationState();
  const mapView = useSIISMapView();

  const updateCRS = React.useCallback(
    (crs: MapCRS) => {
      const extent = mapView?.extent;
      if (!extent) return;
      resetApplicationState();
      dispatch(setNewCRS({ crs, extentJson: extent.toJSON() }));
    },
    [dispatch, resetApplicationState, mapView],
  );

  return (
    <StaticSelectionMenu
      label="Select Projection"
      items={items}
      onSelect={updateCRS}
      defaultSelectedItemId={currentCRS}
      trigger={
        <DialogTrigger>
          <Action icon={<SvgIcon name="icon-globe" size={20} />} aria-label={'Select Projection'} />
        </DialogTrigger>
      }
    />
  );
}
