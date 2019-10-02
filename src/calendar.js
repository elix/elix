/**
 * Helpers for date math and locale-sensitive calendar preferences.
 *
 * The visual representation of calendars varies quite a bit from place to
 * place; see the discussion at
 * [CalendarMonth](CalendarMonth#international-support). The `calendar` helpers
 * provide some assistance in determining a locale's calendar presentation
 * preferences, and working with date math in general.
 *
 *
 * Where these functions take a `locale` string parameter, that should follow
 * the same format as the [locales
 * argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument)
 * of the `Intl` internationalization API. Moreover, the locale should identify
 * at least a language and a region. Examples: "en-US" identifies US English,
 * while "en-GB" identifies English in Great Britain. The use of "en" on its own
 * would be insufficient.
 *
 * @module calendar
 */

import weekData from './weekData.js';

// Default region is "World", see https://www.ctrl.blog/entry/en-001
const defaultRegion = '001';

export const millisecondsPerDay = 24 * 60 * 60 * 1000;

/**
 * Create a `DateTimeFormat` object for the given location and options.
 *
 * @param {string} locale
 * @param {Intl.DateTimeFormatOptions} options
 */
export function dateTimeFormat(locale, options) {
  const caExtension = locale.includes('-ca-') ? '' : '-ca-gregory';
  const nuExtension = locale.includes('-nu-') ? '' : '-nu-latn';
  const extension = caExtension || nuExtension ? '-u' : '';
  const extendedLocale = `${locale}${extension}${caExtension}${nuExtension}`;
  return new Intl.DateTimeFormat(extendedLocale, options);
}

/**
 * Return true if both date object represent the same point in time or are both
 * null.
 *
 * @param {Date|null} date1
 * @param {Date|null} date2
 * @returns {boolean}
 */
export function datesEqual(date1, date2) {
  if (date1 === null && date2 === null) {
    return true;
  } else if (date1 !== null && date2 !== null) {
    return date1.getTime() === date2.getTime();
  } else {
    return false;
  }
}

/**
 * Return the number of days between the two dates.
 *
 * @param {Date} date1
 * @param {Date} date2
 */
export function daysBetweenDates(date1, date2) {
  const days = Math.round(
    (date2.getTime() - date1.getTime()) / millisecondsPerDay
  );
  return days;
}

/**
 * Returns the number of days between the first day of the calendar week in the
 * indicated locale and the given date. In other words, the result indicates
 * which column of a typical calendar the date would appear in.
 *
 * Example: Suppose the given date is a Monday. In the locale 'en-US', the first
 * day of the calendar week is a Sunday, so this function would return 1. In the
 * locale 'en-GB', the first day of the calendar week is a Monday, in which case
 * this function would return 0.
 *
 * @param {Date} date - the target date
 * @param {string} locale - the calendar locale
 * @returns {number} the number of days between the first day of the week in
 * the locale's calendar and the target date
 */
export function daysSinceFirstDayOfWeek(date, locale) {
  const firstDay = firstDayOfWeek(locale);
  return (date.getDay() - firstDay + 7) % 7;
}

/**
 * Returns the first day of the week in a typical calendar in the indicated
 * locale, where 0 is Sunday, 1 is Monday, ..., and 6 = Saturday.
 *
 * @param {string} locale - the calendar locale
 * @returns {number} the number of the first day of the week in the locale
 */
export function firstDayOfWeek(locale) {
  const region = getLocaleRegion(locale);
  const firstDay = weekData.firstDay[region];
  return firstDay !== undefined ? firstDay : weekData.firstDay[defaultRegion];
}

/**
 * Return the date of the first day of the week in the locale's calendar that
 * contains the given date.
 *
 * @param {Date} date - the target date
 * @param {string} locale - the calendar locale
 * @returns {Date}
 */
export function firstDateOfWeek(date, locale) {
  const days = daysSinceFirstDayOfWeek(date, locale);
  const firstDate = offsetDateByDays(date, -days);
  return midnightOnDate(firstDate);
}

/**
 * Returns the first date of the month that contains the indicated target date.
 *
 * @param {Date} date - the target date
 * @returns {Date}
 */
export function firstDateOfMonth(date) {
  const result = midnightOnDate(date);
  result.setDate(1);
  return result;
}

/**
 * Format the given date using the `DateTimeFormatOptions`.
 *
 * The `options` object includes a string `locale` and a `dateTimeFormatOptions`
 * of type `DateTimeFormatOptions`.
 *
 * @param {Date} date
 * @param {PlainObject} options
 */
export function formatDate(date, options) {
  const { locale, dateTimeFormatOptions } = options;
  const format = dateTimeFormat(locale, dateTimeFormatOptions);
  return format.format(date);
}

/**
 * Returns the last date of the month that contains the indicated target date.
 *
 * @param {Date} date - the target date
 * @returns {Date}
 */
export function lastDateOfMonth(date) {
  // Get last day of month by going to first day of next month and backing up a day.
  const result = firstDateOfMonth(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(result.getDate() - 1);
  return result;
}

/**
 * Return the date of the last day of the week in the locale's calendar that
 * contains the given date.
 *
 * @param {Date} date - the target date
 * @param {string} locale - the calendar locale
 * @returns {Date}
 */
export function lastDateOfWeek(date, locale) {
  const days = daysSinceFirstDayOfWeek(date, locale);
  const firstDate = offsetDateByDays(date, 6 - days);
  return midnightOnDate(firstDate);
}

/**
 * Returns midnight on the indicated target date.
 *
 * @param {Date} date - the target date
 * @returns {Date}
 */
export function midnightOnDate(date) {
  const midnight = new Date(date.getTime());
  midnight.setHours(0);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);
  return midnight;
}

/**
 * Returns noon on the indicated target date.
 *
 * @param {Date} date - the target date
 * @returns {Date}
 */
export function noonOnDate(date) {
  const midnight = new Date(date.getTime());
  midnight.setHours(12);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);
  return midnight;
}

/**
 * Parse a text string as a date using the formatting preferences of the
 * indicated locale and the `Intl.DateTimeFormat` formatting options.
 *
 * The `Intl.DateTimeFormat` facility can format dates as text; this `parse`
 * function performs the reverse operation.
 *
 * Parsing is limited to supporting numeric day/month/year formats. The locale
 * and options only dictate the presence of the day, month, and year, and the
 * order in which they will be expected. Missing day/month/year values will
 * be inferred from the current date.
 *
 * @param {string} text - the text to parse as a date
 * @param {Intl.DateTimeFormat} dateTimeFormat - the format to parse
 * @returns {Date|null} - the parsed date
 */
export function parse(text, dateTimeFormat) {
  const today = new Date();
  // @ts-ignore
  /** @type {any[]} */ const parts = dateTimeFormat.formatToParts(today);
  // Convert parts to a regex.
  // For reference, literals/separators we need to support are: `/‏/.年月. -:`
  // (Those two slashes are different Unicode characters.) That said, since
  // we're only supporting numeric day/month/year, we just take anything
  // that's not a digit as a separator.
  const regExText = parts
    .map(part =>
      part.type === 'literal'
        ? '(\\D+)'
        : // TODO: use named capture group `(<${part.type}>\\d+)`
          // when that's widely supported.
          `(\\d+)`
    )
    .join('');
  const regEx = new RegExp(regExText);
  // Match against the text.
  const match = regEx.exec(text);
  if (!match) {
    return null;
  }
  // Convert match values to (effectively) named capture groups.
  /** @type {PlainObject} */ const groups = {};
  parts.forEach((part, index) => {
    groups[part.type] = match[index + 1];
  });
  // @ts-ignore
  const { day, hour, minute, month, second, year } = groups;
  // Adjust short year to current century.
  const yearValue = year && parseInt(year);
  const adjustedYear = yearValue < 100 ? 2000 + yearValue : year;
  return new Date(
    adjustedYear || today.getFullYear(),
    month !== undefined ? month - 1 : today.getMonth(),
    day || today.getDate(),
    hour || 0,
    minute || 0,
    second || 0
  );
}

/**
 * Parse the indicated text as a date, first as a full date that includes the
 * year or, if that fails to parse, as an abbreviated date that omits the year.
 *
 * @param {string} text - the text to parse as a date
 * @param {Intl.DateTimeFormat} dateTimeFormat - the format to parse
 * @param {'future'|'past'} [timeBias] - bias towards future if true, past if false
 * @returns {Date|null} - the parsed date
 */
export function parseWithOptionalYear(text, dateTimeFormat, timeBias) {
  // Try parsing using requested DateTimeFormat.
  const fullDate = parse(text, dateTimeFormat);
  if (fullDate) {
    return fullDate;
  }
  // Try parsing without year. Create an identical DateTimeFormat options, but
  // mark `year` as undefined so it won't be used.
  const { day, locale, month } = dateTimeFormat.resolvedOptions();
  const abbreviatedFormat = new Intl.DateTimeFormat(locale, {
    day,
    month
  });
  const abbreviatedDate = parse(text, abbreviatedFormat);
  if (abbreviatedDate && timeBias) {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const abbreviatedDay = abbreviatedDate.getDate();
    const abbreviatedMonth = abbreviatedDate.getMonth();
    const abbreviatedYear = abbreviatedDate.getFullYear();
    if (timeBias === 'future') {
      if (
        abbreviatedMonth < todayMonth ||
        (abbreviatedMonth === todayMonth && abbreviatedDay < todayDay)
      ) {
        abbreviatedDate.setFullYear(abbreviatedYear + 1);
      }
    } else if (timeBias === 'past') {
      if (
        abbreviatedMonth > todayMonth ||
        (abbreviatedMonth === todayMonth && abbreviatedDay > todayDay)
      ) {
        abbreviatedDate.setFullYear(abbreviatedYear - 1);
      }
    }
  }
  return abbreviatedDate;
}

/**
 * Return true if the two dates fall in the same month and year.
 *
 * @param {Date} date1 - the first date to compare
 * @param {Date} date2 - the second date to compare
 * @returns {boolean}
 */
export function sameMonthAndYear(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * Return the result of adding/subtracting a number of days to a date.
 *
 * @param {Date} date - the target date
 * @param {number} days - the number of days to add/subtract
 * @returns {Date}
 */
export function offsetDateByDays(date, days) {
  // Use noon hour for date math, since adding/subtracting multiples of 24 hours
  // starting from noon is guaranteed to end up on the correct date (although
  // the hours might have changed).
  // TODO: Given the nature of date, there could easily be gnarly date math bugs
  // here. Ideally some time-geek library should be used for this calculation.
  const result = noonOnDate(date);
  result.setDate(result.getDate() + days);
  copyTimeFromDateToDate(date, result); // Restore original hours
  return result;
}

/**
 * TODO: Docs
 *
 * @param {Date} date
 * @param {number} months
 * @returns {Date}
 */
export function offsetDateByMonths(date, months) {
  const result = noonOnDate(date);
  result.setMonth(date.getMonth() + months);
  copyTimeFromDateToDate(date, result); // Restore original hours
  return result;
}

/**
 * Returns midnight today.
 *
 * @returns {Date}
 */
export function today() {
  return midnightOnDate(new Date());
}

/**
 * Returns the day of week (0 = Sunday, 1 = Monday, etc.) for the last day of
 * the weekend in the indicated locale.
 *
 * @param {string} locale - the calendar locale
 * @returns {number}
 */
export function weekendEnd(locale) {
  const region = getLocaleRegion(locale);
  const day = weekData.weekendEnd[region];
  return day !== undefined ? day : weekData.weekendEnd[defaultRegion];
}

/**
 * Returns the day of week (0 = Sunday, 1 = Monday, etc.) for the first day of
 * the weekend in the indicated locale.
 *
 * @param {string} locale - the calendar locale
 * @returns {number}
 */
export function weekendStart(locale) {
  const region = getLocaleRegion(locale);
  const day = weekData.weekendStart[region];
  return day !== undefined ? day : weekData.weekendStart[defaultRegion];
}

/**
 * Update the time on date2 to match date1.
 *
 * @private
 * @param {Date} date1
 * @param {Date} date2
 */
function copyTimeFromDateToDate(date1, date2) {
  date2.setHours(date1.getHours());
  date2.setMinutes(date1.getMinutes());
  date2.setSeconds(date1.getSeconds());
  date2.setMilliseconds(date1.getMilliseconds());
}

function getLocaleRegion(/** @type {string} */ locale) {
  const localeParts = locale ? locale.split('-') : null;
  return localeParts ? localeParts[1] : defaultRegion;
}
