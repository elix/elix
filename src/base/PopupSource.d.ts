// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import DisabledMixin from "./DisabledMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import OpenCloseMixin from "./OpenCloseMixin.js";

export default class PopupSource extends DisabledMixin(
  FocusVisibleMixin(LanguageDirectionMixin(OpenCloseMixin(ReactiveElement)))
) {
  framePartType: PartDescriptor;
  popupAlign: "bottom" | "end" | "left" | "right" | "stretch" | "start" | "top";
  popupPartType: PartDescriptor;
  popupDirection:
    | "above"
    | "below"
    | "column-reverse"
    | "column"
    | "left"
    | "right"
    | "row-reverse"
    | "row";
  sourcePartType: PartDescriptor;
}
