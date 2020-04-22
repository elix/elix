// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import CalendarElementMixin from "./CalendarElementMixin.js";

export default class CalendarMonthYearHeader extends CalendarElementMixin(
  ReactiveElement
) {
  monthFormat: "numeric" | "2-digit" | "long" | "short" | "narrow";
  yearFormat: "numeric" | "2-digit";
}
