// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaListMixin from "./AriaListMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapSelectionMixin from "./TapSelectionMixin.js";

export default class TabStrip extends AriaListMixin(
  TapSelectionMixin(
    DirectionSelectionMixin(
      KeyboardDirectionMixin(
        KeyboardMixin(
          LanguageDirectionMixin(
            SingleSelectionMixin(SlotItemsMixin(ReactiveElement))
          )
        )
      )
    )
  )
) {
  orientation: "horizontal" | "vertical";
  position: "bottom" | "left" | "right" | "top";
  tabAlign: "start" | "center" | "end" | "stretch";
}
