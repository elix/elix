// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';

export default class CalendarMonth extends CalendarElementMixin(
  ReactiveElement
) {
  dayElementForDate(date: Date): Element | null;
  dayPartType: PartDescriptor;
  days: Element[];
  daysOfWeekFormat: 'long' | 'narrow' | 'short';
  monthFormat: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  showCompleteWeeks: boolean;
  showSelectedDay: boolean;
  yearFormat: 'numeric' | '2-digit';
}
