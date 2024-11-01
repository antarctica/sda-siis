import { parseAbsolute, ZonedDateTime } from '@internationalized/date';
import { isValid, parse, parseISO } from 'date-fns';

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
