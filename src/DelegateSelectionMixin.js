import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';


const itemsChangedListenerKey = Symbol('itemsChangedListener');
const previousSelectionDelegateKey = Symbol('previousSelectionDelegate');
const selectedIndexChangedListenerKey = Symbol('selectedIndexChangedListener');


/**
 * Lets the selection state of a shadow element serve as the selection
 * state of the component itself
 * 
 * @module DelegateSelectionMixin
 */
export default function DelegateSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class DelegateSelection extends Base {

    constructor() {
      super();
      // @ts-ignore
      this[itemsChangedListenerKey] = event => {
        /** @type {any} */
        const cast = event.target;
        const delegateItems = cast.items;
        if (this.state.items !== delegateItems) {
          this.setState({
            items: delegateItems
          });
        }
      };
      // @ts-ignore
      this[selectedIndexChangedListenerKey] = event => {
        /** @type {any} */
        const cast = event;
        const delegateSelectedIndex = cast.detail.selectedIndex;
        if (this.state.selectedIndex !== delegateSelectedIndex) {
          this.setState({
            selectedIndex: delegateSelectedIndex
          });
        }
      };
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      listenToDelegateEvents(this);
    }

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      listenToDelegateEvents(this);
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        items: null
      });
    }

    /**
     * The current set of items drawn from the element's current state.
     * 
     * @returns {Element[]|null} the element's current items
     */
    get items() {
      return this.state ? this.state.items : null;
    }

    get updates() {
      const selectionDelegate = this[symbols.selectionDelegate];
      if (typeof selectionDelegate === 'undefined') {
        throw `To use DelegateSelectionMixin, ${this.constructor.name} must define a getter for [symbols.selectionDelegate].`;
      }
      const selectionDelegateId = selectionDelegate.id;
      if (!selectionDelegateId) {
        throw `DelegateSelectionMixin requires ${this.constructor.name} to assign an ID to the element handling selection.`;
      }
      const hasSelectedIndex = 'selectedIndex' in this.$[selectionDelegateId];
      if (!hasSelectedIndex) {
        console.warn(`Warning: DelegateSelectionMixin can't apply a selection to a delegated element unless it exposes a "selectedIndex" property.`);
      }
      const selectedIndex = this.state.selectedIndex;
      return merge(super.updates, hasSelectedIndex && {
        $: {
          [selectionDelegateId]: {
            selectedIndex
          }
        }
      });
    }

  }

  return DelegateSelection;
}


function listenToDelegateEvents(element) {
  const selectionDelegate = element[symbols.selectionDelegate];
  const previousSelectionDelegate = element[previousSelectionDelegateKey];
  if (selectionDelegate !== previousSelectionDelegate) {
    if (previousSelectionDelegate) {
      // Stop listening to events on previous delegate.
      previousSelectionDelegate.removeEventListener(element[itemsChangedListenerKey]);
      previousSelectionDelegate.removeEventListener(element[selectedIndexChangedListenerKey]);
    }
    // Start listening to events on new delegate.
    selectionDelegate.addEventListener('items-changed', element[itemsChangedListenerKey]);
    selectionDelegate.addEventListener('selected-index-changed', element[selectedIndexChangedListenerKey]);
  }
}
