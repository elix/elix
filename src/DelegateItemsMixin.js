import { merge } from './updates.js';
import * as symbols from './symbols.js';


const itemsChangedListenerKey = Symbol('itemsChangedListener');
const previousItemsDelegateKey = Symbol('previousItemsDelegate');
const selectedIndexChangedListenerKey = Symbol('selectedIndexChangedListener');


/**
 * Treats the items inside a shadow element as the component's own items.
 * 
 * @module DelegateItemsMixin
 */
export default function DelegateItemsMixin(Base) {

  // The class prototype added by the mixin.
  class DelegateItems extends Base {

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
      const itemsDelegate = this[symbols.itemsDelegate];
      if (typeof itemsDelegate === 'undefined') {
        throw `To use DelegateItemsMixin, ${this.constructor.name} must define a getter for [symbols.itemsDelegate].`;
      }
      const itemsDelegateId = itemsDelegate.id;
      if (!itemsDelegateId) {
        throw `DelegateItemsMixin requires ${this.constructor.name} to assign an ID to the element handling its items.`;
      }
      const hasSelectedIndex = 'selectedIndex' in this.$[itemsDelegateId];
      const selectedIndex = this.state.selectedIndex;
      return merge(super.updates, hasSelectedIndex && {
        $: {
          [itemsDelegateId]: {
            selectedIndex
          }
        }
      });
    }

  }

  return DelegateItems;
}


function listenToDelegateEvents(element) {
  const itemsDelegate = element[symbols.itemsDelegate];
  const previousItemsDelegate = element[previousItemsDelegateKey];
  if (itemsDelegate !== previousItemsDelegate) {
    if (previousItemsDelegate) {
      // Stop listening to events on previous delegate.
      previousItemsDelegate.removeEventListener(element[itemsChangedListenerKey]);
      previousItemsDelegate.removeEventListener(element[selectedIndexChangedListenerKey]);
    }
    // Start listening to events on new delegate.
    itemsDelegate.addEventListener('items-changed', element[itemsChangedListenerKey]);
    itemsDelegate.addEventListener('selected-index-changed', element[selectedIndexChangedListenerKey]);
  }
}
