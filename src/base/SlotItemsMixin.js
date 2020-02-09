import ContentItemsMixin from "./ContentItemsMixin.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import SlotContentMixin from "./SlotContentMixin.js";

/**
 * Treats the elements assigned to the default slot as list items
 *
 * This is simply a combination of
 * [ContentItemsMixin](ContentItemsMixin) and
 * [SlotContentMixin](SlotContentMixin).
 *
 * @module SlotItemsMixin
 * @mixes ContentItemsMixin
 * @mixes SlotContentMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SlotItemsMixin(Base) {
  return ContentItemsMixin(SlotContentMixin(Base));
}
