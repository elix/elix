// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedSelectionMixin from "./KeyboardPagedSelectionMixin.js";
import KeyboardPrefixSelectionMixin from "./KeyboardPrefixSelectionMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SelectionInViewMixin from "./SelectionInViewMixin.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapSelectionMixin from "./TapSelectionMixin.js";

export default class ListBox extends AriaListMixin(
  ComposedFocusMixin(
    DirectionSelectionMixin(
      FocusVisibleMixin(
        FormElementMixin(
          ItemsTextMixin(
            KeyboardDirectionMixin(
              KeyboardMixin(
                KeyboardPagedSelectionMixin(
                  KeyboardPrefixSelectionMixin(
                    LanguageDirectionMixin(
                      SelectedItemTextValueMixin(
                        SelectionInViewMixin(
                          SingleSelectionMixin(
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
) {
  orientation: "horizontal" | "vertical";
}
