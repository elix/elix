// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DialogModalityMixin from "./DialogModalityMixin.js";
import FocusCaptureMixin from "./FocusCaptureMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import Overlay from "./Overlay.js";

export default class Dialog extends DialogModalityMixin(
  FocusCaptureMixin(KeyboardMixin(Overlay))
) {}
