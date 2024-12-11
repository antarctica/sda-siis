import { css, cva } from '@styled-system/css';
import { isToday } from 'date-fns';
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  DateValue,
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarProps as AriaRangeCalendarProps,
} from 'react-aria-components';

import { FieldError } from '../Field';
import { CalendarGridHeader, CalendarHeader } from './Calendar';

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, 'visibleDuration'> {
  errorMessage?: string;
}

const cell = cva({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'sm',
    w: '9',
    h: '9',
    fontSize: 'sm',
    cursor: 'pointer',

    _hover: {
      color: 'fg',
      bg: 'app.accent.a3',
    },
  },
  variants: {
    isFocusVisible: {
      true: {
        insetFocusRing: true,
      },
      false: {
        insetFocusRing: false,
      },
    },
    isOutsideMonth: {
      true: {
        color: 'fg.muted',
      },
    },
    selectionState: {
      none: {},
      middle: {
        borderRadius: 'radii.none',
        color: 'fg.accent.contrast',
        bg: 'app.accent.a8',
      },
      'cap-start': {
        bg: 'app.accent',
        color: 'fg.accent.contrast',
        borderRightRadius: 'radii.none',
        _hover: {
          bg: 'app.accent',
          color: 'fg.accent.contrast',
        },
      },
      'cap-end': {
        bg: 'app.accent',
        color: 'fg.accent.contrast',
        borderLeftRadius: 'radii.none',
        _hover: {
          bg: 'app.accent',
          color: 'fg.accent.contrast',
        },
      },
    },
    isInvalid: {
      true: {
        color: 'error.fg',
        bg: 'error.bg',
      },
    },
    isDisabled: {
      true: {
        color: 'fg.muted',
        cursor: 'not-allowed',
        _hover: {
          bg: 'app.grey.a4',
        },
      },
    },
    today: {
      true: {
        textDecoration: 'underline',
        textDecorationThickness: '[1px]',
        textUnderlineOffset: '[3px]',
      },
    },
  },
  // compoundVariants: [
  //   {
  //     selectionState: ['middle', 'cap'],
  //     today: true,
  //     class: 'text-white',
  //   },
  //   { selectionState: ['middle', 'cap'], isOutsideMonth: true, class: 'opacity-50' },
  //   {
  //     today: true,
  //     isDisabled: true,
  //     class: 'opacity-50',
  //   },
  //   {
  //     isOutsideMonth: true,
  //     isInvalid: true,
  //     class: 'text-white opacity-50',
  //   },
  // ],
});

export function RangeCalendar<T extends DateValue>({
  errorMessage,
  ...props
}: RangeCalendarProps<T>) {
  return (
    <>
      <AriaRangeCalendar {...props}>
        <CalendarHeader />
        <CalendarGrid>
          <CalendarGridHeader />
          <CalendarGridBody className={css({ '& tr:first-child td': { paddingTop: '1' } })}>
            {(date) => (
              <CalendarCell
                className={css({
                  outline: 'none',
                })}
                date={date}
              >
                {({
                  date,
                  formattedDate,
                  isSelected,
                  isSelectionStart,
                  isSelectionEnd,
                  isFocusVisible,
                  isDisabled,
                  isOutsideMonth,
                  isInvalid,
                }) => (
                  <span
                    className={cell({
                      selectionState:
                        isSelected && (isSelectionStart || isSelectionEnd)
                          ? isSelectionStart
                            ? 'cap-start'
                            : 'cap-end'
                          : isSelected
                            ? 'middle'
                            : 'none',
                      isDisabled,
                      isFocusVisible,
                      today: isToday(date.toDate('UTC')),
                      isOutsideMonth,
                      isInvalid,
                    })}
                  >
                    {formattedDate}
                  </span>
                )}
              </CalendarCell>
            )}
          </CalendarGridBody>
        </CalendarGrid>

        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </AriaRangeCalendar>
    </>
  );
}
