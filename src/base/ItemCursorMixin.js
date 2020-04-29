import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Tracks which of a set of items is the current item
 *
 * @module ItemCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ItemCursorMixin(Base) {
  // The class prototype added by the mixin.
  class ItemCursor extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        canGoNext: false,
        canGoPrevious: false,
        currentIndex: -1,
        currentItem: null,
        currentItemRequired: false,
        cursorOperationsWrap: false,
      });
    }

    /**
     * Move to the first item in the set.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    [internal.goFirst]() {
      if (super[internal.goFirst]) {
        super[internal.goFirst]();
      }
      return moveToIndex(this, 0);
    }

    /**
     * Move to the last item in the set.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    [internal.goLast]() {
      if (super[internal.goLast]) {
        super[internal.goLast]();
      }
      return moveToIndex(this, this[internal.state].items.length - 1);
    }

    /**
     * Move to the next item in the set.
     *
     * If no item is current, move to the first item.
     *
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [internal.goNext]() {
      if (super[internal.goNext]) {
        super[internal.goNext]();
      }
      let index;
      const { items, currentIndex, cursorOperationsWrap } = this[
        internal.state
      ];
      if (
        (items && currentIndex === -1) ||
        (cursorOperationsWrap && currentIndex === items.length - 1)
      ) {
        // No item is current, or we're on the last item and cursor operations
        // wrap. Move to the first item.
        index = 0;
      } else if (currentIndex < items.length - 1) {
        // Move to the next item.
        index = currentIndex + 1;
      } else {
        // Already on last item, can't go next.
        return false;
      }
      return moveToIndex(this, index);
    }

    /**
     * Move to the previous item in the set.
     *
     * If no item is current, move to the last item.
     *
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [internal.goPrevious]() {
      if (super[internal.goPrevious]) {
        super[internal.goPrevious]();
      }
      let index;
      const { items, currentIndex, cursorOperationsWrap } = this[
        internal.state
      ];
      if (
        (items && currentIndex === -1) ||
        (cursorOperationsWrap && currentIndex === 0)
      ) {
        // No item is current, or we're on the first item and cursor operations
        // wrap. Move to the last item.
        index = items.length - 1;
      } else if (currentIndex > 0) {
        // Move to the previous item.
        index = currentIndex - 1;
      } else {
        // Already on first item, can't go previous.
        return false;
      }
      return moveToIndex(this, index);
    }

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

        const count = items ? items.length : 0;
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
          // selection) regardless of what currentIndex was asked for.
          newIndex = Math.max(Math.min(newIndex, count - 1), -1);
        }

        const newItem = items ? items[newIndex] : null;
        Object.assign(effects, {
          currentIndex: newIndex,
          currentItem: newItem,
        });
      }

      // Update computed state members canGoNext/canGoPrevious.
      if (
        changed.currentIndex ||
        changed.cursorOperationsWrap ||
        changed.items
      ) {
        const { items, currentIndex, cursorOperationsWrap } = state;
        if (items) {
          const count = items.length;
          const canGoNext =
            count === 0
              ? false
              : cursorOperationsWrap || currentIndex !== count - 1;
          const canGoPrevious =
            count === 0 ? false : cursorOperationsWrap || currentIndex !== 0;
          Object.assign(effects, {
            canGoNext,
            canGoPrevious,
          });
        }
      }

      return effects;
    }
  }

  return ItemCursor;
}

/**
 * Update currentIndex and return true if it changed.
 *
 * @private
 * @param {Element} element
 * @param {number} index
 */
function moveToIndex(element, index) {
  // Normally we don't check to see if state is going to change before setting
  // state, but the methods defined by this mixin want to be able to return true
  // if the index is actually going to change.
  const changed = element[internal.state].currentIndex !== index;
  if (changed) {
    element[internal.setState]({ currentIndex: index });
  }
  return changed;
}
