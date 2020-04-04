// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ArrowDirectionMixin from "./ArrowDirectionMixin.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import CalendarMonth from "./CalendarMonth.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";

export default class CalendarMonthNavigator extends ArrowDirectionMixin(
  CalendarElementMixin(
    FocusVisibleMixin(
      FormElementMixin(
        KeyboardDirectionMixin(
          KeyboardMixin(LanguageDirectionMixin(CalendarMonth))
        )
      )
    )
  )
) {}
