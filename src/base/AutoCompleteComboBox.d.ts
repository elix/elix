// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AutoCompleteInput from "./AutoCompleteInput.js";
import ListComboBox from "./ListComboBox.js";
import ItemsTextMixin from "./ItemsTextMixin.js";

export default class AutoCompleteComboBox extends ItemsTextMixin(
  ListComboBox
) {}
