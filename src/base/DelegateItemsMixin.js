import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/** @type {any} */
const itemsChangedListenerKey = Symbol("itemsChangedListener");
/** @type {any} */
const previousItemsDelegateKey = Symbol("previousItemsDelegate");
/** @type {any} */
const selectedIndexChangedListenerKey = Symbol("selectedIndexChangedListener");

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

    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.selectedIndex) {
        const itemsDelegate = this[internal.itemsDelegate];
        if (typeof itemsDelegate === "undefined") {
          throw `To use DelegateItemsMixin, ${this.constructor.name} must define a getter for [internal.itemsDelegate].`;
        }
        if ("selectedIndex" in itemsDelegate) {
          itemsDelegate.selectedIndex = this[internal.state].selectedIndex;
        }
      }
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }

      // If the delegate changed, wire up event handlers.
      const itemsDelegate = this[internal.itemsDelegate];
      const previousItemsDelegate = this[previousItemsDelegateKey];
      if (itemsDelegate !== previousItemsDelegate) {
        if (previousItemsDelegate) {
          // Stop listening to events on previous delegate.
          previousItemsDelegate.removeEventListener(
            this[itemsChangedListenerKey]
          );
          previousItemsDelegate.removeEventListener(
            this[selectedIndexChangedListenerKey]
          );
        }
        // Start listening to events on new delegate.
        itemsDelegate.addEventListener(
          "items-changed",
          this[itemsChangedListenerKey]
        );
        itemsDelegate.addEventListener(
          "selected-index-changed",
          this[selectedIndexChangedListenerKey]
        );
      }
    }
  }

  return DelegateItems;
}
