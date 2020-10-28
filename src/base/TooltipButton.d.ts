// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import FocusVisibleMixin from "./FocusVisibleMixin";
import PopupButton from "./PopupButton";

export default class TooltipButton extends FocusVisibleMixin(PopupButton) {}
