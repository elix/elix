// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaRoleMixin from "./AriaRoleMixin.js";
import DisabledMixin from "./DisabledMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";

export default class PopupSource extends AriaRoleMixin(
  DisabledMixin(
    FocusVisibleMixin(LanguageDirectionMixin(OpenCloseMixin(ReactiveElement)))
  )
) {
  framePartType: PartDescriptor;
  horizontalAlign: "start" | "end" | "left" | "right" | "stretch";
  popupPosition: "above" | "below";
  popupPartType: PartDescriptor;
  sourcePartType: PartDescriptor;
}
