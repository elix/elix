// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import SelectCurrentMixin from "./SelectCurrentMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class Modes extends CursorAPIMixin(
  ItemsAPIMixin(
    ItemsCursorMixin(
      SelectCurrentMixin(SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement)))
    )
  )
) {}
