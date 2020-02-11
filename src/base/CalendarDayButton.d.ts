// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from "./CalendarElementMixin.js";
import Button from "./Button.js";

export default class CalendarDayButton extends CalendarElementMixin(
  Button
) {
  outsideRange: boolean;
  selected: boolean;
}
