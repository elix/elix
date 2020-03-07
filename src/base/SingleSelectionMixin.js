import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Adds single-selection semantics to a list-like element.
 *
 * This mixin expects a component to provide an `items` Array or NodeList of
 * all elements in the list.
 *
 * This mixin tracks a single selected item in the list, and provides means to
 * get and set that state by item position (`selectedIndex`) or item identity
 * (`selectedItem`). The selection can be moved in the list via the methods
 * `selectFirst`, `selectLast`, `selectNext`, and `selectPrevious`.
 *
 * This mixin does not produce any user-visible effects to represent
 * selection.
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
      return this[internal.state].canSelectNext;
    }

    /**
     * True if the selection can be moved to the previous item, false if not
     * (the selected item is the first one in the list).
     *
     * @type {boolean}
     */
    get canSelectPrevious() {
      return this[internal.state].canSelectPrevious;
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        canSelectNext: null,
        canSelectPrevious: null,
        selectedIndex: -1,
        selectionRequired: false,
        selectionWraps: false,
        trackSelectedItem: true
      });
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      if (changed.selectedIndex && this[internal.raiseChangeEvents]) {
        const selectedIndex = this[internal.state].selectedIndex;
        /**
         * Raised when the `selectedIndex` property changes.
         *
         * @event selected-index-changed
         */
        const event = new CustomEvent("selected-index-changed", {
          detail: { selectedIndex }
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
      return updateSelectedIndex(this, 0);
    }

    /**
     * The index of the currently-selected item, or -1 if no item is selected.
     *
     * @type {number}
     */
    get selectedIndex() {
      const { items, selectedIndex } = this[internal.state];
      return items && items.length > 0 ? selectedIndex : -1;
    }
    set selectedIndex(selectedIndex) {
      const parsed = Number(selectedIndex);
      if (!isNaN(parsed)) {
        this[internal.setState]({
          selectedIndex: parsed
        });
      }
    }

    /**
     * The currently-selected item, or null if no item is selected.
     *
     * @type {Element}
     */
    get selectedItem() {
      const { items, selectedIndex } = this[internal.state];
      return items && items[selectedIndex];
    }
    set selectedItem(selectedItem) {
      const { items } = this[internal.state];
      if (!items) {
        return;
      }
      const selectedIndex = items.indexOf(selectedItem);
      if (selectedIndex >= 0) {
        this[internal.setState]({ selectedIndex });
      }
    }

    /**
     * True if the list should always have a selection (if it has items).
     *
     * @type {boolean}
     * @default false
     */
    get selectionRequired() {
      return this[internal.state].selectionRequired;
    }
    set selectionRequired(selectionRequired) {
      this[internal.setState]({
        selectionRequired: String(selectionRequired) === "true"
      });
    }

    /**
     * True if selection navigations wrap from last to first, and vice versa.
     *
     * @type {boolean}
     * @default false
     */
    get selectionWraps() {
      return this[internal.state].selectionWraps;
    }
    set selectionWraps(selectionWraps) {
      this[internal.setState]({
        selectionWraps: String(selectionWraps) === "true"
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
      return updateSelectedIndex(this, this[internal.state].items.length - 1);
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
      return updateSelectedIndex(this, this[internal.state].selectedIndex + 1);
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
      let newIndex;
      const { items, selectedIndex, selectionWraps } = this[internal.state];
      if (
        (items && selectedIndex < 0) ||
        (selectionWraps && selectedIndex === 0)
      ) {
        // No selection yet, or we're on the first item, and selection wraps.
        // In either case, select the last item.
        newIndex = items.length - 1;
      } else if (selectedIndex > 0) {
        // Select the previous item.
        newIndex = selectedIndex - 1;
      } else {
        // Already on first item, can't go previous.
        return false;
      }
      return updateSelectedIndex(this, newIndex);
    }

    [internal.stateEffects](state, changed) {
      const effects = super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};

      // Ensure selectedIndex is valid.
      if (changed.items || changed.selectedIndex || changed.selectionRequired) {
        const {
          items,
          selectedIndex,
          selectionRequired,
          selectionWraps
        } = state;

        let adjustedIndex = selectedIndex;
        if (
          changed.items &&
          items &&
          !changed.selectedIndex &&
          state.trackSelectedItem
        ) {
          // The index stayed the same, but the item may have moved.
          const selectedItem = this.selectedItem;
          if (items[selectedIndex] !== selectedItem) {
            // The item moved or was removed. See if we can find the item
            // again in the list of items.
            const currentIndex = items.indexOf(selectedItem);
            if (currentIndex >= 0) {
              // Found the item again. Update the index to match.
              adjustedIndex = currentIndex;
            }
          }
        }

        // If items are null, we haven't received items yet. Don't validate the
        // selected index, as it may be set through markup; we'll want to validate
        // it only after we have items.
        if (items) {
          const validatedIndex = validateIndex(
            adjustedIndex,
            items.length,
            selectionRequired,
            selectionWraps
          );
          Object.assign(effects, {
            selectedIndex: validatedIndex
          });
        }
      }

      // Update computed state members canSelectNext/canSelectPrevious.
      if (changed.items || changed.selectedIndex || changed.selectionWraps) {
        const { items, selectedIndex, selectionWraps } = state;
        if (items) {
          const count = items.length;
          const canSelectNext =
            count === 0
              ? false
              : selectionWraps ||
                selectedIndex < 0 ||
                selectedIndex < count - 1;
          const canSelectPrevious =
            count === 0
              ? false
              : selectionWraps || selectedIndex < 0 || selectedIndex > 0;
          Object.assign(effects, {
            canSelectNext,
            canSelectPrevious
          });
        }
      }

      return effects;
    }
  }

  return SingleSelection;
}

/**
 * Validate the given selected index and, if that's not the element's current
 * selected index, update it.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} selectedIndex
 */
function updateSelectedIndex(element, selectedIndex) {
  const validatedIndex = validateIndex(
    selectedIndex,
    element[internal.state].items.length,
    element[internal.state].selectionRequired,
    element[internal.state].selectionWraps
  );
  const changed = element[internal.state].selectedIndex !== validatedIndex;
  if (changed) {
    element[internal.setState]({
      selectedIndex: validatedIndex
    });
  }
  return changed;
}

/**
 * Force the indicated index to be between -1 and count - 1.
 *
 * @private
 * @param {number} index
 * @param {number} count
 * @param {boolean} selectionRequired
 * @param {boolean} selectionWraps
 */
function validateIndex(index, count, selectionRequired, selectionWraps) {
  let validatedIndex;
  if (index === -1 && selectionRequired && count > 0) {
    // Ensure there's a selection.
    validatedIndex = 0;
  } else if (selectionWraps && count > 0) {
    // Wrap the index.
    // JavaScript mod doesn't handle negative numbers the way we want to wrap.
    // See http://stackoverflow.com/a/18618250/76472
    validatedIndex = ((index % count) + count) % count;
  } else {
    // Force index within bounds of -1 (no selection) to array length-1.
    // This logic also handles the case where there are no items
    // (count=0), which will produce a validated index of -1 (no
    // selection) regardless of what selectedIndex was asked for.
    validatedIndex = Math.max(Math.min(index, count - 1), -1);
  }
  return validatedIndex;
}
