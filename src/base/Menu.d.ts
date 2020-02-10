// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaMenuMixin from "./AriaMenuMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
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

export default class MenuBase extends AriaMenuMixin(
  DelegateFocusMixin(
    DirectionSelectionMixin(
      FocusVisibleMixin(
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
) {
  highlightSelectedItem(): Promise<void>;
}
