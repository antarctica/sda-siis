import { css, cx, sva } from '@styled-system/css';
import React from 'react';
import type { ListBoxItemProps, SelectProps, ValidationResult } from 'react-aria-components';
import {
  Button,
  composeRenderProps,
  FieldError,
  ListBox,
  ListBoxItem,
  Popover,
  Select as SelectPrimitive,
  SelectStateContext,
  SelectValue,
  Text,
} from 'react-aria-components';

import { FieldGroup, Label } from '../common/forms/Field';
import SvgIcon from '../common/SvgIcon';

interface ISelectProps<T extends object> extends Omit<SelectProps<T>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

const selectRecipe = sva({
  slots: ['root', 'popover', 'dropdownContainer', 'fieldGroup', 'button', 'selectItem'],
  base: {
    root: {
      w: 'full',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
    },
    popover: {
      maxHeight: '60',
      width: '[var(--trigger-width)]',
      overflow: 'auto',
      borderColor: 'bg.base.border',
      borderWidth: 'thin',
      borderStyle: 'solid',
      bg: 'bg.popover',
      borderRadius: 'sm',
      shadow: 'sm',
    },
    dropdownContainer: {
      _focusVisible: {
        insetFocusRing: true,
      },
    },

    button: {
      border: 'none',
      bg: 'bg.surface',
      py: '1.5',
      px: '2',
      pr: '3',
      _placeholder: {
        textStyle: 'description',
        color: 'fg.muted',
      },
      outline: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 'full',
      height: 'full',
    },
    fieldGroup: {
      h: '9',
      _focusVisible: {
        insetFocusRing: true,
      },
      _focusWithin: {
        insetFocusRing: true,
      },
    },
    selectItem: {
      px: '2',
      py: '1',
      cursor: 'pointer',
      outline: 'none',
      _focus: {
        bg: 'bg.popover.hover',
      },
      _selected: {
        bg: 'bg.accent',
        color: 'fg.accent.contrast',
        _focus: {
          bg: 'bg.accent',
          filter: '[brightness(0.92) saturate(1.1)]',
        },
      },
    },
  },
  variants: {
    open: {
      true: {
        fieldGroup: {
          borderColor: 'fg.accent',
        },
      },
    },
    isFocusVisible: {
      true: {
        selectItem: {
          insetFocusRing: true,
        },
      },
    },
  },
});

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  className,
  ...props
}: ISelectProps<T>) {
  const { root, popover, dropdownContainer } = selectRecipe();
  return (
    <SelectPrimitive
      {...props}
      className={composeRenderProps(className, (className) => cx(root, className))}
    >
      <Label>{label}</Label>
      <SelectButton />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover offset={8} className={popover}>
        <ListBox items={items} className={dropdownContainer}>
          {children}
        </ListBox>
      </Popover>
    </SelectPrimitive>
  );
}

function SelectButton() {
  const state = React.useContext(SelectStateContext);
  if (!state) return null;
  const { button, fieldGroup } = selectRecipe({ open: state.isOpen });
  return (
    <FieldGroup className={fieldGroup}>
      <Button className={button}>
        <SelectValue
          className={css({
            textOverflow: 'ellipsis',
          })}
        />
        <SvgIcon name="icon-chevron-down" size={12} />
      </Button>
    </FieldGroup>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className={({ isFocusVisible, defaultClassName }) => {
        const { selectItem } = selectRecipe({ isFocusVisible });
        return cx(selectItem, defaultClassName);
      }}
    />
  );
}
