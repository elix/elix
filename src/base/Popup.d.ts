// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Overlay from "./Overlay.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupModalityMixin from "./PopupModalityMixin.js";

export default class Popup extends KeyboardMixin(PopupModalityMixin(Overlay)) {}
