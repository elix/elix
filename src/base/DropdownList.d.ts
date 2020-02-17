// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import FormElementMixin from "./FormElementMixin.js";
import PlainMenuButton from "../plain/PlainMenuButton.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class PlainDropdownList extends FormElementMixin(
  SelectedItemTextValueMixin(
    SingleSelectionMixin(SlotItemsMixin(PlainMenuButton))
  )
) {
  defaultMenuSelectedIndex: number;
  valuePartType: PartDescriptor;
}
