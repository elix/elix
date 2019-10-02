// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from './CalendarElementMixin.js';
import Input from './Input.js';

export default class DateInput extends CalendarElementMixin(Input) {
  dateTimeFormatOptions: Intl.DateTimeFormatOptions;
  timeBias: 'future' | 'past' | null;
  value: string;
}
