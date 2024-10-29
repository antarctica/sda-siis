'use client';
import { type DateValue, today } from '@internationalized/date';
import { css, cva, cx } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import React from 'react';
import {
  composeRenderProps,
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  ValidationResult,
} from 'react-aria-components';

import { Button, IconButton } from '../../Button';
import SvgIcon from '../../SvgIcon';
import { Description, FieldError, FieldGroup, Label } from '../Field';
import { fieldBorderRecipe, inputRecipe } from '../Field/styles';
import { CalandarPopUp, Calendar } from './Calendar';
import { DateInput } from './DateField';

export type RangeValue =
  | { start: DateValue; end: DateValue }
  | { start: DateValue; end: DateValue; timezone: string };
export interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker({
  label,
  description,
  errorMessage,
  defaultValue,
  maxValue,
  isDateUnavailable,
  onChange,
  ...props
}: DatePickerProps) {
  const [value, setValue] = React.useState<DatePickerProps['value']>(defaultValue);
  const [isOpen, setIsOpen] = React.useState(false);

  const changeValue = React.useCallback(
    (value: DateValue) => {
      setValue(value);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange],
  );

  const isTodayEnabled = React.useMemo(() => {
    const calandarToday = today('UTC');
    if (isDateUnavailable) {
      return !isDateUnavailable(calandarToday);
    }

    if (maxValue) {
      return calandarToday.compare(maxValue) <= 0;
    }
  }, [maxValue, isDateUnavailable]);

  console.log({ isTodayEnabled });

  return (
    <AriaDatePicker
      value={value}
      onChange={changeValue}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isDateUnavailable={isDateUnavailable}
      maxValue={maxValue}
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
          }),
          className,
        ),
      )}
    >
      {label && <Label>{label}</Label>}
      <DatePickerInputGroup />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <CalandarPopUp>
        <Flex direction="column" p="2" gap="2">
          <Calendar />
          {isTodayEnabled && (
            <Button
              slot={null}
              variant="primary"
              className={css({ w: 'full', justifyContent: 'center' })}
              onPress={() => {
                changeValue(today('UTC'));
                setIsOpen(false);
              }}
            >
              Today
            </Button>
          )}
        </Flex>
      </CalandarPopUp>
    </AriaDatePicker>
  );
}

const fieldGroupRecipe = cva({
  base: {
    minW: '52',
    w: 'full',
    display: 'flex',
    justifyContent: 'space-between',
    pr: '0.5',
  },
});
function DatePickerInputGroup() {
  return (
    <FieldGroup
      className={({ isInvalid, isDisabled }) =>
        cx(fieldBorderRecipe({ isInvalid, isDisabled }), inputRecipe(), fieldGroupRecipe())
      }
    >
      <DateInput />
      <IconButton
        icon={<SvgIcon name="icon-calendar" size={20} />}
        aria-label="Open calendar"
        size="md"
      />
    </FieldGroup>
  );
}
