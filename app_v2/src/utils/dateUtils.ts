import { CalendarDate, DateValue, parseAbsolute, ZonedDateTime } from '@internationalized/date';
import { format, isValid, parse, parseISO, sub } from 'date-fns';

export type DateYYYYMMDD = `${string}-${string}-${string}`;
export type DateRange = `${DateYYYYMMDD}/${DateYYYYMMDD}`;
export type DateRangeCQLString = DateRange | DateYYYYMMDD;
export type DateTimeRangeCQLString = `${string}T00:00:00Z/${string}T23:59:59Z`;

export type RangeValue =
  | { start: DateValue; end: DateValue }
  | { start: DateValue; end: DateValue; timezone: string };

/**
 * Safely parses a date string to a UTC date, handling various formats.
 * Returns undefined if parsing fails.
 *
 * @param dateString - The date string to parse
 * @returns CalendarDateTime | undefined
 */
export function safeParseUTC(dateString: string): ZonedDateTime | undefined {
  try {
    // First try: Direct parseAbsolute with Z
    try {
      return parseAbsolute(dateString + 'Z', 'UTC');
    } catch {
      // Continue to next attempt
    }

    // Second try: Direct parseAbsolute
    try {
      return parseAbsolute(dateString, 'UTC');
    } catch {
      // Continue to next attempt
    }

    // Third try: Parse with date-fns and convert
    let parsedDate: Date | null = null;

    // Try parsing as ISO
    parsedDate = parseISO(dateString);

    // If that fails, try common formats
    if (!isValid(parsedDate)) {
      const formats = [
        'yyyy-MM-dd', // 2024-10-30
        'yyyy-MM-dd HH:mm:ss', // 2024-10-30 00:00:00
        'MM/dd/yyyy', // 10/30/2024
        'MM/dd/yyyy HH:mm:ss', // 10/30/2024 00:00:00
        'dd/MM/yyyy', // 30/10/2024
        'dd/MM/yyyy HH:mm:ss', // 30/10/2024 00:00:00
      ];

      for (const format of formats) {
        try {
          const attemptParse = parse(dateString, format, new Date());
          if (isValid(attemptParse)) {
            parsedDate = attemptParse;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    // If we successfully parsed with date-fns, convert to UTC string and parse with parseAbsolute
    if (parsedDate && isValid(parsedDate)) {
      const utcString = parsedDate.toISOString();
      return parseAbsolute(utcString, 'UTC');
    }

    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Converts a date range string into a date-time range string.
 * @param {DateRangeCQLString} input - The date range string in the format 'yyyy-MM-dd/yyyy-MM-dd' or 'yyyy-MM-dd'.
 * @returns {DateTimeRangeCQLString} The date-time range string in the format 'yyyy-MM-ddT00:00:00Z/yyyy-MM-ddT23:59:59Z'.
 */
export function formatDateRangeToDateTime(input: DateRangeCQLString): DateTimeRangeCQLString {
  const [start, end] = input.split('/');
  return `${start}T00:00:00Z/${end ?? start}T23:59:59Z`;
}

/**
 * Formats a Date object into a string in 'yyyy-MM-dd' format.
 * @param {Date} date - The Date object to be formatted.
 * @returns {DateYYYYMMDD} The formatted date string.
 */
export function formatDateToYYYYMMDD(date: Date): DateYYYYMMDD {
  return format(date, 'yyyy-MM-dd') as DateYYYYMMDD;
}

/**
 * Converts a number of days into a date range string in the format 'yyyy-MM-dd/yyyy-MM-dd'.
 * @param {number} daysBack - The number of days to go back from the current date.
 * @return {DateRange} The date range string.
 */
export function convertDaysToRange(daysBack: number): DateRange {
  const startDate = formatDateToYYYYMMDD(sub(new Date(), { days: daysBack }));
  const endDate = formatDateToYYYYMMDD(new Date());

  return `${startDate}/${endDate}` as DateRange;
}

/**
 * Extracts the year, month, and day parts from an ISO date string.
 * @param {string} isoDateString - The ISO date string.
 * @returns {Object} An object containing the year, month, and day parts.
 */
export function extractDateParts(isoDateString: string) {
  const isoDate = safeParseUTC(isoDateString);

  const year = isoDate?.year.toString();
  const month = String(isoDate?.month.toString()).padStart(2, '0');
  const day = String(isoDate?.day.toString()).padStart(2, '0');

  return { year, month, day };
}

/**
 * Converts a date range string into a RangeValue object.
 * @param {DateRangeCQLString} dateRange - The date range string in the format 'yyyy-MM-dd/yyyy-MM-dd' or 'yyyy-MM-dd'.
 * @returns {RangeValue} The RangeValue object containing the start and end dates as CalendarDate objects.
 */
export function convertDateRangeStringToRangeValue(dateRange: DateRangeCQLString): RangeValue {
  const [start, tempEnd] = dateRange.split('/');
  const end = tempEnd ?? start;
  const startDate = new CalendarDate(
    Number(start!.slice(0, 4)),
    Number(start!.slice(5, 7)),
    Number(start!.slice(8, 10)),
  );
  const endDate = new CalendarDate(
    Number(end!.slice(0, 4)),
    Number(end!.slice(5, 7)),
    Number(end!.slice(8, 10)),
  );
  return { start: startDate, end: endDate };
}

/**
 * Converts a date range string in the format 'yyyy-MM-dd/yyyy-MM-dd' or 'yyyy-MM-dd'
 * into a single date.
 *
 * @param {DateRangeCQLString} dateRange - The date range string to convert.
 * @return {DateValue} - The converted single date.
 */
export function convertDateRangeStringToSingleDate(dateRange: DateRangeCQLString): DateValue {
  const [start] = dateRange.split('/');
  const date = new CalendarDate(
    Number(start!.slice(0, 4)),
    Number(start!.slice(5, 7)),
    Number(start!.slice(8, 10)),
  );
  return date;
}

/**
 * Converts a RangeValue object into a date range string.
 * @param {RangeValue} rangeValue - The RangeValue object containing the start and end dates as DateValue objects.
 * @returns {string} The date range string in the format 'yyyy-MM-dd/yyyy-MM-dd' or 'yyyy-MM-dd'.
 */
export function convertRangeValueToDateRangeString(rangeValue: RangeValue): DateRange {
  const start: DateRangeCQLString = `${rangeValue.start.year}-${rangeValue.start.month.toString().padStart(2, '0')}-${rangeValue.start.day.toString().padStart(2, '0')}`;
  const end: DateRangeCQLString = `${rangeValue.end.year}-${rangeValue.end.month.toString().padStart(2, '0')}-${rangeValue.end.day.toString().padStart(2, '0')}`;

  return `${start}/${end}`;
}

/**
 * Converts a DateValue object into a DateYYYYMMDD string representation.
 *
 * @param {DateValue} dateValue - The DateValue object to convert.
 * @return {DateYYYYMMDD} The DateYYYYMMDD string representation of the DateValue object.
 */
export function convertDateValueToDateYYYYMMDD(dateValue: DateValue): DateYYYYMMDD {
  return `${dateValue.year}-${dateValue.month.toString().padStart(2, '0')}-${dateValue.day.toString().padStart(2, '0')}`;
}
