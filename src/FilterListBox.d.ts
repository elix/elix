// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ListBox from './ListBox.js';

export default class FilterListBox extends ListBox {
  filter: string;
}
