import { booleanAttributeValue } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Exposes a public API for navigating a cursor over a set of items
 *
 * This mixin expects a component to provide an `items` Array of all elements in
 * the list. This mixin also expects the component to apply
 * [ItemsCursorMixin](ItemsCursorMixin) or otherwise define a compatible
 * `currentIndex` state and other state members for navigating the current item.
 *
 * Given the above, this mixin exposes a consistent public API for reading and
 * manipulating the cursor.
 *
 * @module CursorAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function CursorAPIMixin(Base) {
  // The class prototype added by the mixin.
  class CursorAPI extends Base {
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "current-index") {
        this.currentIndex = Number(newValue);
      } else if (name === "current-item-required") {
        this.currentItemRequired = booleanAttributeValue(name, newValue);
      } else if (name === "cursor-operations-wrap") {
        this.cursorOperationsWrap = booleanAttributeValue(name, newValue);
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    /**
     * True if the item cursor can be moved to the next item, false if not (the
     * current item is the last item in the list).
     *
     * @type {boolean}
     */
    get canGoNext() {
      return this[internal.state].canGoNext;
    }

    /**
     * True if the item cursor can be moved to the previous item, false if not
     * (the current item is the first one in the list).
     *
     * @type {boolean}
     */
    get canGoPrevious() {
      return this[internal.state].canGoPrevious;
    }

    /**
     * The index of the current item, or -1 if no item is current.
     *
     * @type {number}
     */
    get currentIndex() {
      const { items, currentIndex } = this[internal.state];
      return items && items.length > 0 ? currentIndex : -1;
    }
    set currentIndex(currentIndex) {
      this[internal.setState]({ currentIndex });
    }

    /**
     * The current item, or null if no item is current.
     *
     * @type {Element}
     */
    get currentItem() {
      const { items, currentIndex } = this[internal.state];
      return items && items[currentIndex];
    }
    set currentItem(currentItem) {
      const { items } = this[internal.state];
      if (!items) {
        return;
      }
      const currentIndex = items.indexOf(currentItem);
      if (currentIndex >= 0) {
        this[internal.setState]({ currentIndex });
      }
    }

    /**
     * True if the list should always have a current item (if it has items).
     *
     * @type {boolean}
     * @default false
     */
    get currentItemRequired() {
      return this[internal.state].currentItemRequired;
    }
    set currentItemRequired(currentItemRequired) {
      this[internal.setState]({ currentItemRequired });
    }

    /**
     * True if cursor operations wrap from last to first, and vice versa.
     *
     * @type {boolean}
     * @default false
     */
    get cursorOperationsWrap() {
      return this[internal.state].cursorOperationsWrap;
    }
    set cursorOperationsWrap(cursorOperationsWrap) {
      this[internal.setState]({ cursorOperationsWrap });
    }

    /**
     * Moves to the first item in the list.
     *
     * @returns {Boolean} True if the current item changed, false if not.
     */
    goFirst() {
      if (super.goFirst) {
        super.goFirst();
      }
      return this[internal.goFirst]();
    }

    /**
     * Move to the last item in the list.
     *
     * @returns {Boolean} True if the current item changed
     */
    goLast() {
      if (super.goLast) {
        super.goLast();
      }
      return this[internal.goLast]();
    }

    /**
     * Move to the next item in the list.
     *
     * If the list has no current item, the first item will become current.
     *
     * @returns {Boolean} True if the current item changed
     */
    goNext() {
      if (super.goNext) {
        super.goNext();
      }
      return this[internal.goNext]();
    }

    /**
     * Moves to the previous item in the list.
     *
     * If the list has no current item, the last item will become current.
     *
     * @returns {Boolean} True if the current item changed
     */
    goPrevious() {
      if (super.goPrevious) {
        super.goPrevious();
      }
      return this[internal.goPrevious]();
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      if (changed.currentIndex && this[internal.raiseChangeEvents]) {
        const { currentIndex } = this[internal.state];
        /**
         * Raised when the `currentIndex` property changes.
         *
         * @event current-index-changed
         */
        const event = new CustomEvent("current-index-changed", {
          detail: { currentIndex },
        });
        this.dispatchEvent(event);
      }
    }
  }

  return CursorAPI;
}
