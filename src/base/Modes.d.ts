// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class Modes extends CursorAPIMixin(
  CursorSelectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement)))
    )
  )
) {}
