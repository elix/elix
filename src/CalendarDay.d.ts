// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';

export default class CalendarDay extends CalendarElementMixin(ReactiveElement) {
  outsideRange: boolean;
  selected: boolean;
}
