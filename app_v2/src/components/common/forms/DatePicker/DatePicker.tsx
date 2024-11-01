'use client';
import { type DateValue, isSameDay, today } from '@internationalized/date';
import { css, cva, cx } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
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

export interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  navButtonsEnabled?: boolean;
  validDates?: DateValue[];
}

export function DatePicker({
  label,
  description,
  errorMessage,
  defaultValue,
  maxValue,
  isDateUnavailable,
  onChange,
  navButtonsEnabled = false,
  validDates,
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

  const isDateUnavailableCb = React.useCallback(
    (date: DateValue) => {
      let isUnavailable = false;

      if (isDateUnavailable) {
        isUnavailable = isDateUnavailable(date);
      }

      if (validDates) {
        isUnavailable =
          isUnavailable || !validDates.some((validDate) => isSameDay(date, validDate));
      }

      return isUnavailable;
    },
    [validDates, isDateUnavailable],
  );

  return (
    <AriaDatePicker
      value={value}
      onChange={changeValue}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isDateUnavailable={isDateUnavailableCb}
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
      <DatePickerInputGroup
        navButtonsEnabled={navButtonsEnabled}
        changeValue={changeValue}
        value={value}
        validDates={validDates}
      />
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
              size="md"
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
    gap: '1',
  },
});
function DatePickerInputGroup({
  navButtonsEnabled = false,
  changeValue,
  value,
  validDates,
}: {
  navButtonsEnabled?: boolean;
  changeValue: (value: DateValue) => void;
  value: DatePickerProps['value'];
  validDates?: DateValue[];
}) {
  const orderedValidDates = React.useMemo(() => {
    if (validDates) {
      return validDates.sort((a, b) => a.compare(b));
    }
    return [];
  }, [validDates]);

  const currentDateIndex = React.useMemo(() => {
    if (!value) {
      return -1;
    }
    return orderedValidDates.findIndex((date) => isSameDay(date, value));
  }, [value, orderedValidDates]);

  const navDisabled = currentDateIndex === -1;

  return (
    <FieldGroup
      className={({ isInvalid, isDisabled }) =>
        cx(fieldBorderRecipe({ isInvalid, isDisabled }), inputRecipe(), fieldGroupRecipe())
      }
    >
      {navButtonsEnabled && (
        <>
          <Flex gap="1" grow={0} align="center" pr="1">
            <IconButton
              slot={null}
              icon={<SvgIcon name="icon-chevron-left" size={12} />}
              aria-label="Previous date"
              variant="primary"
              size="sm"
              isDisabled={navDisabled || currentDateIndex === 0}
              onPress={() => {
                if (!value) {
                  return;
                }
                if (currentDateIndex > 0) {
                  const previousDate = orderedValidDates[currentDateIndex - 1];
                  if (previousDate) {
                    changeValue(previousDate);
                  }
                }
              }}
            />
            <IconButton
              slot={null}
              icon={<SvgIcon name="icon-chevron-right" size={12} />}
              aria-label="Next date"
              variant="primary"
              size="sm"
              isDisabled={navDisabled || currentDateIndex === orderedValidDates.length - 1}
              onPress={() => {
                if (!value) {
                  return;
                }
                if (currentDateIndex < orderedValidDates.length - 1) {
                  const nextDate = orderedValidDates[currentDateIndex + 1];
                  if (nextDate) {
                    changeValue(nextDate);
                  }
                }
              }}
            />
          </Flex>
          <Divider orientation="vertical" h="9" color="bg.base.border" />
        </>
      )}

      <DateInput className={css({ flexGrow: 1 })} />
      <Flex align="center" gap="0.5" grow={0}>
        <Divider orientation="vertical" h="9" color="bg.base.border" />
        <IconButton
          icon={<SvgIcon name="icon-calendar" size={20} />}
          aria-label="Open calendar"
          size="md"
          variant="surface"
        />
      </Flex>
    </FieldGroup>
  );
}
