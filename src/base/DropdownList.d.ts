// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CursorAPIMixin from "./CursorAPIMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import MenuButton from "./MenuButton.js";
import SelectedTextAPIMixin from "./SelectedTextAPIMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class PlainDropdownList extends CursorAPIMixin(
  FormElementMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        SelectedTextAPIMixin(SingleSelectAPIMixin(SlotItemsMixin(MenuButton)))
      )
    )
  )
) {
  defaultMenuSelectedIndex: number;
  valuePartType: PartDescriptor;
}
