import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  closestAvailableItem,
  defaultState,
  goFirst,
  goLast,
  goNext,
  goPrevious,
  itemAvailableInState,
  setState,
  state,
  stateEffects,
} from "./internal.js";

/**
 * Tracks and navigates the current item in a set of items
 *
 * @module ItemsCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ItemsCursorMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsCursor extends Base {
    /**
     * Look for an item which is available in the given state. Start at the
     * indicated index, and move in the indicated direction (-1 to move backward
     * the items, 1 to move forward).
     *
     * @param {PlainObject} state
     * @param {number} index
     * @param {number} direction
     * @returns {number}
     */
    [closestAvailableItem](state, index, direction) {
      const { cursorOperationsWrap, items } = state;
      const count = items ? items.length : 0;

      if (count === 0) {
        // No items
        return -1;
      }

      if (cursorOperationsWrap) {
        // Search with wrapping.

        // Modulus taking into account negative numbers.
        let i = ((index % count) + count) % count;
        const end = (((i - direction) % count) + count) % count;
        while (i !== end) {
          if (this[itemAvailableInState](items[i], state)) {
            return i;
          }
          // See modulus note above.
          i = (((i + direction) % count) + count) % count;
        }
      } else {
        // Search without wrapping.
        for (let i = index; i >= 0 && i < count; i += direction) {
          if (this[itemAvailableInState](items[i], state)) {
            return i;
          }
        }
      }

      return -1; // No item found
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        currentIndex: -1,
        currentIndexPending: null,
        currentItem: null,
        currentItemRequired: false,
        cursorOperationsWrap: false,
      });
    }

    /**
     * Move to the first item in the set.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goFirst]() {
      if (super[goFirst]) {
        super[goFirst]();
      }
      return moveToIndex(this, 0, 1);
    }

    /**
     * Move to the last item in the set.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goLast]() {
      if (super[goLast]) {
        super[goLast]();
      }
      return moveToIndex(this, this[state].items.length - 1, -1);
    }

    /**
     * Move to the next item in the set.
     *
     * If no item is current, move to the first item.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goNext]() {
      if (super[goNext]) {
        super[goNext]();
      }
      const { currentIndex, items } = this[state];
      const start = currentIndex < 0 && items ? 0 : currentIndex + 1;
      return moveToIndex(this, start, 1);
    }

    /**
     * Move to the previous item in the set.
     *
     * If no item is current, move to the last item.
     *
     * @protected
     * @returns {Boolean} True if the current item changed, false if not.
     */
    [goPrevious]() {
      if (super[goPrevious]) {
        super[goPrevious]();
      }
      const { currentIndex, items } = this[state];
      const start =
        currentIndex < 0 && items ? items.length - 1 : currentIndex - 1;
      return moveToIndex(this, start, -1);
    }

    /**
     * Returns true if the given item is available in the indicated state.
     *
     * @param {ListItemElement} item
     * @param {PlainObject} state
     * @returns {boolean}
     */
    [itemAvailableInState](item, state) {
      return super[itemAvailableInState]
        ? super[itemAvailableInState](item, state)
        : true;
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Ensure currentIndex is valid.
      if (
        changed.items ||
        changed.currentIndex ||
        changed.currentItemRequired
      ) {
        const {
          items,
          currentIndex,
          currentIndexPending,
          currentItem,
          currentItemRequired,
        } = state;

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
        let newIndexPending = currentIndexPending;
        if (newIndex >= count) {
          // The requested index is beyond the bounds of the items array -- but
          // the items array may increase in size later. We remember which index
          // was requested as a pending index.
          newIndexPending = newIndex;
          // For now, force the index to be within bounds. If items array is
          // null or empty, this will be -1 (no selection).
          newIndex = count - 1;
        } else if (changed.items && currentIndexPending !== null) {
          if (currentIndexPending < count) {
            // The items array has increased in size to the point where a pending
            // index can be applied and then discarded.
            newIndex = currentIndexPending;
            newIndexPending = null;
          } else {
            // Pick last index -- as close to pending index as we can get now.
            newIndex = count - 1;
          }
        } else if (newIndex === -1 && currentItemRequired && count > 0) {
          // We require a current item, don't have one yet, but do have items.
          // Take the 0th item as the current item.
          newIndex = 0;
        } else if (newIndex >= 0 && newIndex < count - 1) {
          // If a requested index is in bounds and not the last index, that
          // request supercedes any pending index.
          newIndexPending = null;
        } else {
          // Ensure index is at least -1 (no selection).
          newIndex = Math.max(newIndex, -1);
        }

        const newItem = items ? items[newIndex] : null;
        Object.assign(effects, {
          currentIndex: newIndex,
          currentIndexPending: newIndexPending,
          currentItem: newItem,
        });
      }

      return effects;
    }
  }

  return ItemsCursor;
}

/**
 * Update currentIndex and return true if it changed.
 *
 * @private
 * @param {Element} element
 * @param {number} start
 * @param {number} direction
 */
function moveToIndex(element, start, direction) {
  const index = element[closestAvailableItem](element[state], start, direction);
  if (index < 0) {
    // Couldn't find an item to move to.
    return false;
  }
  // Normally we don't check to see if state is going to change before setting
  // state, but the methods defined by this mixin want to be able to return true
  // if the index is actually going to change.
  const changed = element[state].currentIndex !== index;
  if (changed) {
    element[setState]({ currentIndex: index });
  }
  return changed;
}
