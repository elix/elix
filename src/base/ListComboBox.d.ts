// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ComboBox from "./ComboBox.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

export default class ListComboBox extends DelegateItemsMixin(
  DirectionCursorMixin(SingleSelectAPIMixin(ComboBox))
) {
  listPartType: PartDescriptor;
}
