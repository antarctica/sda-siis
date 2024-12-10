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

import { FieldGroup, Label } from '@/components/common/forms/Field';
import { inputContainerRecipe, inputRecipe } from '@/components/common/forms/Field/styles';
import ListBox, { ListBoxItem, ListBoxItemData } from '@/components/common/ListBox';
import SvgIcon from '@/components/common/SvgIcon';

interface ISelectProps<T extends object> extends Omit<SelectProps<T>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: ListBoxItemData[];
  children?: React.ReactNode | ((item: T) => React.ReactNode);
}

const selectRecipe = sva({
  slots: ['root', 'popover', 'fieldGroup', 'button'],
  base: {
    root: {
      display: 'flex',
      position: 'relative',
      gap: '1',
      flexDirection: 'column',
      w: 'full',
      mb: '2',
      overflow: 'hidden',
    },
    popover: {
      borderColor: 'bg.base.border',
      borderRadius: 'sm',
      borderWidth: 'thin',
      width: '[var(--trigger-width)]',
      maxHeight: '60',
      bg: 'bg.popover',
      shadow: 'sm',
      overflow: 'auto',
      borderStyle: 'solid',
    },

    button: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      outline: 'none',
      border: 'none',
      width: 'full',
      height: 'full',
      pr: '3',
      _placeholder: {
        textStyle: 'description',
        color: 'fg.muted',
      },
    },
    fieldGroup: {
      _focusVisible: {
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
    focusVisible: {
      true: {
        fieldGroup: {
          insetFocusRing: true,
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
      <Popover className={popover} offset={8}>
        <ListBox<T> items={items as T[]}>{children}</ListBox>
      </Popover>
    </SelectPrimitive>
  );
}

function SelectButton() {
  const state = React.useContext(SelectStateContext);
  if (!state) return null;
  const { button } = selectRecipe({ open: state.isOpen });
  return (
    <FieldGroup
      className={composeRenderProps('', (className, { isFocusVisible }) =>
        cx(
          selectRecipe({ focusVisible: isFocusVisible }).fieldGroup,
          inputContainerRecipe(),
          className,
        ),
      )}
    >
      <Button className={cx(button, inputRecipe())}>
        <SelectValue
          className={css({
            textOverflow: 'ellipsis',
            _placeholder: {
              textStyle: 'description',
              color: 'fg.muted',
            },
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
