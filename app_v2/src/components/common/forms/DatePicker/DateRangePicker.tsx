'use client';
import {
  type DateDuration,
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import { css, cx } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import React from 'react';
import {
  composeRenderProps,
  DateRangePicker as AriaDateRangePicker,
  DateRangePickerProps as AriaDateRangePickerProps,
  ValidationResult,
} from 'react-aria-components';

import { Button, IconButton } from '../../Button';
import SvgIcon from '../../SvgIcon';
import { Description, FieldError, FieldGroup, Label } from '../Field';
import { dateFieldGroupRecipe, inputContainerRecipe } from '../Field/styles';
import { CalandarPopUp } from './Calendar';
import { DateInput } from './DateField';
import { RangeCalendar } from './RangeCalendar';

export interface DateRangePickerProps extends AriaDateRangePickerProps<DateValue> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  maxRange?: DateDuration;
}

function validateRangeExtent(
  range: DateRangePickerProps['value'],
  maxRangeExtent?: DateDuration,
): string | undefined {
  if (!range) {
    return 'Please select a date range.';
  }

  if (!maxRangeExtent) {
    return;
  }

  const { start, end } = range;

  if (start.compare(end) > 0) {
    return 'The start date must be before the end date.';
  }

  const maxEndDate = start.add(maxRangeExtent);

  if (end.compare(maxEndDate) > 0) {
    let guidance = 'The maximum date range is ';
    const units = [];

    if (maxRangeExtent.years) {
      units.push(`${maxRangeExtent.years} year${maxRangeExtent.years > 1 ? 's' : ''}`);
    }
    if (maxRangeExtent.months) {
      units.push(`${maxRangeExtent.months} month${maxRangeExtent.months > 1 ? 's' : ''}`);
    }
    if (maxRangeExtent.weeks) {
      units.push(`${maxRangeExtent.weeks} week${maxRangeExtent.weeks > 1 ? 's' : ''}`);
    }
    if (maxRangeExtent.days) {
      units.push(`${maxRangeExtent.days + 1} day${maxRangeExtent.days > 1 ? 's' : ''}`);
    }

    guidance += units.join(', ');

    return guidance;
  }

  return;
}

function isRangeWithinMaxRange(range: DateDuration, maxRange?: DateDuration): boolean {
  if (!maxRange) return true;

  const rangeInDays =
    (range.years || 0) * 365 +
    (range.months || 0) * 30 +
    (range.weeks || 0) * 7 +
    (range.days || 0);
  const maxRangeInDays =
    (maxRange.years || 0) * 365 +
    (maxRange.months || 0) * 30 +
    (maxRange.weeks || 0) * 7 +
    (maxRange.days || 0);
  return rangeInDays <= maxRangeInDays;
}

export function DateRangePicker({
  label,
  description,
  maxRange,
  validate,
  onChange,
  ...props
}: DateRangePickerProps) {
  const [value, setValue] = React.useState<DateRangePickerProps['value']>(props.defaultValue);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = React.useCallback(
    (value: DateRangePickerProps['value']) => {
      if (value) {
        const validationError = validate?.(value) ?? validateRangeExtent(value, maxRange);
        if (value && !validationError) {
          onChange?.(value);
        }
      }

      setValue(value);
    },
    [onChange, maxRange, validate],
  );

  const validation = React.useMemo(() => validateRangeExtent(value, maxRange), [value, maxRange]);

  return (
    <AriaDateRangePicker
      onChange={handleChange}
      value={value}
      isOpen={isOpen}
      isInvalid={Boolean(validation)}
      shouldCloseOnSelect={false}
      onOpenChange={setIsOpen}
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
            mb: '2',
          }),
          className,
        ),
      )}
    >
      {label && <Label>{label}</Label>}
      <DatePickerInputGroup />
      {description && <Description>{description}</Description>}
      <FieldError>{validation}</FieldError>
      <CalandarPopUp isOpen={isOpen} setIsOpen={setIsOpen}>
        <Flex direction="row" gap="0.5">
          <Flex direction={'column'} p={'2'} display={{ base: 'none', md: 'flex' }} gap="2">
            {isRangeWithinMaxRange({ days: 1 }, maxRange) && (
              <Button
                slot={null}
                variant="outline"
                className={css({ w: 'full', justifyContent: 'center' })}
                size="md"
                onPress={() => {
                  handleChange({
                    start: today(getLocalTimeZone()).add({ days: -1 }),
                    end: today(getLocalTimeZone()),
                  });
                  setIsOpen(false);
                }}
              >
                Last Day
              </Button>
            )}
            {isRangeWithinMaxRange({ days: 2 }, maxRange) && (
              <Button
                slot={null}
                variant="outline"
                className={css({ w: 'full', justifyContent: 'center' })}
                size="md"
                onPress={() => {
                  handleChange({
                    start: today(getLocalTimeZone()).add({ days: -2 }),
                    end: today(getLocalTimeZone()),
                  });
                  setIsOpen(false);
                }}
              >
                Last 2 Days
              </Button>
            )}
            {isRangeWithinMaxRange({ weeks: 1 }, maxRange) && (
              <Button
                slot={null}
                onPress={() => {
                  handleChange({
                    start: today(getLocalTimeZone()).add({ days: -6 }),
                    end: today(getLocalTimeZone()),
                  });
                  setIsOpen(false);
                }}
                variant="outline"
                className={css({ w: 'full', justifyContent: 'center' })}
                size="md"
              >
                Last 7 Days
              </Button>
            )}
            {isRangeWithinMaxRange({ days: 30 }, maxRange) && (
              <Button
                slot={null}
                onPress={() => {
                  handleChange({
                    start: today(getLocalTimeZone()).add({ days: -29 }),
                    end: today(getLocalTimeZone()),
                  });
                  setIsOpen(false);
                }}
                variant="outline"
                className={css({ w: 'full', justifyContent: 'center' })}
                size="md"
              >
                Last 30 Days
              </Button>
            )}
          </Flex>
          <Divider
            orientation="vertical"
            height="auto"
            thickness={'thin'}
            color={'bg.base.border'}
          />
          <Flex direction={'column'} p={'2'} gap="2">
            <RangeCalendar
              onChange={(value) => {
                handleChange(value);
                if (!validateRangeExtent(value, maxRange)) {
                  setIsOpen(false);
                }
              }}
              errorMessage={validation}
            />
            <Button
              slot={null}
              variant="primary"
              className={css({ w: 'full', justifyContent: 'center' })}
              size="md"
              onPress={() => {
                handleChange({
                  start: today(getLocalTimeZone()),
                  end: today(getLocalTimeZone()),
                });
                setIsOpen(false);
              }}
            >
              Today
            </Button>
          </Flex>
        </Flex>
      </CalandarPopUp>
    </AriaDateRangePicker>
  );
}

function DatePickerInputGroup() {
  return (
    <FieldGroup className={cx(inputContainerRecipe(), dateFieldGroupRecipe())}>
      <Flex gap="1" align="center">
        <DateInput slot="start" />
        <span aria-hidden="true">–</span>
        <DateInput slot="end" />
      </Flex>

      <Flex align="center">
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
