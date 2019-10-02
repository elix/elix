import * as internal from './internal.js';
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
        if (this[internal.state].items !== delegateItems) {
          this[internal.setState]({
            items: delegateItems
          });
        }
      };
      // @ts-ignore
      this[selectedIndexChangedListenerKey] = event => {
        /** @type {any} */
        const cast = event;
        const delegateSelectedIndex = cast.detail.selectedIndex;
        if (this[internal.state].selectedIndex !== delegateSelectedIndex) {
          this[internal.setState]({
            selectedIndex: delegateSelectedIndex
          });
        }
      };
    }

    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }
      listenToDelegateEvents(this);
    }

    [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
      }
      listenToDelegateEvents(this);
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        items: null
      });
    }

    /**
     * The current set of items drawn from the element's current state.
     *
     * @returns {Element[]|null} the element's current items
     */
    get items() {
      return this[internal.state] ? this[internal.state].items : null;
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.selectedIndex) {
        const itemsDelegate = this[internal.itemsDelegate];
        if (typeof itemsDelegate === 'undefined') {
          throw `To use DelegateItemsMixin, ${this.constructor.name} must define a getter for [internal.itemsDelegate].`;
        }
        if ('selectedIndex' in itemsDelegate) {
          itemsDelegate.selectedIndex = this[internal.state].selectedIndex;
        }
      }
    }
  }

  return DelegateItems;
}

function listenToDelegateEvents(/** @type {ReactiveElement} */ element) {
  /** @type {any} */ const cast = element;
  const itemsDelegate = cast[internal.itemsDelegate];
  const previousItemsDelegate = cast[previousItemsDelegateKey];
  if (itemsDelegate !== previousItemsDelegate) {
    if (previousItemsDelegate) {
      // Stop listening to events on previous delegate.
      previousItemsDelegate.removeEventListener(cast[itemsChangedListenerKey]);
      previousItemsDelegate.removeEventListener(
        cast[selectedIndexChangedListenerKey]
      );
    }
    // Start listening to events on new delegate.
    itemsDelegate.addEventListener(
      'items-changed',
      cast[itemsChangedListenerKey]
    );
    itemsDelegate.addEventListener(
      'selected-index-changed',
      cast[selectedIndexChangedListenerKey]
    );
  }
}
