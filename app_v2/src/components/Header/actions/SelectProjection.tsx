import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import React, { ComponentProps } from 'react';
import { DialogTrigger, Selection } from 'react-aria-components';
import { useListData } from 'react-stately';

import SvgIcon from '@/components/common/SvgIcon';
import { Action } from '@/components/Header/actions/Actions';
import { LayerManagerContext } from '@/components/LayerManager/LayerManagerProvider';
import ListBox, { ListBoxItem } from '@/components/ListBox';
import PopoverMenu from '@/components/PopoverMenu/PopoverMenu';
import { selectCurrentCRS, setCurrentCRS } from '@/store/features/projectionSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { MapCRS } from '@/types';

const items: { label: string; value: MapCRS; icon: ComponentProps<typeof SvgIcon>['name'] }[] = [
  {
    label: 'Antarctic',
    value: MapCRS.ANTARCTIC,
    icon: 'icon-antarctic-globe',
  },
  { label: 'Arctic', value: MapCRS.ARCTIC, icon: 'icon-arctic-globe' },
  { label: 'Mercator', value: MapCRS.MERCATOR, icon: 'icon-met-globe' },
];

export function SelectProjection() {
  const currentCRS = useAppSelector(selectCurrentCRS);
  const dispatch = useAppDispatch();
  const layerManager = LayerManagerContext.useActorRef();
  const listData = useListData({
    initialItems: items,
    initialSelectedKeys: currentCRS ? [currentCRS] : undefined,
    getKey: (item) => item.value,
  });
  const [open, setOpen] = React.useState(false);

  const updateCRS = React.useCallback(
    (crs: MapCRS) => {
      dispatch(setCurrentCRS(crs));
      layerManager.send({ type: 'RESET' });
      setOpen(false);
    },
    [dispatch, layerManager],
  );

  return (
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      <Action icon={<SvgIcon name="icon-globe" size={20} />} aria-label={'Select Projection'} />
      <PopoverMenu
        className={css({
          w: '60',
        })}
      >
        <ListBox
          autoFocus
          className={css({
            outline: 'none',
          })}
          items={listData.items}
          selectionMode="single"
          selectionBehavior="toggle"
          selectedKeys={listData.selectedKeys}
          onSelectionChange={(selection: Selection) => {
            const selectedCRS = Array.from(selection)[0];
            if ((selection !== 'all' && selection.size === 0) || selectedCRS === currentCRS) {
              setOpen(false);
              return;
            }

            listData.setSelectedKeys(selection);

            if (selectedCRS) {
              updateCRS(listData.getItem(selectedCRS).value);
            }
          }}
        >
          {(item) => (
            <ListBoxItem key={item.value} id={item.value}>
              <Flex alignItems={'center'} display={'inline-flex'} gap={'2'}>
                <SvgIcon name={item.icon} size={20} className={css({})} />
                {item.label}
              </Flex>
            </ListBoxItem>
          )}
        </ListBox>
      </PopoverMenu>
    </DialogTrigger>
  );
}
