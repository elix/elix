import { booleanAttributeValue } from "../core/AttributeMarshallingMixin.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  goFirst,
  goLast,
  goNext,
  goPrevious,
  raiseChangeEvents,
  rendered,
  setState,
  state,
} from "./internal.js";

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
        const value = booleanAttributeValue(name, newValue);
        if (this.currentItemRequired !== value) {
          this.currentItemRequired = value;
        }
      } else if (name === "cursor-operations-wrap") {
        const value = booleanAttributeValue(name, newValue);
        if (this.cursorOperationsWrap !== value) {
          this.cursorOperationsWrap = value;
        }
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    /**
     * The index of the current item, or -1 if no item is current.
     *
     * @type {number}
     */
    get currentIndex() {
      const { items, currentIndex } = this[state];
      return items && items.length > 0 ? currentIndex : -1;
    }
    set currentIndex(currentIndex) {
      if (!isNaN(currentIndex)) {
        this[setState]({ currentIndex });
      }
    }

    /**
     * The current item, or null if no item is current.
     *
     * @type {Element}
     */
    get currentItem() {
      const { items, currentIndex } = this[state];
      return items && items[currentIndex];
    }
    set currentItem(currentItem) {
      const { items } = this[state];
      if (!items) {
        return;
      }
      const currentIndex = items.indexOf(currentItem);
      this[setState]({ currentIndex });
    }

    /**
     * True if the list should always have a current item (if it has items).
     *
     * @type {boolean}
     * @default false
     */
    get currentItemRequired() {
      return this[state].currentItemRequired;
    }
    set currentItemRequired(currentItemRequired) {
      this[setState]({ currentItemRequired });
    }

    /**
     * True if cursor operations wrap from last to first, and vice versa.
     *
     * @type {boolean}
     * @default false
     */
    get cursorOperationsWrap() {
      return this[state].cursorOperationsWrap;
    }
    set cursorOperationsWrap(cursorOperationsWrap) {
      this[setState]({ cursorOperationsWrap });
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
      return this[goFirst]();
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
      return this[goLast]();
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
      return this[goNext]();
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
      return this[goPrevious]();
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }
      if (changed.currentIndex && this[raiseChangeEvents]) {
        const { currentIndex } = this[state];
        const oldEvent = new CustomEvent("current-index-changed", {
          bubbles: true,
          detail: { currentIndex },
        });
        this.dispatchEvent(oldEvent);
        /**
         * Raised when the `currentIndex` property changes.
         *
         * @event currentindexchanged
         */
        const event = new CustomEvent("currentindexchange", {
          bubbles: true,
          detail: { currentIndex },
        });
        this.dispatchEvent(event);
      }
    }
  }

  return CursorAPI;
}
