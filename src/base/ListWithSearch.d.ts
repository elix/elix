// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

export default class ListWithSearch extends ComposedFocusMixin(
  DelegateFocusMixin(
    DelegateInputSelectionMixin(
      DelegateItemsMixin(
        DirectionCursorMixin(
          KeyboardMixin(
            SelectedItemTextValueMixin(SingleSelectAPIMixin(ReactiveElement))
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
