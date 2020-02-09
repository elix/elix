// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import Popup from "./Popup.js";
import TransitionEffectMixin from "./TransitionEffectMixin.js";

export default class Toast extends LanguageDirectionMixin(
  TransitionEffectMixin(Popup)
) {
  duration: number;
  fromEdge: "bottom" | "end" | "left" | "right" | "start" | "top";
}
