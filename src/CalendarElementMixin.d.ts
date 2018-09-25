// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const CalendarElementMixin: StateMixin<{
  },
  {},
  {
    date: Date,
    locale: string
  },
  {
    date: Date;
    locale: string;
  }>;

export default CalendarElementMixin;
