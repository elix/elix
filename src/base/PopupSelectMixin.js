import { indexOfItemContainingTarget } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  firstRender,
  ids,
  keydown,
  raiseChangeEvents,
  render,
  setState,
  state,
  stateEffects,
} from "./internal.js";

/**
 * A source with a popup that offers a selection
 *
 * This includes support for drag-select operations: the user can mouse down on
 * the source to produce the popup, drag into the popup to highlight an item,
 * then release the mouse to select that item.
 *
 * @module PopupSelectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PopupSelectMixin(Base) {
  // The class prototype added by the mixin.
  class PopupSelect extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState], {
        popupCurrentIndex: -1,
      });
    }

    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;

      switch (event.key) {
        // Enter closes popup.
        case "Enter":
          if (this.opened) {
            this.selectCurrentItemAndClose();
            handled = true;
          }
      }

      // Prefer our result if it's defined, otherwise use base result.
      return handled || (super[keydown] && super[keydown](event)) || false;
    }

    [render](changed) {
      super[render](changed);

      if (this[firstRender]) {
        // If the user hovers over an enabled item, make it current.
        this.addEventListener("mousemove", (event) => {
          if (this[state].opened) {
            // Treat the deepest element in the composed event path as the target.
            const target = event.composedPath
              ? event.composedPath()[0]
              : event.target;

            if (target && target instanceof Node) {
              const items = this.items;
              const hoverIndex = indexOfItemContainingTarget(items, target);
              const item = items[hoverIndex];
              const enabled = item && !item.disabled;
              const popupCurrentIndex = enabled ? hoverIndex : -1;
              if (popupCurrentIndex !== this[state].popupCurrentIndex) {
                this[raiseChangeEvents] = true;
                this[setState]({ popupCurrentIndex });
                this[raiseChangeEvents] = false;
              }
            }
          }
        });
      }
    }

    /**
     * Highlight the selected item (if one exists), then close the menu.
     */
    async selectCurrentItemAndClose() {
      const originalRaiseChangeEvents = this[raiseChangeEvents];
      const selectionDefined = this[state].popupCurrentIndex >= 0;
      const closeResult = selectionDefined
        ? this.items[this[state].popupCurrentIndex]
        : undefined;
      /** @type {any} */ const menu = this[ids].menu;
      if (selectionDefined && "flashCurrentItem" in menu) {
        await menu.flashCurrentItem();
      }
      const saveRaiseChangeEvents = this[raiseChangeEvents];
      this[raiseChangeEvents] = originalRaiseChangeEvents;
      await this.close(closeResult);
      this[raiseChangeEvents] = saveRaiseChangeEvents;
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects](state, changed);

      // When closing, clear menu selection.
      if (changed.opened && !state.opened) {
        Object.assign(effects, {
          popupCurrentIndex: -1,
        });
      }

      return effects;
    }
  }

  return PopupSelect;
}
