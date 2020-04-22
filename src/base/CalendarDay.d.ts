// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import CalendarElementMixin from "./CalendarElementMixin.js";

export default class CalendarDay extends CalendarElementMixin(ReactiveElement) {
  outsideRange: boolean;
  selected: boolean;
}
