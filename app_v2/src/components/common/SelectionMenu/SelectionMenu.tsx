import { css, cx } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import React, { ComponentProps } from 'react';
import { DialogTrigger } from 'react-aria-components';
import { Key, ListData, useListData } from 'react-stately';

import ListBox, { ListBoxItem, ListBoxItemData } from '@/components/common/ListBox';
import PopoverMenu from '@/components/common/PopoverMenu/PopoverMenu';
import SvgIcon from '@/components/common/SvgIcon';

export interface SelectionMenuItem<T> extends ListBoxItemData {
  id: Key;
  label: string;
  value: T;
  icon?: ComponentProps<typeof SvgIcon>['name'];
}

interface SelectionMenuProps<T> {
  listData: ListData<SelectionMenuItem<T>>;
  onSelect?: (value: T) => void;
  defaultSelectedItemId?: Key;
  trigger: React.ReactNode;
  className?: string;
  label: string;
  isActionMenu?: boolean;
}

export function SelectionMenu<T>({
  listData,
  onSelect,
  trigger,
  className,
  label,
  isActionMenu = false,
}: SelectionMenuProps<T>) {
  const [open, setOpen] = React.useState(false);

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
        className={cx(
          css({
            w: '60',
          }),
          className,
        )}
      >
        <ListBox
          className={css({
            outline: 'none',
          })}
          autoFocus
          aria-label={label}
          items={listData.items}
          selectionMode="single"
          selectionBehavior="toggle"
          selectedKeys={isActionMenu ? undefined : listData.selectedKeys}
          onSelectionChange={(selection) => {
            if (selection instanceof Set && selection.size === 0) {
              setOpen(false);
              return;
            }
            const selectedItemId = Array.from(selection)[0];

            listData.setSelectedKeys(selection);

            if (selectedItemId) {
              onSelectItem(selectedItemId);
            }
          }}
        >
          {(item) => (
            <ListBoxItem key={item.id} id={item.id} aria-label={item.label}>
              <Flex display={'inline-flex'} gap={'2'} verticalAlign={'middle'}>
                {item.icon && (
                  <SvgIcon
                    className={css({
                      alignSelf: 'center',
                    })}
                    name={item.icon}
                    size={20}
                  />
                )}
                {item.label}
              </Flex>
            </ListBoxItem>
          )}
        </ListBox>
      </PopoverMenu>
    </DialogTrigger>
  );
}

interface StaticSelectionMenuProps<T> extends Omit<SelectionMenuProps<T>, 'listData'> {
  items: SelectionMenuItem<T>[];
}

export function StaticSelectionMenu<T>({
  items,
  onSelect,
  defaultSelectedItemId,
  trigger,
  label,
  isActionMenu = false,
}: StaticSelectionMenuProps<T>) {
  const listData = useListData({
    initialItems: items,
    initialSelectedKeys: defaultSelectedItemId ? [defaultSelectedItemId] : undefined,
    getKey: (item) => item.id,
  });
  return (
    <SelectionMenu
      listData={listData}
      onSelect={onSelect}
      trigger={trigger}
      label={label}
      isActionMenu={isActionMenu}
    />
  );
}
