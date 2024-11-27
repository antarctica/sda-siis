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
    w: '9',
    h: '9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'sm',
    borderRadius: 'sm',
    cursor: 'pointer',

    _hover: {
      bg: 'app.accent.a3',
      color: 'fg',
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
        bg: 'app.accent.a8',
        color: 'fg.accent.contrast',
        borderRadius: 'radii.none',
      },
      'cap-start': {
        bg: 'app.accent',
        color: 'fg.accent.contrast',
        borderEndRadius: 'radii.none',
        _hover: {
          bg: 'app.accent',
          color: 'fg.accent.contrast',
        },
      },
      'cap-end': {
        bg: 'app.accent',
        color: 'fg.accent.contrast',
        borderStartRadius: 'radii.none',
        _hover: {
          bg: 'app.accent',
          color: 'fg.accent.contrast',
        },
      },
    },
    isInvalid: {
      true: {
        bg: 'error.bg',
        color: 'error.fg',
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
                date={date}
                className={css({
                  outline: 'none',
                })}
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
