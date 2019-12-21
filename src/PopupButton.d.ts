// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import KeyboardMixin from "./KeyboardMixin.js";
import PopupSource from "./PopupSource.js";

export default class PopupButton extends KeyboardMixin(PopupSource) {}
