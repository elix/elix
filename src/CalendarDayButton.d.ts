// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from './CalendarElementMixin.js';
import SeamlessButton from './SeamlessButton.js';

export default class CalendarDayButton extends CalendarElementMixin(
  SeamlessButton
) {
  outsideRange: boolean;
  selected: boolean;
}
