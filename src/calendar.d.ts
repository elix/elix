// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export const millisecondsPerDay: number;
export function dateTimeFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat;
export function datesEqual(date1: Date, date2: Date): boolean;
export function daysBetweenDates(date1: Date, date2: Date): number;
export function daysSinceFirstDayOfWeek(date: Date, locale: string): number;
export function firstDayOfWeek(locale: string): number;
export function firstDateOfWeek(date: Date, locale: string): Date;
export function firstDateOfMonth(date: Date): Date;
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions
): string;
export function lastDateOfMonth(date: Date): Date;
export function lastDateOfWeek(date: Date, locale: string): Date;
export function midnightOnDate(date: Date): Date;
export function noonOnDate(date: Date): Date;
export function parse(text: string, dateTimeFormat: Intl.DateTimeFormat): Date;
export function parseWithOptionalYear(
  text: string,
  dateTimeFormat: Intl.DateTimeFormat,
  timeBias: 'future' | 'past'
): Date;
export function sameMonthAndYear(date1: Date, date2: Date): boolean;
export function offsetDateByDays(date: Date, days: number): Date;
export function offsetDateByMonths(date: Date, months: number): Date;
export function today(): Date;
export function weekendEnd(locale: string): number;
export function weekendStart(locale: string): number;
