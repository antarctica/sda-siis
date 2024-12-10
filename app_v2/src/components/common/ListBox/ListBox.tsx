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
      outline: 'none',
      py: '1',
      px: '2',
      cursor: 'pointer',
      _selected: {
        color: 'fg.accent.contrast',
        bg: 'bg.accent',
        _focus: {
          bg: 'bg.accent',
          filter: '[brightness(0.92) saturate(1.1)]',
        },
        _hover: {
          bg: 'bg.accent',
          filter: '[brightness(0.92) saturate(1.1)]',
        },
      },
      _focus: {
        bg: 'bg.popover.hover',
      },
      _hover: {
        bg: 'bg.popover.hover',
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
      {children ?? ((item) => <ListBoxItem>{item.label ?? ''}</ListBoxItem>)}
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
