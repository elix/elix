import ContentItemsMixin from './ContentItemsMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


/**
 * Mixin which lets a component treats the elements assigned to its default slot
 * as items. This is simply a combination of
 * [ContentItemsMixin](ContentItemsMixin) and
 * SlotContentMixin(SlotContentMixin).
 * 
 * @module SlotItemsMixin
 * @mixes ContentItemsMixin
 * @mixes SlotContentMixin
 */
export default function SlotItemsMixin(Base) {
  return ContentItemsMixin(SlotContentMixin(Base));
}
