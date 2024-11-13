import { cx, sva } from '@styled-system/css';
import {
  ListBox as ListBoxPrimitive,
  ListBoxItem as ListBoxItemPrimitive,
  ListBoxItemProps,
  ListBoxProps,
} from 'react-aria-components';

export interface ListBoxItemData extends Record<string, unknown> {
  label?: string;
  description?: string;
}

const listBoxStyles = sva({
  slots: ['container', 'listItem'],
  base: {
    container: {
      _focusVisible: {
        insetFocusRing: true,
      },
    },
    listItem: {
      px: '2',
      py: '1',
      cursor: 'pointer',
      outline: 'none',
      _focus: {
        bg: 'bg.popover.hover',
      },
      _hover: {
        bg: 'bg.popover.hover',
      },
      _selected: {
        bg: 'bg.accent',
        color: 'fg.accent.contrast',
        _focus: {
          bg: 'bg.accent',
          filter: '[brightness(0.92) saturate(1.1)]',
        },
        _hover: {
          bg: 'bg.accent',
          filter: '[brightness(0.92) saturate(1.1)]',
        },
      },
    },
  },
  variants: {
    isFocusVisible: {
      true: {
        listItem: {
          insetFocusRing: true,
        },
      },
    },
  },
});

function ListBox<T extends ListBoxItemData>({ children, ...props }: ListBoxProps<T>) {
  return (
    <ListBoxPrimitive className={listBoxStyles().container} {...props}>
      {children ?? ((item) => <ListBoxItem {...item}>{item.label ?? ''}</ListBoxItem>)}
    </ListBoxPrimitive>
  );
}

export function ListBoxItem<T extends ListBoxItemData>({
  children,
  ...props
}: ListBoxItemProps<T>) {
  return (
    <ListBoxItemPrimitive
      {...props}
      className={({ isFocusVisible, defaultClassName }) => {
        const { listItem } = listBoxStyles({ isFocusVisible });
        return cx(listItem, defaultClassName);
      }}
    >
      {children}
    </ListBoxItemPrimitive>
  );
}

export default ListBox;
