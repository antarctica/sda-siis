import React from 'react';
import { DialogTrigger } from 'react-aria-components';

import SvgIcon from '@/components/common/SvgIcon';
import { Action } from '@/components/Header/actions/Actions';
import SelectionMenu, { SelectionMenuItem } from '@/components/SelectionMenu/SelectionMenu';
import { useResetApplicationState } from '@/hooks/useResetApplicationState';
import { selectCurrentCRS, setCurrentCRS } from '@/store/features/projectionSlice';
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
  const [open, setOpen] = React.useState(false);

  const updateCRS = React.useCallback(
    (crs: MapCRS) => {
      dispatch(setCurrentCRS(crs));
      resetApplicationState();
    },
    [dispatch, resetApplicationState],
  );

  return (
    <SelectionMenu
      items={items}
      onSelect={updateCRS}
      defaultSelectedItemId={currentCRS}
      trigger={
        <DialogTrigger isOpen={open} onOpenChange={setOpen}>
          <Action icon={<SvgIcon name="icon-globe" size={20} />} aria-label={'Select Projection'} />
        </DialogTrigger>
      }
    ></SelectionMenu>
  );
}
