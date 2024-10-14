import { NumberFormatter } from '@internationalized/number';
import { useMemo } from 'react';
import { useLocale } from 'react-aria-components';

export function useFormatNumber(options: Intl.NumberFormatOptions) {
  const { locale } = useLocale();

  return useMemo(() => {
    return new NumberFormatter(locale, {
      ...options,
    });
  }, [locale, options]);
}
