import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Tracks which of a set of items is the current item
 *
 * @module CurrentItemMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function CurrentItemMixin(Base) {
  // The class prototype added by the mixin.
  class CurrentItem extends Base {
    // /**
    //  * True if the selection can be moved to the next item, false if not (the
    //  * selected item is the last item in the list).
    //  *
    //  * @type {boolean}
    //  */
    // get canSelectNext() {
    //   return this[internal.state].canSelectNext;
    // }
    // /**
    //  * True if the selection can be moved to the previous item, false if not
    //  * (the selected item is the first one in the list).
    //  *
    //  * @type {boolean}
    //  */
    // get canSelectPrevious() {
    //   return this[internal.state].canSelectPrevious;
    // }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        // canSelectNext: null,
        // canSelectPrevious: null,
        currentIndex: -1,
        currentItem: null,
        currentItemRequired: false,
        // selectionWraps: false,
      });
    }

    // [internal.rendered](/** @type {ChangedFlags} */ changed) {
    //   if (super[internal.rendered]) {
    //     super[internal.rendered](changed);
    //   }
    //   if (changed.selectedIndex && this[internal.raiseChangeEvents]) {
    //     const selectedIndex = this[internal.state].selectedIndex;
    //     /**
    //      * Raised when the `selectedIndex` property changes.
    //      *
    //      * @event selected-index-changed
    //      */
    //     const event = new CustomEvent("selected-index-changed", {
    //       detail: { selectedIndex },
    //     });
    //     this.dispatchEvent(event);
    //   }
    // }
    // /**
    //  * Select the first item in the list.
    //  *
    //  * @returns {Boolean} True if the selection changed, false if not.
    //  */
    // selectFirst() {
    //   if (super.selectFirst) {
    //     super.selectFirst();
    //   }
    //   return updateSelectedIndex(this, 0);
    // }
    // /**
    //  * The index of the currently-selected item, or -1 if no item is selected.
    //  *
    //  * @type {number}
    //  */
    // get selectedIndex() {
    //   const { items, selectedIndex } = this[internal.state];
    //   return items && items.length > 0 ? selectedIndex : -1;
    // }
    // set selectedIndex(selectedIndex) {
    //   const parsed = Number(selectedIndex);
    //   if (!isNaN(parsed)) {
    //     this[internal.setState]({
    //       selectedIndex: parsed,
    //     });
    //   }
    // }
    // /**
    //  * The currently-selected item, or null if no item is selected.
    //  *
    //  * @type {Element}
    //  */
    // get selectedItem() {
    //   const { items, selectedIndex } = this[internal.state];
    //   return items && items[selectedIndex];
    // }
    // set selectedItem(selectedItem) {
    //   const { items } = this[internal.state];
    //   if (!items) {
    //     return;
    //   }
    //   const selectedIndex = items.indexOf(selectedItem);
    //   if (selectedIndex >= 0) {
    //     this[internal.setState]({ selectedIndex });
    //   }
    // }
    // /**
    //  * True if the list should always have a selection (if it has items).
    //  *
    //  * @type {boolean}
    //  * @default false
    //  */
    // get selectionRequired() {
    //   return this[internal.state].selectionRequired;
    // }
    // set selectionRequired(selectionRequired) {
    //   this[internal.setState]({
    //     selectionRequired: String(selectionRequired) === "true",
    //   });
    // }
    // /**
    //  * True if selection navigations wrap from last to first, and vice versa.
    //  *
    //  * @type {boolean}
    //  * @default false
    //  */
    // get selectionWraps() {
    //   return this[internal.state].selectionWraps;
    // }
    // set selectionWraps(selectionWraps) {
    //   this[internal.setState]({
    //     selectionWraps: String(selectionWraps) === "true",
    //   });
    // }
    // /**
    //  * Select the last item in the list.
    //  *
    //  * @returns {Boolean} True if the selection changed, false if not.
    //  */
    // selectLast() {
    //   if (super.selectLast) {
    //     super.selectLast();
    //   }
    //   return updateSelectedIndex(this, this[internal.state].items.length - 1);
    // }
    // /**
    //  * Select the next item in the list.
    //  *
    //  * If the list has no selection, the first item will be selected.
    //  *
    //  * @returns {Boolean} True if the selection changed, false if not.
    //  */
    // selectNext() {
    //   if (super.selectNext) {
    //     super.selectNext();
    //   }
    //   return updateSelectedIndex(this, this[internal.state].selectedIndex + 1);
    // }
    // /**
    //  * Select the previous item in the list.
    //  *
    //  * If the list has no selection, the last item will be selected.
    //  *
    //  * @returns {Boolean} True if the selection changed, false if not.
    //  */
    // selectPrevious() {
    //   if (super.selectPrevious) {
    //     super.selectPrevious();
    //   }
    //   let newIndex;
    //   const { items, selectedIndex, selectionWraps } = this[internal.state];
    //   if (
    //     (items && selectedIndex < 0) ||
    //     (selectionWraps && selectedIndex === 0)
    //   ) {
    //     // No selection yet, or we're on the first item, and selection wraps.
    //     // In either case, select the last item.
    //     newIndex = items.length - 1;
    //   } else if (selectedIndex > 0) {
    //     // Select the previous item.
    //     newIndex = selectedIndex - 1;
    //   } else {
    //     // Already on first item, can't go previous.
    //     return false;
    //   }
    //   return updateSelectedIndex(this, newIndex);
    // }

    [internal.stateEffects](state, changed) {
      const effects = super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};

      // Ensure currentIndex is valid.
      if (
        changed.items ||
        changed.currentIndex ||
        changed.currentItemRequired
      ) {
        const { items, currentIndex, currentItem, currentItemRequired } = state;
        let newIndex = currentIndex;

        if (changed.items && items && !changed.currentIndex) {
          // The index stayed the same, but the item may have moved.
          if (items[currentIndex] !== currentItem) {
            // The item moved or was removed. See if we can find the item again
            // in the list of items.
            const newItemIndex = items.indexOf(currentItem);
            if (newItemIndex >= 0) {
              // Found the item again. Update the index to match.
              newIndex = newItemIndex;
            }
          }
        }

        const count = items.length;
        if (items === null) {
          // If items are null, we haven't received items yet. Leave the index
          // alone, as it may be set later through markup; we'll want to
          // validate it only after we have items.
        } else if (newIndex === -1 && currentItemRequired && count > 0) {
          // We require a current item, don't have one yet, but do have items.
          // Take the 0th item as the current item.
          newIndex = 0;
        } else {
          // Force index within bounds of -1 (no selection) to array length-1.
          // This logic also handles the case where there are no items
          // (count=0), which will produce a validated index of -1 (no
          // selection) regardless of what selectedIndex was asked for.
          newIndex = Math.max(Math.min(newIndex, count - 1), -1);
        }

        const newItem = items ? items[newIndex] : null;
        Object.assign(effects, {
          currentIndex: newIndex,
          currentItem: newItem,
        });
      }

      // // Update computed state members canSelectNext/canSelectPrevious.
      // if (changed.items || changed.selectedIndex || changed.selectionWraps) {
      //   const { items, selectedIndex, selectionWraps } = state;
      //   if (items) {
      //     const count = items.length;
      //     const canSelectNext =
      //       count === 0
      //         ? false
      //         : selectionWraps ||
      //           selectedIndex < 0 ||
      //           selectedIndex < count - 1;
      //     const canSelectPrevious =
      //       count === 0
      //         ? false
      //         : selectionWraps || selectedIndex < 0 || selectedIndex > 0;
      //     Object.assign(effects, {
      //       canSelectNext,
      //       canSelectPrevious,
      //     });
      //   }
      // }

      return effects;
    }
  }

  return CurrentItem;
}
