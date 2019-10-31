// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from './CalendarElementMixin.js';
import ComboBox from './ComboBox.js';

export default class DateComboBox extends CalendarElementMixin(ComboBox) {
  arrowButtonRole: PartDescriptor;
  calendar: Element;
  calendarRole: PartDescriptor;
  dateTimeFormatOptions: Intl.DateTimeFormatOptions;
  dayRole: PartDescriptor;
  daysOfWeekFormat: 'long' | 'narrow' | 'short';
  monthFormat: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  timeBias: 'future' | 'past' | null;
  todayButtonRole: PartDescriptor;
  value: string;
  yearFormat: 'numeric' | '2-digit';
}
