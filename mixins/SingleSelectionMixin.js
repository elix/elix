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
      const count = this.items ? this.items.length : 0;
      const selectedIndex = this.state.selectedIndex;
      return count === 0 ?
        false :
        this.state.selectionWraps || selectedIndex < 0 || selectedIndex < count - 1;
    }

    /**
     * True if the selection can be moved to the previous item, false if not
     * (the selected item is the first one in the list).
     *
     * @type {boolean}
     */
    get canSelectPrevious() {
      const count = this.items ? this.items.length : 0;
      const selectedIndex = this.state.selectedIndex;
      return count === 0 ?
        false :
        this.state.selectionWraps || selectedIndex < 0 || selectedIndex > 0;
    }

    get defaultState() {
      return Object.assign({}, super.defaults, {
        selectedIndex: -1,
        selectionRequired: false,
        selectionWraps: false
      });
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }

      // In case selected item changed position or was removed.
      trackSelectedItem(this);
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
      return this.state.selectionRequired;
    }
    set selectionRequired(selectionRequired) {
      this.setState({
        selectionRequired: String(selectionRequired) === 'true'
      });
    }

    /**
     * True if selection navigations wrap from last to first, and vice versa.
     *
     * @type {boolean}
     * @default false
     */
    get selectionWraps() {
      return this.state.selectionWraps;
    }
    set selectionWraps(selectionWraps) {
      this.setState({
        selectionWraps: String(selectionWraps) === 'true'
      });
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
      return selectIndex(this, this.state.selectedIndex + 1);
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
      const newIndex = this.items && this.state.selectedIndex < 0 ?
        this.items.length - 1 :     // No selection yet; select last item.
        this.state.selectedIndex - 1;
      return selectIndex(this, newIndex);
    }

    // TODO: Make Symbol
    // TODO: Rationalize with internal selectIndex().
    updateSelectedIndex(selectedIndex) {
      const changed = this.state.selectedIndex !== selectedIndex;
      if (changed) {
        this.setState({ selectedIndex });
      }
      return changed;
    }

  };

  return SingleSelection;
}


function selectIndex(component, index) {

  const items = component.items;
  if (items == null) {
    // Nothing to select.
    return false;
  }

  const count = items.length;
  const boundedIndex = component.state.selectionWraps ?
    // JavaScript mod doesn't handle negative numbers the way we want to wrap.
    // See http://stackoverflow.com/a/18618250/76472
    ((index % count) + count) % count :

    // Keep index within bounds of array.
    Math.max(Math.min(index, count - 1), 0);

  return component.updateSelectedIndex(boundedIndex);
}


/**
 * Following a change in the set of items, or in the value of the
 * `selectionRequired` property, reacquire the selected item. If it's moved,
 * update `selectedIndex`. If it's been removed, and a selection is required,
 * try to select another item.
 */
function trackSelectedItem(component) {

  const items = component.items;
  const itemCount = items ? items.length : 0;
  const previousSelectedIndex = component.state.selectedIndex;

  if (previousSelectedIndex >= 0) {
    // Select the item at the same index (if it exists) or as close as possible.
    // If there are no items, we'll set the index to -1 (no selection).
    const newSelectedIndex = Math.min(previousSelectedIndex, itemCount - 1);
    component.updateSelectedIndex(newSelectedIndex);
  } else if (component.state.selectionRequired && itemCount > 0) {
    // No item was previously selected; select the first item by default.
    component.updateSelectedIndex(0);
  }
}
