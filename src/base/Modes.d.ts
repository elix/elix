// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class Modes extends SingleSelectAPIMixin(
  SlotItemsMixin(ReactiveElement)
) {}
