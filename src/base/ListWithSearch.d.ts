// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

export default class ListWithSearch extends ComposedFocusMixin(
  CursorAPIMixin(
    CursorSelectMixin(
      DelegateFocusMixin(
        DelegateInputLabelMixin(
          DelegateInputSelectionMixin(
            DelegateItemsMixin(
              FocusVisibleMixin(
                KeyboardMixin(SingleSelectAPIMixin(ReactiveElement))
              )
            )
          )
        )
      )
    )
  )
) {
  filter: string;
  inputPartType: PartDescriptor;
  listPartType: PartDescriptor;
  placeholder: string;
}
