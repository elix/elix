/**
 * Calendar helpers
 * 
 * @module calendar
 */


import weekData from './weekData.js';


// Default region is "World", see https://www.ctrl.blog/entry/en-001
const defaultRegion = '001';


export const millisecondsPerDay = 24 * 60 * 60 * 1000;


export function daysSinceFirstDayOfWeek (date, locale) {
  const firstDay = firstDayOfWeek(locale);
  return (date.getDay() - firstDay + 7) % 7;
}


export function firstDayOfWeek(locale) {
  const region = getLocaleRegion(locale);
  return weekData.firstDay[region];
}


// Return the date of the first day of the week that contains the given date.
export function firstDateOfWeek(date, locale) {
  const days = daysSinceFirstDayOfWeek(date, locale);
  const firstDate = offsetDateByDays(date, -days);
  return midnightOnDate(firstDate);
}


export function midnightOnDate(date) {
  const midnight = new Date(date.getTime());
  midnight.setHours(0);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);
  return midnight;
}


// Return the result of adding/subtracting a number of days to a date.
// TODO: There are surely gnarly date math bugs here. Ideally some time-geek
// library should be used for this calculation.
export function offsetDateByDays(date, days) {
  // Use noon hour for date math, since adding/subtracting multiples of 24 hours
  // starting from noon is guaranteed to end up on the correct date (although
  // the hours might have changed).
  const noon = new Date(date.getTime());
  noon.setHours(11);
  const result = new Date(noon.getTime() + (days * millisecondsPerDay));
  // Restore original hours
  result.setHours(date.getHours());
  return result;
}


// Returns midnight today.
export function today() {
  return midnightOnDate(new Date());
}


function getLocaleRegion(locale) {
  const localeParts = locale ? locale.split('-') : null;
  return localeParts ? localeParts[1] : defaultRegion;
}
