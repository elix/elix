// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ListComboBox from './ListComboBox.js';
import SlotContentMixin from './SlotContentMixin.js';

export default class FilterComboBox extends SlotContentMixin(ListComboBox) {}
