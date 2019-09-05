import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


const itemsChangedListenerKey = Symbol('itemsChangedListener');
const previousItemsDelegateKey = Symbol('previousItemsDelegate');
const selectedIndexChangedListenerKey = Symbol('selectedIndexChangedListener');


/**
 * Treats the items inside a shadow element as the component's own items.
 * 
 * @module DelegateItemsMixin
 * @param {Constructor<ReactiveElement>} Base
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
        if (this[symbols.state].items !== delegateItems) {
          this[symbols.setState]({
            items: delegateItems
          });
        }
      };
      // @ts-ignore
      this[selectedIndexChangedListenerKey] = event => {
        /** @type {any} */
        const cast = event;
        const delegateSelectedIndex = cast.detail.selectedIndex;
        if (this[symbols.state].selectedIndex !== delegateSelectedIndex) {
          this[symbols.setState]({
            selectedIndex: delegateSelectedIndex
          });
        }
      };
    }

    [symbols.componentDidMount]() {
      if (super[symbols.componentDidMount]) { super[symbols.componentDidMount](); }
      listenToDelegateEvents(this);
    }

    [symbols.componentDidUpdate](/** @type {PlainObject} */ changed) {
      if (super[symbols.componentDidUpdate]) { super[symbols.componentDidUpdate](changed); }
      listenToDelegateEvents(this);
    }

    get [symbols.defaultState]() {
      return Object.assign(super[symbols.defaultState], {
        items: null
      });
    }

    /**
     * The current set of items drawn from the element's current state.
     * 
     * @returns {Element[]|null} the element's current items
     */
    get items() {
      return this[symbols.state] ? this[symbols.state].items : null;
    }

    [symbols.render](/** @type {PlainObject} */ changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }
      if (changed.selectedIndex) {
        const itemsDelegate = this[symbols.itemsDelegate];
        if (typeof itemsDelegate === 'undefined') {
          throw `To use DelegateItemsMixin, ${this.constructor.name} must define a getter for [symbols.itemsDelegate].`;
        }
        if ('selectedIndex' in itemsDelegate) {
          itemsDelegate.selectedIndex = this[symbols.state].selectedIndex;
        }
      }
    }

  }

  return DelegateItems;
}


function listenToDelegateEvents(/** @type {ReactiveElement} */ element) {
  /** @type {any} */ const cast = element;
  const itemsDelegate = cast[symbols.itemsDelegate];
  const previousItemsDelegate = cast[previousItemsDelegateKey];
  if (itemsDelegate !== previousItemsDelegate) {
    if (previousItemsDelegate) {
      // Stop listening to events on previous delegate.
      previousItemsDelegate.removeEventListener(cast[itemsChangedListenerKey]);
      previousItemsDelegate.removeEventListener(cast[selectedIndexChangedListenerKey]);
    }
    // Start listening to events on new delegate.
    itemsDelegate.addEventListener('items-changed', cast[itemsChangedListenerKey]);
    itemsDelegate.addEventListener('selected-index-changed', cast[selectedIndexChangedListenerKey]);
  }
}
