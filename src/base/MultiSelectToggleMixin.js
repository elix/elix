import { indexOfItemContainingTarget } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  firstRender,
  keydown,
  raiseChangeEvents,
  render,
  state,
  toggleSelectedFlag,
} from "./internal.js";

/**
 * Basic keyboard/tap toggle UI for a multi-select list-like element.
 *
 * @module MultiSelectToggleMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function MultiSelectToggleMixin(Base) {
  // The class prototype added by the mixin.
  return class MultiSelectToggle extends Base {
    constructor() {
      // @ts-ignore
      super();

      this.addEventListener("selected-changed", (event) => {
        this[raiseChangeEvents] = true;
        // Find which item was selected, and update its selected flag.
        const { target } = event;
        const { items } = this[state];
        if (items && target instanceof Node) {
          const targetIndex = indexOfItemContainingTarget(items, target);
          if (targetIndex >= 0) {
            const { selected } = /** @type {any} */ (event).detail;
            this[toggleSelectedFlag](targetIndex, selected);
          }
        }
        this[raiseChangeEvents] = false;
      });
    }

    // Pressing Space toggles selection on the active item.
    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled;
      switch (event.key) {
        case " ": {
          const { currentIndex } = this[state];
          if (currentIndex >= 0) {
            this[toggleSelectedFlag](currentIndex);
            handled = true;
          }
          break;
        }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[keydown] && super[keydown](event));
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }
      if (this[firstRender]) {
        Object.assign(this.style, {
          touchAction: "manipulation", // for iOS Safari
          mozUserSelect: "none",
          msUserSelect: "none",
          webkitUserSelect: "none",
          userSelect: "none",
        });
      }
    }
  };
}
