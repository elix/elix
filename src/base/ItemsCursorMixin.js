import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  closestAvailableItemIndex,
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
     * Look for an item which is available in the given state..
     *
     * The `options` parameter can accept options for:
     *
     * * `direction`: 1 to move forward, -1 to move backward
     * * `index`: the index to start at, defaults to `state.currentIndex`
     * * `wrap`: whether to wrap around the ends of the `items` array, defaults
     *   to `state.cursorOperationsWrap`.
     *
     * If an available item was found, this returns its index. If no item was
     * found, this returns -1.
     *
     * @param {PlainObject} state
     * @param {PlainObject} options
     * @returns {number}
     */
    [closestAvailableItemIndex](state, options = {}) {
      const direction = options.direction !== undefined ? options.direction : 1;
      const index =
        options.index !== undefined ? options.index : state.currentIndex;
      const wrap =
        options.wrap !== undefined ? options.wrap : state.cursorOperationsWrap;

      const { items } = state;
      const count = items ? items.length : 0;

      if (count === 0) {
        // No items
        return -1;
      }

      if (wrap) {
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

    // @ts-ignore
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
          currentIndex,
          desiredCurrentIndex,
          currentItem,
          currentItemRequired,
          items,
        } = state;

        const count = items ? items.length : 0;

        // Determine the desired index: the one we want irrespective of whether
        // we have items or their availability.
        // Assume we'll stick with the same desired index we already have.
        let newDesiredIndex = desiredCurrentIndex;
        if (
          changed.items &&
          !changed.currentIndex &&
          currentItem &&
          count > 0 &&
          items[currentIndex] !== currentItem
        ) {
          // The items changed, and the item at the cursor is no longer the
          // same. See if we can find that item again in the list of items.
          const newItemIndex = items.indexOf(currentItem);
          if (newItemIndex >= 0) {
            // Found the item again; try to use its index.
            newDesiredIndex = newItemIndex;
          }
        } else if (
          changed.currentIndex &&
          ((currentIndex < 0 && currentItem !== null) ||
            (currentIndex >= 0 &&
              (count === 0 || items[currentIndex] !== currentItem)) ||
            desiredCurrentIndex === null)
        ) {
          // Someone explicitly moved the cursor, which trumps any previously
          // desired index.
          newDesiredIndex = currentIndex;
        }

        // If an item is required and there's no selection, we'll implicitly try
        // to get the first available item.
        if (currentItemRequired && newDesiredIndex < 0) {
          newDesiredIndex = 0;
        }

        // Now that we know what index we want, see how close we can get to it.
        let newIndex;
        if (newDesiredIndex < 0) {
          // All negative indices are equivalent to -1.
          newDesiredIndex = -1;
          newIndex = -1;
        } else if (count === 0) {
          // No items yet.
          newIndex = -1;
        } else {
          // See how close we can get to the desired index.
          // First clamp index to existing array bounds.
          newIndex = Math.max(Math.min(count - 1, newDesiredIndex), 0);
          // Look for an available item going forward.
          newIndex = this[closestAvailableItemIndex](state, {
            direction: 1,
            index: newIndex,
            wrap: false,
          });
          if (newIndex < 0) {
            // Next best: look for an available item going backward.
            newIndex = this[closestAvailableItemIndex](state, {
              direction: -1,
              index: newIndex - 1,
              wrap: false,
            });
          }
        }

        const newItem = (items && items[newIndex]) || null;
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
 * @param {number} index
 * @param {number} direction
 */
function moveToIndex(element, index, direction) {
  const newIndex = element[closestAvailableItemIndex](element[state], {
    direction,
    index,
  });
  if (newIndex < 0) {
    // Couldn't find an item to move to.
    return false;
  }
  // Normally we don't check to see if state is going to change before setting
  // state, but the methods defined by this mixin want to be able to return true
  // if the index is actually going to change.
  const changed = element[state].currentIndex !== newIndex;
  if (changed) {
    element[setState]({
      currentIndex: newIndex,
    });
  }
  return changed;
}
