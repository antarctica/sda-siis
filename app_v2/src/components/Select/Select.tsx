import { css, cx, sva } from '@styled-system/css';
import React from 'react';
import type { ListBoxItemProps, SelectProps, ValidationResult } from 'react-aria-components';
import {
  Button,
  composeRenderProps,
  FieldError,
  Popover,
  Select as SelectPrimitive,
  SelectStateContext,
  SelectValue,
  Text,
} from 'react-aria-components';

import { FieldGroup, Label } from '../common/forms/Field';
import SvgIcon from '../common/SvgIcon';
import ListBox, { ListBoxItem, ListBoxItemData } from '../ListBox';

interface ISelectProps<T extends object> extends Omit<SelectProps<T>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

const selectRecipe = sva({
  slots: ['root', 'popover', 'fieldGroup', 'button'],
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
  },
  variants: {
    open: {
      true: {
        fieldGroup: {
          borderColor: 'fg.accent',
        },
      },
    },
  },
});

export function Select<T extends ListBoxItemData>({
  label,
  description,
  errorMessage,
  items,
  children,
  className,
  ...props
}: ISelectProps<T>) {
  const { root, popover } = selectRecipe();
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
        <ListBox items={items}>{children}</ListBox>
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

export function SelectItem<T extends ListBoxItemData>({ children, ...props }: ListBoxItemProps<T>) {
  return <ListBoxItem {...props}>{children}</ListBoxItem>;
}
