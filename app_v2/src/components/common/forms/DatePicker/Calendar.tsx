import { css, cva, sva } from '@styled-system/css';
import { isToday } from 'date-fns';
import React from 'react';
import {
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell,
  CalendarProps as AriaCalendarProps,
  DateValue,
  Dialog,
  Heading,
  Popover,
  useLocale,
} from 'react-aria-components';

import { IconButton } from '../../Button';
import SvgIcon from '../../SvgIcon';
import { FieldError } from '../Field';

const calandarCellRecipe = cva({
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
    selectionState: {
      true: {
        color: 'fg.accent.contrast',
        bg: 'bg.accent',
        _hover: {
          bg: 'bg.accent',
        },
      },
    },
    isUnavailable: {
      true: {
        color: 'error.fg',
        opacity: '0.5',
        cursor: 'not-allowed',
        _hover: {
          bg: 'app.grey.a4',
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
});

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, 'visibleDuration'> {
  errorMessage?: string;
}

export function Calendar<T extends DateValue>({ errorMessage, ...props }: CalendarProps<T>) {
  return (
    <AriaCalendar {...props}>
      <CalendarHeader />
      <CalendarGrid>
        <CalendarGridHeader />
        <CalendarGridBody
          className={css({
            '& tr:first-child td': {
              paddingTop: '1',
            },
          })}
        >
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
                isFocusVisible,
                isDisabled,
                isUnavailable,
                isInvalid,
              }) => (
                <span
                  className={calandarCellRecipe({
                    selectionState: isSelected,
                    isDisabled,
                    isFocusVisible,
                    isUnavailable,
                    isInvalid,
                    today: isToday(date.toDate('UTC')),
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
    </AriaCalendar>
  );
}

const calendarHeaderRecipe = sva({
  slots: ['wrapper', 'title'],
  base: {
    wrapper: {
      display: 'flex',
      gap: '1',
      alignItems: 'center',
      w: 'full',
      pb: '4',
    },
    title: {
      textStyle: 'heading4',
      flex: '1',
      textAlign: 'center',
    },
  },
});

export function CalendarHeader() {
  const { direction } = useLocale();
  const { wrapper, title } = calendarHeaderRecipe();

  const ChevronLeft =
    direction === 'rtl' ? (
      <SvgIcon name="icon-chevron-right" />
    ) : (
      <SvgIcon name="icon-chevron-left" />
    );
  const ChevronRight =
    direction === 'rtl' ? (
      <SvgIcon name="icon-chevron-left" size={12} />
    ) : (
      <SvgIcon name="icon-chevron-right" size={12} />
    );

  return (
    <header className={wrapper}>
      <IconButton
        icon={ChevronLeft}
        variant="primary"
        aria-label="Previous month"
        slot={'previous'}
        size="md"
      />

      <Heading className={title} />
      <IconButton
        icon={ChevronRight}
        variant="primary"
        aria-label="Next month"
        slot={'next'}
        size="md"
      />
    </header>
  );
}

const calendarGridHeaderRecipe = sva({
  slots: ['wrapper', 'headerCell'],
  base: {
    wrapper: {
      borderBottomWidth: 'thin',
      borderBottomColor: 'app.accent',
      borderBottomStyle: 'solid',
    },
    headerCell: {
      pb: '2',
      fontSize: 'sm',
      fontWeight: 'semibold',
    },
  },
});

export function CalendarGridHeader() {
  const { wrapper, headerCell } = calendarGridHeaderRecipe();
  return (
    <AriaCalendarGridHeader className={wrapper}>
      {(day) => <CalendarHeaderCell className={headerCell}>{day}</CalendarHeaderCell>}
    </AriaCalendarGridHeader>
  );
}

const calandarDialogRecipe = cva({
  base: {
    borderColor: 'app.accent',
    borderRadius: 'sm',
    borderWidth: 'thin',
    bg: 'bg.popover',
    shadow: 'sm',
    borderStyle: 'solid',
  },
});

export function CalandarPopUp({
  children,
  isOpen,
  setIsOpen,
}: React.PropsWithChildren<{
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  return (
    <Popover placement="bottom right" onOpenChange={setIsOpen} isOpen={isOpen}>
      <Dialog className={calandarDialogRecipe()}>{children}</Dialog>
    </Popover>
  );
}
