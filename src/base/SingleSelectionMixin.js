import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Exposes a public API for single selection on a list-like element
 *
 * This mixin expects a component to provide an `items` Array of all elements in
 * the list. This mixin also expects the component to apply
 * [ItemsCursorMixin](ItemsCursorMixin) or otherwise define a compatible
 * `currentIndex` state and other state members for navigating the current item.
 *
 * Given the above, this mixin exposes a consistent public API for reading and
 * manipulating the current item as a selection. This includes public members
 * `selectedIndex` and `selectedItem`, selection navigation methods, and a
 * `selected-index-changed` event.
 *
 * This mixin does not produce any user-visible effects to represent selection;
 * that is up to the component to provide.
 *
 * @module SingleSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SingleSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class SingleSelection extends Base {
    /**
     * True if the selection can be moved to the next item, false if not (the
     * selected item is the last item in the list).
     *
     * @type {boolean}
     */
    get canSelectNext() {
      return this[internal.state].canGoNext;
    }

    /**
     * True if the selection can be moved to the previous item, false if not
     * (the selected item is the first one in the list).
     *
     * @type {boolean}
     */
    get canSelectPrevious() {
      return this[internal.state].canGoPrevious;
    }

    /**
     * The current set of items drawn from the element's current state.
     *
     * @type {ListItemElement[]|null} the element's current items
     */
    get items() {
      return this[internal.state] ? this[internal.state].items : null;
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      if (changed.currentIndex && this[internal.raiseChangeEvents]) {
        const selectedIndex = this[internal.state].currentIndex;
        /**
         * Raised when the `selectedIndex` property changes.
         *
         * @event selected-index-changed
         */
        const event = new CustomEvent("selected-index-changed", {
          detail: { selectedIndex },
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * Select the first item in the list.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectFirst() {
      if (super.selectFirst) {
        super.selectFirst();
      }
      return this[internal.goFirst]();
    }

    /**
     * The index of the currently-selected item, or -1 if no item is selected.
     *
     * @type {number}
     */
    get selectedIndex() {
      const { items, currentIndex } = this[internal.state];
      return items && items.length > 0 ? currentIndex : -1;
    }
    set selectedIndex(selectedIndex) {
      const parsed = Number(selectedIndex);
      if (!isNaN(parsed)) {
        this[internal.setState]({
          currentIndex: parsed,
        });
      }
    }

    /**
     * The currently-selected item, or null if no item is selected.
     *
     * @type {Element}
     */
    get selectedItem() {
      const { items, currentIndex } = this[internal.state];
      return items && items[currentIndex];
    }
    set selectedItem(selectedItem) {
      const { items } = this[internal.state];
      if (!items) {
        return;
      }
      const index = items.indexOf(selectedItem);
      if (index >= 0) {
        this[internal.setState]({ currentIndex: index });
      }
    }

    /**
     * True if the list should always have a selection (if it has items).
     *
     * @type {boolean}
     * @default false
     */
    get selectionRequired() {
      return this[internal.state].currentItemRequired;
    }
    set selectionRequired(selectionRequired) {
      this[internal.setState]({
        currentItemRequired: String(selectionRequired) === "true",
      });
    }

    /**
     * True if selection navigations wrap from last to first, and vice versa.
     *
     * @type {boolean}
     * @default false
     */
    get selectionWraps() {
      return this[internal.state].cursorOperationsWrap;
    }
    set selectionWraps(selectionWraps) {
      this[internal.setState]({
        cursorOperationsWrap: String(selectionWraps) === "true",
      });
    }

    /**
     * Select the last item in the list.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectLast() {
      if (super.selectLast) {
        super.selectLast();
      }
      return this[internal.goLast]();
    }

    /**
     * Select the next item in the list.
     *
     * If the list has no selection, the first item will be selected.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectNext() {
      if (super.selectNext) {
        super.selectNext();
      }
      return this[internal.goNext]();
    }

    /**
     * Select the previous item in the list.
     *
     * If the list has no selection, the last item will be selected.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectPrevious() {
      if (super.selectPrevious) {
        super.selectPrevious();
      }
      return this[internal.goPrevious]();
    }
  }

  return SingleSelection;
}
