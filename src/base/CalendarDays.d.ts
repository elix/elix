// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from "./CalendarElementMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";

export default class CalendarDays extends CalendarElementMixin(
  ReactiveElement
) {
  dayElementForDate(date: Date): Element | null;
  dayCount: number;
  dayPartType: PartDescriptor;
  readonly days: Element[];
  showCompleteWeeks: boolean;
  showSelectedDay: boolean;
  startDate: Date;
}
