import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import React, { ComponentProps } from 'react';
import { DialogTrigger } from 'react-aria-components';
import { Key, useListData } from 'react-stately';

import SvgIcon from '@/components/common/SvgIcon';
import ListBox, { ListBoxItem, ListBoxItemData } from '@/components/ListBox';
import PopoverMenu from '@/components/PopoverMenu/PopoverMenu';

export interface SelectionMenuItem<T> extends ListBoxItemData {
  id: Key;
  label: string;
  value: T;
  icon?: ComponentProps<typeof SvgIcon>['name'];
}

interface SelectionMenuProps<T> {
  items: SelectionMenuItem<T>[];
  onSelect?: (value: T) => void;
  defaultSelectedItemId?: Key;
  trigger: React.ReactNode;
}

export function SelectionMenu<T>({
  items,
  onSelect,
  defaultSelectedItemId,
  trigger,
}: SelectionMenuProps<T>) {
  const [open, setOpen] = React.useState(false);

  const listData = useListData({
    initialItems: items,
    initialSelectedKeys: defaultSelectedItemId ? [defaultSelectedItemId] : undefined,
    getKey: (item) => item.id,
  });

  const onSelectItem = React.useCallback(
    (itemId: Key) => {
      const selectedItem = listData.getItem(itemId);
      onSelect?.(selectedItem.value);
      setOpen(false);
    },
    [listData, onSelect],
  );

  return (
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      {trigger}
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
          onSelectionChange={(selection) => {
            if (selection instanceof Set && selection.size === 0) {
              setOpen(false);
            }
            const selectedItemId = Array.from(selection)[0];

            listData.setSelectedKeys(selection);

            if (selectedItemId) {
              onSelectItem(selectedItemId);
            }
          }}
        >
          {(item) => (
            <ListBoxItem key={item.id} id={item.id}>
              <Flex alignItems={'center'} display={'inline-flex'} gap={'2'}>
                {item.icon && <SvgIcon name={item.icon} size={20} />}
                {item.label}
              </Flex>
            </ListBoxItem>
          )}
        </ListBox>
      </PopoverMenu>
    </DialogTrigger>
  );
}

export default SelectionMenu;
