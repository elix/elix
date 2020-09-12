// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorInViewMixin from "./CursorInViewMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import ItemsMultiSelectMixin from "./ItemsMultiSelectMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedCursorMixin from "./KeyboardPagedCursorMixin.js";
import KeyboardPrefixCursorMixin from "./KeyboardPrefixCursorMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import MultiSelectAPIMixin from "./MultiSelectAPIMixin.js";
import MultiSelectToggleMixin from "./MultiSelectToggleMixin.js";
import MultiSelectValueAPIMixin from "./MultiSelectValueAPIMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

export default class MultiSelectListBox extends AriaListMixin(
  ComposedFocusMixin(
    CursorAPIMixin(
      CursorInViewMixin(
        DirectionCursorMixin(
          FocusVisibleMixin(
            ItemsAPIMixin(
              ItemsCursorMixin(
                ItemsMultiSelectMixin(
                  ItemsTextMixin(
                    KeyboardDirectionMixin(
                      KeyboardMixin(
                        KeyboardPagedCursorMixin(
                          KeyboardPrefixCursorMixin(
                            LanguageDirectionMixin(
                              MultiSelectAPIMixin(
                                MultiSelectToggleMixin(
                                  MultiSelectValueAPIMixin(
                                    SingleSelectAPIMixin(
                                      SlotItemsMixin(
                                        TapCursorMixin(ReactiveElement)
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
          )
        )
      )
    )
  )
) {}
