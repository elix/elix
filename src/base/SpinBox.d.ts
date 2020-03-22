// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";

export default class SpinBox extends DelegateFocusMixin(
  DelegateInputSelectionMixin(
    FocusVisibleMixin(
      FormElementMixin(KeyboardMixin(KeyboardDirectionMixin(ReactiveElement)))
    )
  )
) {
  stepDown(): void;
  stepUp(): void;
  value: string;
}
