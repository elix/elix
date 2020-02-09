// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CalendarElementMixin from "./CalendarElementMixin.js";
import ComboBox from "./ComboBox.js";

export default class DateComboBox extends CalendarElementMixin(ComboBox) {
  arrowButtonPartType: PartDescriptor;
  readonly calendar: Element;
  calendarPartType: PartDescriptor;
  dateTimeFormatOptions: Intl.DateTimeFormatOptions;
  dayPartType: PartDescriptor;
  daysOfWeekFormat: "long" | "narrow" | "short";
  monthFormat: "numeric" | "2-digit" | "long" | "short" | "narrow";
  timeBias: "future" | "past" | null;
  todayButtonPartType: PartDescriptor;
  value: string;
  yearFormat: "numeric" | "2-digit";
}
