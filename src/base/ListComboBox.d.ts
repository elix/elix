// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ComboBox from "./ComboBox.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import DelegateCursorMixin from "./DelegateCursorMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

export default class ListComboBox extends CursorAPIMixin(
  CursorSelectMixin(
    DelegateCursorMixin(DelegateItemsMixin(SingleSelectAPIMixin(ComboBox)))
  )
) {
  listPartType: PartDescriptor;
}
