import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { firstRender, raiseChangeEvents, rendered, state } from "./internal.js";

/**
 * Exposes a public API for the set of items in a list-like element
 *
 * @module ItemsAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ItemsAPIMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsAPI extends Base {
    /**
     * The current set of items drawn from the element's current state.
     *
     * @type {ListItemElement[]} the element's current items
     */
    get items() {
      return this[state] ? this[state].items : null;
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // Raise items-changed if items changed after the initial render. We'll
      // see changed.items on initial render, and raiseChangeEvents will be true
      // if we're using SlotContentMixin, but we don't want to actually raise
      // the event then because the items didn't change in response to user
      // activity.
      if (!this[firstRender] && changed.items && this[raiseChangeEvents]) {
        /**
         * Raised when the `items` property changes.
         *
         * @event items-changed
         */
        const event = new CustomEvent("items-changed", {
          bubbles: true,
        });
        this.dispatchEvent(event);
      }
    }
  }

  return ItemsAPI;
}
