/**
 * Calendar helpers
 * 
 * @module calendar
 */


import weekData from './weekData.js';


// Default region is "World", see https://www.ctrl.blog/entry/en-001
const defaultRegion = '001';


export function firstDayOfWeek(locale) {
  const region = getLocaleRegion(locale);
  return weekData.firstDay[region];
}


function getLocaleRegion(locale) {
  const localeParts = locale ? locale.split('-') : null;
  return localeParts ? localeParts[1] : defaultRegion;
}
