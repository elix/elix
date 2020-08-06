// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CursorAPIMixin from "./CursorAPIMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import PopupButton from "./PopupButton.js";
import PopupSelectMixin from "./PopupSelectMixin.js";
import SelectedTextAPIMixin from "./SelectedTextAPIMixin.js";
import SelectedValueAPIMixin from "./SelectedValueAPIMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class DropdownList extends CursorAPIMixin(
  DelegateInputLabelMixin(
    FormElementMixin(
      ItemsAPIMixin(
        ItemsCursorMixin(
          PopupSelectMixin(
            SelectedTextAPIMixin(
              SelectedValueAPIMixin(
                SingleSelectAPIMixin(SlotItemsMixin(PopupButton))
              )
            )
          )
        )
      )
    )
  )
) {
  valuePartType: PartDescriptor;
}
