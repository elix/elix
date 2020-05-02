// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ComboBox from "./ComboBox.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

export default class ListComboBox extends CursorAPIMixin(
  DelegateItemsMixin(
    DirectionCursorMixin(ItemsCursorMixin(SingleSelectAPIMixin(ComboBox)))
  )
) {
  listPartType: PartDescriptor;
}
