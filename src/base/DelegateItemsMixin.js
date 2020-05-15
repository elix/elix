import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, render, rendered, setState, state } from "./internal.js";

/** @type {any} */
const itemsChangedListenerKey = Symbol("itemsChangedListener");
/** @type {any} */
const previousItemsDelegateKey = Symbol("previousItemsDelegate");
/** @type {any} */
const currentIndexChangedListenerKey = Symbol("currentIndexChangedListener");

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
      this[itemsChangedListenerKey] = (event) => {
        /** @type {any} */
        const cast = event.target;
        const delegateItems = cast.items;
        if (this[state].items !== delegateItems) {
          this[setState]({
            items: delegateItems,
          });
        }
      };
      // @ts-ignore
      this[currentIndexChangedListenerKey] = (event) => {
        /** @type {any} */
        const cast = event;
        const delegateCurrentIndex = cast.detail.currentIndex;
        if (this[state].currentIndex !== delegateCurrentIndex) {
          this[setState]({
            currentIndex: delegateCurrentIndex,
          });
        }
      };
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        items: null,
      });
    }

    /**
     * The current set of items drawn from the element's current state.
     *
     * @returns {Element[]|null} the element's current items
     */
    get items() {
      return this[state] ? this[state].items : null;
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }
      if (changed.currentIndex) {
        const itemsDelegate = this[itemsDelegate];
        if (typeof itemsDelegate === "undefined") {
          throw `To use DelegateItemsMixin, ${this.constructor.name} must define a getter for [itemsDelegate].`;
        }
        if ("currentIndex" in itemsDelegate) {
          itemsDelegate.currentIndex = this[state].currentIndex;
        }
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // If the delegate changed, wire up event handlers.
      const itemsDelegate = this[itemsDelegate];
      const previousItemsDelegate = this[previousItemsDelegateKey];
      if (itemsDelegate !== previousItemsDelegate) {
        if (previousItemsDelegate) {
          // Stop listening to events on previous delegate.
          previousItemsDelegate.removeEventListener(
            this[itemsChangedListenerKey]
          );
          previousItemsDelegate.removeEventListener(
            this[currentIndexChangedListenerKey]
          );
        }
        // Start listening to events on new delegate.
        itemsDelegate.addEventListener(
          "items-changed",
          this[itemsChangedListenerKey]
        );
        itemsDelegate.addEventListener(
          "current-index-changed",
          this[currentIndexChangedListenerKey]
        );
      }
    }
  }

  return DelegateItems;
}
