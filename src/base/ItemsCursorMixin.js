import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  closestAvailableItem,
  defaultState,
  goFirst,
  goLast,
  goNext,
  goPrevious,
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
          const available = state.availableItemFlags
            ? state.availableItemFlags[i]
            : true;
          if (available) {
            return i;
          }
          // See modulus note above.
          i = (((i + direction) % count) + count) % count;
        }
      } else {
        // Search without wrapping.
        for (let i = index; i >= 0 && i < count; i += direction) {
          const available = state.availableItemFlags
            ? state.availableItemFlags[i]
            : true;
          if (available) {
            return i;
          }
        }
      }

      return -1; // No item found
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        currentIndex: -1,
        desiredCurrentIndex: null,
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

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Ensure currentIndex is valid.
      if (
        changed.availableItemFlags ||
        changed.items ||
        changed.currentIndex ||
        changed.currentItemRequired
      ) {
        const {
          availableItemFlags,
          currentIndex,
          desiredCurrentIndex,
          currentItem,
          currentItemRequired,
          cursorOperationsWrap,
          items,
        } = state;

        const count = items ? items.length : 0;
        let newIndex = currentIndex;
        let newDesiredIndex = desiredCurrentIndex;

        if (
          changed.items &&
          !changed.currentIndex &&
          count > 0 &&
          items[currentIndex] !== currentItem
        ) {
          // The items changed, and the item at the cursor is no longer the
          // same. See if we can find that item again in the list of items.
          const newItemIndex = items.indexOf(currentItem);
          if (newItemIndex >= 0) {
            // Found the item again. Try to use this index (if available).
            newIndex = newItemIndex;
          }
        } else if (
          changed.currentIndex &&
          count > 0 &&
          items[currentIndex] !== currentItem &&
          desiredCurrentIndex !== null
        ) {
          // Someone explicitly moved the cursor, which trumps any previously
          // desired index.
          newDesiredIndex = null;
        } else if (
          desiredCurrentIndex !== null &&
          (!availableItemFlags || availableItemFlags[desiredCurrentIndex])
        ) {
          // A previously desired index is now available; apply it.
          newIndex = newDesiredIndex;
          newDesiredIndex = null;
        }

        if (currentItemRequired && newIndex < 0 && count > 0) {
          // We require a current item, don't have one yet, but do have items.
          // Take the first available item.
          newIndex = 0;
        }

        if (newIndex < 0) {
          // All negative indices are equivalent to -1.
          newIndex = -1;
        } else {
          // We know what item we would like to make current, but it may not be
          // available.
          const attemptedIndex = newIndex;
          // Clamp index to array bounds.
          newIndex = Math.max(Math.min(count - 1, newIndex), 0);
          // Look for an available item, first counting up, then down.
          // TODO: closestAvailableItem shouldn't wrap even if
          // cursorOperationsWrap is true
          newIndex = this[closestAvailableItem](state, newIndex, 1);
          if (newIndex < 0) {
            newIndex = this[closestAvailableItem](state, newIndex - 1, -1);
          }
          if (newIndex !== attemptedIndex) {
            // The requested index is beyond the bounds of the items array or
            // unavailable -- but remember this as the desired index in case later
            // the items array increases in size or the items becomes available.
            newDesiredIndex = attemptedIndex;
          }
        }

        const newItem = items ? items[newIndex] : null;
        Object.assign(effects, {
          currentIndex: newIndex,
          desiredCurrentIndex: newDesiredIndex,
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
