// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import FilterListBox from "./FilterListBox.js";
import KeyboardMixin from "./KeyboardMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";

export default class ListWithSearch extends ComposedFocusMixin(
  DelegateFocusMixin(
    DelegateItemsMixin(
      DirectionSelectionMixin(
        KeyboardMixin(
          SelectedItemTextValueMixin(SingleSelectionMixin(ReactiveElement))
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
