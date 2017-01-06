import createSymbol from './createSymbol';
import CustomEvent from './CustomEvent';
import symbols from './symbols';


// Symbols for private data members on an element.
const canSelectNextSymbol = createSymbol('canSelectNext');
const canSelectPreviousSymbol = createSymbol('canSelectPrevious');
const selectionRequiredSymbol = createSymbol('selectionRequired');
const selectionWrapsSymbol = createSymbol('selectionWraps');

// We want to expose both selectedIndex and selectedItem as independent
// properties but keep them in sync. This allows a component user to reference
// the selection by whatever means is most natural for their situation.
//
// To efficiently keep these properties in sync, we track "external" and
// "internal" references for each property:
//
// The external index or item is the one we report to the outside world when
// asked for selection.  When handling a change to index or item, we update the
// external reference as soon as possible, so that if anyone immediately asks
// for the current selection, they will receive a stable answer.
//
// The internal index or item tracks whichever index or item last received the
// full set of processing. Processing includes raising a change event for the
// new value. Once we've begun that processing, we store the new value as the
// internal value to indicate we've handled it.
//
const externalSelectedIndexSymbol = createSymbol('externalSelectedIndex');
const externalSelectedItemSymbol = createSymbol('externalSelectedItem');
const internalSelectedIndexSymbol = createSymbol('internalSelectedIndex');
const internalSelectedItemSymbol = createSymbol('internalSelectedItem');


/**
 * Mixin which adds single-selection semantics for items in a list.
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
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function SingleSelectionMixin(base) {

  /**
   * The class prototype added by the mixin.
   */
  class SingleSelection extends base {

    constructor() {
      super();
      // Set defaults.
      if (typeof this.selectionRequired === 'undefined') {
        this.selectionRequired = this[symbols.defaults].selectionRequired;
      }
      if (typeof this.selectionWraps === 'undefined') {
        this.selectionWraps = this[symbols.defaults].selectionWraps;
      }
    }

    /**
     * True if the selection can be moved to the next item, false if not (the
     * selected item is the last item in the list).
     *
     * @type {boolean}
     */
    get canSelectNext() {
      return this[canSelectNextSymbol];
    }
    set canSelectNext(canSelectNext) {
      const changed = canSelectNext !== this[canSelectNextSymbol];
      this[canSelectNextSymbol] = canSelectNext;
      if ('canSelectNext' in base.prototype) { super.canSelectNext = canSelectNext; }
      if (this[symbols.raiseChangeEvents] && changed) {
        this.dispatchEvent(new CustomEvent('can-select-next-changed'));
      }
    }

    /**
     * True if the selection can be moved to the previous item, false if not
     * (the selected item is the first one in the list).
     *
     * @type {boolean}
     */
    get canSelectPrevious() {
      return this[canSelectPreviousSymbol];
    }
    set canSelectPrevious(canSelectPrevious) {
      const changed = canSelectPrevious !== this[canSelectPreviousSymbol];
      this[canSelectPreviousSymbol] = canSelectPrevious;
      if ('canSelectPrevious' in base.prototype) { super.canSelectPrevious = canSelectPrevious; }
      if (this[symbols.raiseChangeEvents] && changed) {
        this.dispatchEvent(new CustomEvent('can-select-previous-changed'));
      }
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.selectionRequired = false;
      defaults.selectionWraps = false;
      return defaults;
    }

    /**
     * Handle a new item being added to the list.
     *
     * The default implementation of this method simply sets the item's
     * selection state to false.
     *
     * @param {HTMLElement} item - the item being added
     */
    [symbols.itemAdded](item) {
      if (super[symbols.itemAdded]) { super[symbols.itemAdded](item); }
      this[symbols.itemSelected](item, item === this.selectedItem);
    }

    [symbols.itemsChanged]() {
      if (super[symbols.itemsChanged]) { super[symbols.itemsChanged](); }

      // In case selected item changed position or was removed.
      trackSelectedItem(this);

      // In case the change in items affected which navigations are possible.
      updatePossibleNavigations(this);
    }

    /**
     * Apply the indicate selection state to the item.
     *
     * The default implementation of this method does nothing. User-visible
     * effects will typically be handled by other mixins.
     *
     * @param {HTMLElement} item - the item being selected/deselected
     * @param {boolean} selected - true if the item is selected, false if not
     */
    [symbols.itemSelected](item, selected) {
      if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    }

    /**
     * The index of the item which is currently selected.
     *
     * The setter expects an integer or a string representing an integer.
     *
     * A `selectedIndex` of -1 indicates there is no selection. Setting this
     * property to -1 will remove any existing selection.
     *
     * @type {number}
     */
    get selectedIndex() {
      return this[externalSelectedIndexSymbol] != null ?
        this[externalSelectedIndexSymbol] :
        -1;
    }
    set selectedIndex(index) {
      // See notes at top about internal vs. external copies of this property.
      const changed = index !== this[internalSelectedIndexSymbol];
      let item;
      let parsedIndex = parseInt(index);
      if (parsedIndex !== this[externalSelectedIndexSymbol]) {
        // Store the new index and the corresponding item.
        const items = this.items;
        const hasItems = items && items.length > 0;
        if (!(hasItems && parsedIndex >= 0 && parsedIndex < items.length)) {
          parsedIndex = -1; // No item at that index.
        }
        this[externalSelectedIndexSymbol] = parsedIndex;
        item = hasItems && parsedIndex >= 0 ? items[parsedIndex] : null;
        this[externalSelectedItemSymbol] = item;
      } else {
        item = this[externalSelectedItemSymbol];
      }

      // Now let super do any work.
      if ('selectedIndex' in base.prototype) { super.selectedIndex = index; }

      if (changed) {
        // The selected index changed.
        this[internalSelectedIndexSymbol] = parsedIndex;

        if (this[symbols.raiseChangeEvents]) {
          const event = new CustomEvent('selected-index-changed', {
            detail: {
              selectedIndex: parsedIndex,
              value: parsedIndex // for Polymer binding. TODO: Verify still necessary
            }
          });
          this.dispatchEvent(event);
        }
      }

      if (this[internalSelectedItemSymbol] !== item) {
        // Update selectedItem property so it can have its own effects.
        this.selectedItem = item;
      }
    }

    /**
     * The currently selected item, or null if there is no selection.
     *
     * Setting this property to null deselects any currently-selected item.
     * Setting this property to an object that is not in the list has no effect.
     *
     * TODO: Even if selectionRequired, can still explicitly set selectedItem to null.
     * TODO: If selectionRequired, leave selection alone?
     *
     * @type {object}
     */
    get selectedItem() {
      return this[externalSelectedItemSymbol] || null;
    }
    set selectedItem(item) {
      // See notes at top about internal vs. external copies of this property.
      const previousSelectedItem = this[internalSelectedItemSymbol];
      const changed = item !== previousSelectedItem;
      let index;
      if (item !== this[externalSelectedItemSymbol]) {
        // Store item and look up corresponding index.
        const items = this.items;
        const hasItems = items && items.length > 0;
        index = hasItems ? Array.prototype.indexOf.call(items, item) : -1;
        this[externalSelectedIndexSymbol] = index;
        if (index < 0) {
          item = null; // The indicated item isn't actually in `items`.
        }
        this[externalSelectedItemSymbol] = item;
      } else {
        index = this[externalSelectedIndexSymbol];
      }

      // Now let super do any work.
      if ('selectedItem' in base.prototype) { super.selectedItem = item; }

      if (changed) {
        // The selected item changed.
        this[internalSelectedItemSymbol] = item;

        if (previousSelectedItem) {
          // Update selection state of old item.
          this[symbols.itemSelected](previousSelectedItem, false);
        }
        if (item) {
          // Update selection state to new item.
          this[symbols.itemSelected](item, true);
        }

        updatePossibleNavigations(this);

        if (this[symbols.raiseChangeEvents]) {
          const event = new CustomEvent('selected-item-changed', {
            detail: {
              selectedItem: item,
              value: item // for Polymer binding
            }
          });
          this.dispatchEvent(event);
        }
      }

      if (this[internalSelectedIndexSymbol] !== index) {
        // Update selectedIndex property so it can have its own effects.
        this.selectedIndex = index;
      }
    }

    /**
     * Select the first item in the list.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectFirst() {
      if (super.selectFirst) { super.selectFirst(); }
      return selectIndex(this, 0);
    }

    /**
     * True if the list should always have a selection (if it has items).
     *
     * @type {boolean}
     * @default false
     */
    get selectionRequired() {
      return this[selectionRequiredSymbol];
    }
    set selectionRequired(selectionRequired) {
      this[selectionRequiredSymbol] = selectionRequired;
      if ('selectionRequired' in base.prototype) { super.selectionRequired = selectionRequired; }
      trackSelectedItem(this);
    }

    /**
     * True if selection navigations wrap from last to first, and vice versa.
     *
     * @type {boolean}
     * @default false
     */
    get selectionWraps() {
      return this[selectionWrapsSymbol];
    }
    set selectionWraps(value) {
      this[selectionWrapsSymbol] = String(value) === 'true';
      if ('selectionWraps' in base.prototype) { super.selectionWraps = value; }
      updatePossibleNavigations(this);
    }

    /**
     * Select the last item in the list.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectLast() {
      if (super.selectLast) { super.selectLast(); }
      return selectIndex(this, this.items.length - 1);
    }

    /**
     * Select the next item in the list.
     *
     * If the list has no selection, the first item will be selected.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectNext() {
      if (super.selectNext) { super.selectNext(); }
      return selectIndex(this, this.selectedIndex + 1);
    }

    /**
     * Select the previous item in the list.
     *
     * If the list has no selection, the last item will be selected.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectPrevious() {
      if (super.selectPrevious) { super.selectPrevious(); }
      const newIndex = this.selectedIndex < 0 ?
        this.items.length - 1 :     // No selection yet; select last item.
        this.selectedIndex - 1;
      return selectIndex(this, newIndex);
    }

    /**
     * Fires when the canSelectNext property changes in response to internal
     * component activity.
     *
     * @memberof SingleSelection
     * @event can-select-next-changed
     */

    /**
     * Fires when the canSelectPrevious property changes in response to internal
     * component activity.
     *
     * @memberof SingleSelection
     * @event can-select-previous-changed
     */

    /**
     * Fires when the selectedIndex property changes in response to internal
     * component activity.
     *
     * @memberof SingleSelection
     * @event selected-index-changed
     * @param {number} detail.selectedIndex The new selected index.
     */

    /**
     * Fires when the selectedItem property changes in response to internal
     * component activity.
     *
     * @memberof SingleSelection
     * @event selected-item-changed
     * @param {HTMLElement} detail.selectedItem The new selected item.
     */

  }

  return SingleSelection;
}


// Ensure the given index is within bounds, and select it if it's not already
// selected.
function selectIndex(element, index) {

  const items = element.items;
  if (items == null) {
    // Nothing to select.
    return false;
  }

  const count = items.length;
  const boundedIndex = element.selectionWraps ?
    // JavaScript mod doesn't handle negative numbers the way we want to wrap.
    // See http://stackoverflow.com/a/18618250/76472
    ((index % count) + count) % count :

    // Keep index within bounds of array.
    Math.max(Math.min(index, count - 1), 0);

  const previousIndex = element.selectedIndex;
  if (previousIndex !== boundedIndex) {
    element.selectedIndex = boundedIndex;
    return true;
  } else {
    return false;
  }
}

// Following a change in the set of items, or in the value of the
// `selectionRequired` property, reacquire the selected item. If it's moved,
// update `selectedIndex`. If it's been removed, and a selection is required,
// try to select another item.
function trackSelectedItem(element) {

  const items = element.items;
  const itemCount = items ? items.length : 0;

  const previousSelectedItem = element.selectedItem;
  if (!previousSelectedItem) {
    // No item was previously selected.
    if (element.selectionRequired) {
      // Select the first item by default.
      element.selectedIndex = 0;
    }
  } else if (itemCount === 0) {
    // We've lost the selection, and there's nothing left to select.
    element.selectedItem = null;
  } else {
    // Try to find the previously-selected item in the current set of items.
    const indexInCurrentItems = Array.prototype.indexOf.call(items, previousSelectedItem);
    const previousSelectedIndex = element.selectedIndex;
    if (indexInCurrentItems < 0) {
      // Previously-selected item was removed from the items.
      // Select the item at the same index (if it exists) or as close as possible.
      const newSelectedIndex = Math.min(previousSelectedIndex, itemCount - 1);
      // Select by item, since index may be the same, and we want to raise the
      // selected-item-changed event.
      element.selectedItem = items[newSelectedIndex];
    } else if (indexInCurrentItems !== previousSelectedIndex) {
      // Previously-selected item still there, but changed position.
      element.selectedIndex = indexInCurrentItems;
    }
  }
}

// Following a change in selection, report whether it's now possible to
// go next/previous from the given index.
function updatePossibleNavigations(element) {
  let canSelectNext;
  let canSelectPrevious;
  const items = element.items;
  if (items == null || items.length === 0) {
    // No items to select.
    canSelectNext = false;
    canSelectPrevious = false;
  } else if (element.selectionWraps) {
    // Since there are items, can always go next/previous.
    canSelectNext = true;
    canSelectPrevious = true;
  } else {
    const index = element.selectedIndex;
    if (index < 0 && items.length > 0) {
      // Special case. If there are items but no selection, declare that it's
      // always possible to go next/previous to create a selection.
      canSelectNext = true;
      canSelectPrevious = true;
    } else {
      // Normal case: we have an index in a list that has items.
      canSelectPrevious = (index > 0);
      canSelectNext = (index < items.length - 1);
    }
  }
  if (element.canSelectNext !== canSelectNext) {
    element.canSelectNext = canSelectNext;
  }
  if (element.canSelectPrevious !== canSelectPrevious) {
    element.canSelectPrevious = canSelectPrevious;
  }
}
