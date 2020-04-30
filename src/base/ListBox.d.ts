// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import CurrentItemInViewMixin from "./CurrentItemInViewMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedSelectionMixin from "./KeyboardPagedSelectionMixin.js";
import KeyboardPrefixSelectionMixin from "./KeyboardPrefixSelectionMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapSelectionMixin from "./TapSelectionMixin.js";

export default class ListBox extends AriaListMixin(
  ComposedFocusMixin(
    DirectionCursorMixin(
      FocusVisibleMixin(
        FormElementMixin(
          ItemsAPIMixin(
            ItemsTextMixin(
              KeyboardDirectionMixin(
                KeyboardMixin(
                  KeyboardPagedSelectionMixin(
                    KeyboardPrefixSelectionMixin(
                      LanguageDirectionMixin(
                        SelectedItemTextValueMixin(
                          CurrentItemInViewMixin(
                            SingleSelectAPIMixin(
                              SlotItemsMixin(TapSelectionMixin(ReactiveElement))
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
    )
  )
) {
  orientation: "horizontal" | "vertical";
}
