import { useFormatDate } from '@/hooks/useFormatDate';

const generateDateTimeString = ({
  date,
  dateStyle,
  timeStyle,
}: {
  date: Date;
  dateStyle: Intl.DateTimeFormatOptions['dateStyle'] | 'none';
  timeStyle: Intl.DateTimeFormatOptions['timeStyle'] | 'none';
}): string => {
  const isoString = date.toISOString();
  const [isoDate = '', isoTime = ''] = isoString.split('T');

  if (dateStyle === 'none' && timeStyle === 'none') {
    return '';
  }

  if (dateStyle !== 'none' && timeStyle === 'none') {
    return isoDate; // "YYYY-MM-DD"
  }

  if (dateStyle === 'none' && timeStyle !== 'none') {
    return isoTime.slice(0, 8); // "HH:MM:SS"
  }

  return isoString; // "YYYY-MM-DDTHH:MM:SS.sssZ"
};

export function DateTime(datetimeProps: {
  date: Date;
  dateStyle: Intl.DateTimeFormatOptions['dateStyle'] | 'none';
  timeStyle: Intl.DateTimeFormatOptions['timeStyle'] | 'none';
  timeZone?: string;
  utcOffset?: number;
}) {
  const { date, dateStyle, timeStyle, timeZone, utcOffset } = datetimeProps;

  // Calculate the timeZone string based on utcOffset if provided
  const calculatedTimeZone =
    utcOffset !== undefined
      ? `Etc/GMT${utcOffset > 0 ? '-' : '+'}${Math.abs(utcOffset)}`
      : timeZone;

  const formatter = useFormatDate({ dateStyle, timeStyle, timeZone: calculatedTimeZone });

  return (
    <time dateTime={generateDateTimeString({ date, dateStyle, timeStyle })}>
      {formatter.format(date)}
    </time>
  );
}

export default DateTime;
