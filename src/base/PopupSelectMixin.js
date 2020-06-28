import { indexOfItemContainingTarget } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  firstRender,
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
        popupList: null,
      });
    }

    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;

      switch (event.key) {
        // Enter closes popup.
        case "Enter":
          if (this.opened) {
            selectCurrentItemAndClose(this);
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

              // If the user's not hovering over an item, default to a
              // selectedIndex if defined (DropdownList wants that behavior),
              // otherwise fall back to no selection (MenuButton wants that
              // behavior).
              const defaultIndex =
                this[state].selectedIndex !== undefined
                  ? this[state].selectedIndex
                  : -1;

              const popupCurrentIndex = enabled ? hoverIndex : defaultIndex;
              if (popupCurrentIndex !== this[state].popupCurrentIndex) {
                this[raiseChangeEvents] = true;
                this[setState]({ popupCurrentIndex });
                this[raiseChangeEvents] = false;
              }
            }
          }
        });
      }

      if (changed.popupList) {
        const { popupList } = this[state];
        if (popupList) {
          // If the user mouses up on a list item, close the list with that item as
          // the close result.
          popupList.addEventListener("mouseup", async (event) => {
            // If we're doing a drag-select (user moused down on button, dragged
            // mouse into list, and released), we close. If we're not doing a
            // drag-select (the user opened the list with a complete click), and
            // there's a selection, they clicked on an item, so also close.
            // Otherwise, the user clicked the list open, then clicked on a list
            // separator or list padding; stay open.
            const popupCurrentIndex = this[state].popupCurrentIndex;
            if (this[state].dragSelect || popupCurrentIndex >= 0) {
              // We don't want the document mouseup handler to close
              // before we've asked the list to highlight the selection.
              // We need to stop event propagation here, before we enter
              // any async code, to actually stop propagation.
              event.stopPropagation();
              this[raiseChangeEvents] = true;
              await selectCurrentItemAndClose(this);
              this[raiseChangeEvents] = false;
            } else {
              event.stopPropagation();
            }
          });

          // Track changes in the list's selection state.
          popupList.addEventListener("currentindexchange", (event) => {
            this[raiseChangeEvents] = true;
            /** @type {any} */
            const cast = event;
            this[setState]({
              popupCurrentIndex: cast.detail.currentIndex,
            });
            this[raiseChangeEvents] = false;
          });
        }
      }
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

/**
 * Highlight the selected item (if one exists), then close the menu.
 */
async function selectCurrentItemAndClose(element) {
  const originalRaiseChangeEvents = element[raiseChangeEvents];
  const selectionDefined = element[state].popupCurrentIndex >= 0;
  const closeResult = selectionDefined
    ? element.items[element[state].popupCurrentIndex]
    : undefined;

  const list = element[state].popupList;
  if (selectionDefined && "flashCurrentItem" in list) {
    await list.flashCurrentItem();
  }
  const saveRaiseChangeEvents = element[raiseChangeEvents];
  element[raiseChangeEvents] = originalRaiseChangeEvents;
  await element.close(closeResult);
  element[raiseChangeEvents] = saveRaiseChangeEvents;
}
