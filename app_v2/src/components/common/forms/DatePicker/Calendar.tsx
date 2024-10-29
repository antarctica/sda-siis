import { getLocalTimeZone } from '@internationalized/date';
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
    w: '9',
    h: '9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'sm',
    borderRadius: 'sm',
    cursor: 'pointer',
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
        bg: 'bg.accent',
        color: 'fg.accent.contrast',
      },
    },
    isUnavailable: {
      true: {
        color: 'fg.muted',
        cursor: 'not-allowed',
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
        <CalendarGridBody>
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
                    today: isToday(date.toDate(getLocalTimeZone())),
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
      alignItems: 'center',
      gap: '1',
      pb: '4',
      px: '1',
      w: 'full',
    },
    title: {
      flex: '1',
      textAlign: 'center',
      textStyle: 'heading4',
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
      />

      <Heading className={title} />
      <IconButton icon={ChevronRight} variant="primary" aria-label="Next month" slot={'next'} />
    </header>
  );
}

const calendarGridHeaderRecipe = sva({
  slots: ['wrapper', 'headerCell'],
  base: {
    wrapper: {
      borderBottomWidth: 'thin',
      borderBottomStyle: 'solid',
      borderBottomColor: 'app.accent',
    },
    headerCell: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      pb: '2',
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
    borderColor: 'bg.base.border',
    borderWidth: 'thin',
    borderStyle: 'solid',
    bg: 'bg.popover',
    borderRadius: 'sm',
    shadow: 'sm',
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
