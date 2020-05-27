// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import AriaMenuMixin from "./AriaMenuMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorInViewMixin from "./CursorInViewMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedCursorMixin from "./KeyboardPagedCursorMixin.js";
import KeyboardPrefixCursorMixin from "./KeyboardPrefixCursorMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

export default class Menu extends AriaMenuMixin(
  CursorAPIMixin(
    CursorInViewMixin(
      DelegateFocusMixin(
        DirectionCursorMixin(
          ItemsAPIMixin(
            ItemsCursorMixin(
              ItemsTextMixin(
                KeyboardDirectionMixin(
                  KeyboardMixin(
                    KeyboardPagedCursorMixin(
                      KeyboardPrefixCursorMixin(
                        LanguageDirectionMixin(
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
      )
    )
  )
) {
  flashCurrentItem(): Promise<void>;
}
