import { DateFormatter } from '@internationalized/date';
import { useMemo } from 'react';
import { useLocale } from 'react-aria-components';

export function useFormatDate({
  dateStyle,
  timeStyle,
  timeZone,
}: {
  dateStyle: Intl.DateTimeFormatOptions['dateStyle'] | 'none';
  timeStyle: Intl.DateTimeFormatOptions['timeStyle'] | 'none';
  timeZone?: string;
}) {
  const { locale } = useLocale();

  const memoizedDateStyle = useMemo(() => dateStyle, [dateStyle]);
  const memoizedTimeStyle = useMemo(() => timeStyle, [timeStyle]);
  const memoizedTimeZone = useMemo(() => timeZone, [timeZone]);

  return useMemo(() => {
    return new DateFormatter(locale, {
      dateStyle: memoizedDateStyle !== 'none' ? memoizedDateStyle : undefined,
      timeStyle: memoizedTimeStyle !== 'none' ? memoizedTimeStyle : undefined,
      timeZone: memoizedTimeZone,
    });
  }, [locale, memoizedDateStyle, memoizedTimeStyle, memoizedTimeZone]);
}
