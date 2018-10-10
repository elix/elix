import ContentItemsMixin from './ContentItemsMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


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
 */
export default function SlotItemsMixin(Base) {
  return ContentItemsMixin(SlotContentMixin(Base));
}
