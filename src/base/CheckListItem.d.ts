// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import SelectableMixin from "./SelectableMixin.js";

export default class CheckListItem extends SelectableMixin(ReactiveElement) {
  selected: boolean;
}
