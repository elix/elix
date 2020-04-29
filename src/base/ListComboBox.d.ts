// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ComboBox from "./ComboBox.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

export default class ListComboBox extends DelegateItemsMixin(
  DirectionSelectionMixin(SingleSelectAPIMixin(ComboBox))
) {
  listPartType: PartDescriptor;
}
