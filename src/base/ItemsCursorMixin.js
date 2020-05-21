import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  goFirst,
  goLast,
  goNext,
  goPrevious,
  itemMatchesState,
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
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        canGoNext: false,
        canGoPrevious: false,
        currentIndex: -1,
        currentIndexPending: null,
        currentItem: null,
        currentItemRequired: false,
        cursorOperationsWrap: false,
        nextItemIndex: -1,
        previousItemIndex: -1,
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
      return moveToIndex(this, 0);
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
      return moveToIndex(this, this[state].items.length - 1);
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
      const { nextItemIndex } = this[state];
      return nextItemIndex < 0 ? false : moveToIndex(this, nextItemIndex);
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
      const { previousItemIndex } = this[state];
      return previousItemIndex < 0
        ? false
        : moveToIndex(this, previousItemIndex);
    }

    /**
     * Returns true if the given item should be shown in the indicated state.
     *
     * @param {ListItemElement} item
     * @param {PlainObject} state
     * @returns {boolean}
     */
    [itemMatchesState](item, state) {
      return super[itemMatchesState]
        ? super[itemMatchesState](item, state)
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

      // Update computed state members nextItemIndex/previousItemIndex.
      if (
        changed.currentIndex ||
        changed.cursorOperationsWrap ||
        changed.filter ||
        changed.items
      ) {
        const nextItemIndex = findClosestItemMatchingState(this, state, 1);
        const previousItemIndex = findClosestItemMatchingState(this, state, -1);
        Object.assign(effects, {
          nextItemIndex,
          previousItemIndex,
        });
      }

      return effects;
    }
  }

  return ItemsCursor;
}

function findClosestItemMatchingState(element, state, direction) {
  const { currentIndex, cursorOperationsWrap, items } = state;
  const count = items ? items.length : 0;

  if (count === 0) {
    // No items
    return -1;
  }

  // Special cases
  let start;
  if (currentIndex === -1) {
    start = direction > 0 ? 0 : count - 1;
  } else {
    start = currentIndex + direction;
  }

  if (cursorOperationsWrap) {
    // Modulus taking into account negative numbers.
    let i = ((start % count) + count) % count;
    while (i !== currentIndex) {
      if (element[itemMatchesState](items[i], state)) {
        return i;
      }
      // Modulus taking into account negative numbers.
      i = (((i + direction) % count) + count) % count;
    }
  } else {
    for (let i = start; i >= 0 && i < count; i += direction) {
      if (element[itemMatchesState](items[i], state)) {
        return i;
      }
    }
  }

  return -1;
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
  const changed = element[state].currentIndex !== index;
  if (changed) {
    element[setState]({ currentIndex: index });
  }
  return changed;
}
