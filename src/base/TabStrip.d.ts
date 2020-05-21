// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import AriaListMixin from "./AriaListMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SelectCurrentMixin from "./SelectCurrentMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

export default class TabStrip extends AriaListMixin(
  CursorAPIMixin(
    DirectionCursorMixin(
      ItemsAPIMixin(
        ItemsCursorMixin(
          KeyboardDirectionMixin(
            KeyboardMixin(
              LanguageDirectionMixin(
                SelectCurrentMixin(
                  SingleSelectAPIMixin(
                    SlotItemsMixin(TapCursorMixin(ReactiveElement))
                  )
                )
              )
            )
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
