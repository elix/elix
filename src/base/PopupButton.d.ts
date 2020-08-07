// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DelegateFocusMixin from "./DelegateFocusMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupDragSelectMixin from "./PopupDragSelectMixin.js";
import PopupSource from "./PopupSource.js";
import PopupToggleMixin from "./PopupToggleMixin.js";

export default class PopupButton extends DelegateFocusMixin(
  KeyboardMixin(PopupDragSelectMixin(PopupToggleMixin(PopupSource)))
) {}
