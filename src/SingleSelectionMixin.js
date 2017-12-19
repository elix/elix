import symbols from './symbols.js';


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
      return Object.assign({}, super.defaultState, {
        selectedIndex: -1,
        selectionRequired: false,
        selectionWraps: false
      });
    }

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

      const selectedIndex = this.state.selectedIndex;
      if (selectedIndex !== previousState.selectedIndex && this[symbols.raiseChangeEvents]) {
        const event = new CustomEvent('selected-index-changed', {
          detail: { selectedIndex }
        });
        this.dispatchEvent(event);
      }
    }

    itemCalcs(item, index) {
      const base = super.itemCalcs ? super.itemCalcs(item, index) : null;
      return Object.assign({}, base, {
        selected: index === this.state.selectedIndex
      });
    }

    /**
     * Select the first item in the list.
     *
     * @returns {Boolean} True if the selection changed, false if not.
     */
    selectFirst() {
      if (super.selectFirst) { super.selectFirst(); }
      return this.setState({
        selectedIndex: 0
      });
    }

    /**
     * The index of the currently-selected item, or -1 if no item is selected.
     * 
     * @type {number}
     */
    get selectedIndex() {
      return this.state.selectedIndex;
    }
    set selectedIndex(selectedIndex) {
      const parsedIndex = typeof selectedIndex === 'string' ?
        parseInt(selectedIndex) :
        selectedIndex;
      this.setState({
        selectedIndex: parsedIndex
      });
    }

    /**
     * The currently-selected item, or null if no item is selected.
     * 
     * @type {Element|null}
     */
    get selectedItem() {
      return this.items && this.items[this.state.selectedIndex];
    }
    set selectedItem(selectedItem) {
      if (!this.items) {
        return;
      }
      const selectedIndex = this.items.indexOf(selectedItem);
      if (selectedIndex >= 0) {
        this.setState({ selectedIndex });
      }
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
      return this.setState({
        selectedIndex: this.items.length - 1
      });
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
      return this.setState({
        selectedIndex: this.state.selectedIndex + 1
      });
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
      const selectedIndex = this.items && this.state.selectedIndex < 0 ?
        this.items.length - 1 :     // No selection yet; select last item.
        this.state.selectedIndex - 1;
      return this.setState({ selectedIndex });
    }

    validateState(state) {
      // Only validate if we've already received items.
      const items = this.itemsForState ?
        this.itemsForState(state) :
        state.items;
      if (items) {
        const count = items ? items.length : 0;
        const selectedIndex = state.selectedIndex;

        let validatedIndex;
        if (selectedIndex === -1 && state.selectionRequired && count > 0) {
          validatedIndex = 0;
        } else if (state.selectionWraps) {
          // Wrap the index.
          // JavaScript mod doesn't handle negative numbers the way we want to wrap.
          // See http://stackoverflow.com/a/18618250/76472
          validatedIndex = ((selectedIndex % count) + count) % count;
        } else {
          // Don't wrap, force index within bounds of -1 (no selection) to the
          // array length - 1.
          validatedIndex = Math.max(Math.min(selectedIndex, count - 1), -1);
        }

        if (validatedIndex !== selectedIndex) {
          return {
            selectedIndex: validatedIndex
          };
        }
      }

      return super.validateState && super.validateState(state);
    }

  }

  return SingleSelection;
}
