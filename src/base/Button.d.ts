// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ComposedFocusMixin from "./ComposedFocusMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

export default class Button extends
  ComposedFocusMixin(FocusVisibleMixin(WrappedStandardElement)
  ) { }
