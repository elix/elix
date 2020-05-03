import { indexOfItemContainingTarget } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  firstRender,
  keydown,
  raiseChangeEvents,
  render,
  setState,
  state,
  tap,
  toggleSelectedFlag,
} from "./internal.js";

/**
 * Basic keyboard/tap toggle UI for a multi-select list-like element
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
      this.addEventListener("mousedown", (event) => {
        // Only process events for the main (usually left) button.
        if (event.button !== 0) {
          return;
        }
        this[raiseChangeEvents] = true;
        this[tap](event);
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
            this.toggleSelectedFlag(currentIndex);
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

    [tap](/** @type {MouseEvent} */ event) {
      // In some situations, the event target will not be the child which was
      // originally clicked on. E.g., if the item clicked on is a button, the
      // event seems to be raised in phase 2 (AT_TARGET) — but the event target
      // will be the component, not the item that was clicked on. Instead of
      // using the event target, we get the first node in the event's composed
      // path.
      // @ts-ignore
      const target = event.composedPath
        ? event.composedPath()[0]
        : event.target;

      // Find which item was clicked on and, if found, select it. For elements
      // which don't require a selection, a background click will determine
      // the item was null, in which we case we'll remove the selection.
      const { items } = this[state];
      if (items && target instanceof Node) {
        const targetIndex = indexOfItemContainingTarget(items, target);
        if (targetIndex >= 0) {
          this[setState]({
            currentIndex: targetIndex,
          });
          this[toggleSelectedFlag](targetIndex);
          event.stopPropagation();
        }
      }
    }
  };
}
