import { indexOfItemContainingTarget } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  keydown,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  state,
  stateEffects,
} from "./internal.js";

const documentMousemoveListenerKey = Symbol("documentMousemoveListener");

/**
 * Syncs the cursor a popup source and a list-like element inside the popup.
 *
 * This includes support for drag-select operations: the user can mouse down on
 * the source to produce the popup, drag into the popup to highlight an item,
 * then release the mouse to select that item.
 *
 * @module PopupListMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PopupListMixin(Base) {
  // The class prototype added by the mixin.
  class PopupList extends Base {
    connectedCallback() {
      super.connectedCallback();
      // Handle edge case where component is opened, removed, then added back.
      listenIfOpenAndConnected(this);
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        currentIndex: -1,
        hasHoveredOverItemSinceOpened: false,
        popupList: null,
      });
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      listenIfOpenAndConnected(this);
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
      if (super[render]) {
        super[render](changed);
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
            const currentIndex = this[state].currentIndex;
            if (this[state].dragSelect || currentIndex >= 0) {
              // We don't want the document mouseup handler in
              // PopupDragSelectMixin to close the popup before we've asked the
              // list to highlight the selection. We stop event propagation
              // here, before we enter any async code, to actually stop
              // propagation.
              event.stopPropagation();
              this[raiseChangeEvents] = true;
              await selectCurrentItemAndClose(this);
              this[raiseChangeEvents] = false;
            } else {
              event.stopPropagation();
            }
          });

          // Track changes in the list's cursor.
          popupList.addEventListener("currentindexchange", (event) => {
            this[raiseChangeEvents] = true;
            /** @type {any} */
            const cast = event;
            this[setState]({
              currentIndex: cast.detail.currentIndex,
            });
            this[raiseChangeEvents] = false;
          });
        }
      }

      // The popup's current item is represented in the visible list.
      if (changed.currentIndex || changed.popupList) {
        const { currentIndex, popupList } = this[state];
        if (popupList && "currentIndex" in popupList) {
          popupList.currentIndex = currentIndex;
        }
      }
    }

    [rendered](changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (changed.opened) {
        if (this[state].opened) {
          // Ensure the list's cursor is visible. If the cursor moved while the
          // list was closed, the cursor may not be in view yet.
          const { popupList } = this[state];
          if (popupList.scrollCurrentItemIntoView) {
            // Give popup time to render.
            setTimeout(() => {
              popupList.scrollCurrentItemIntoView();
            });
          }
        }
        listenIfOpenAndConnected(this);
      }
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // When opening, reset out notion of whether the user has hovered over an
      // item since the list was opened.
      if (changed.opened && state.opened) {
        Object.assign(effects, {
          hasHoveredOverItemSinceOpened: false,
        });
      }

      return effects;
    }
  }

  return PopupList;
}

// Handle a mouse hover select operation.
function handleMousemove(/** @type {MouseEvent} */ event) {
  // @ts-ignore
  const element = this;
  const { hasHoveredOverItemSinceOpened, opened } = element[state];
  if (opened) {
    // Treat the deepest element in the composed event path as the target.
    const target = event.composedPath ? event.composedPath()[0] : event.target;
    const items = element.items;

    if (target && target instanceof Node && items) {
      const hoverIndex = indexOfItemContainingTarget(items, target);
      const item = items[hoverIndex];

      // If the user is hovering over an enabled item, make it current.
      // If the user is not hovering over an enabled item, but has
      // hovered over such an item at least once since the list was
      // opened, then clear cursor.
      const currentIndex = item && !item.disabled ? hoverIndex : -1;

      if (
        (hasHoveredOverItemSinceOpened || currentIndex >= 0) &&
        currentIndex !== element[state].currentIndex
      ) {
        element[raiseChangeEvents] = true;
        element[setState]({ currentIndex });
        if (currentIndex >= 0 && !hasHoveredOverItemSinceOpened) {
          element[setState]({ hasHoveredOverItemSinceOpened: true });
        }
        element[raiseChangeEvents] = false;
      }
    }
  }
}

function listenIfOpenAndConnected(element) {
  if (element[state].opened && element.isConnected) {
    if (!element[documentMousemoveListenerKey]) {
      // Not listening yet; start.
      element[documentMousemoveListenerKey] = handleMousemove.bind(element);
      document.addEventListener(
        "mousemove",
        element[documentMousemoveListenerKey]
      );
    }
  } else if (element[documentMousemoveListenerKey]) {
    // Currently listening; stop.
    document.removeEventListener(
      "mousemove",
      element[documentMousemoveListenerKey]
    );
    element[documentMousemoveListenerKey] = null;
  }
}

/**
 * Highlight the current item (if one exists), then close the menu.
 */
async function selectCurrentItemAndClose(element) {
  const originalRaiseChangeEvents = element[raiseChangeEvents];
  const cursorDefined = element[state].currentIndex >= 0;
  const items = element.items;
  if (items) {
    const closeResult = cursorDefined
      ? items[element[state].currentIndex]
      : undefined;

    const list = element[state].popupList;
    if (cursorDefined && "flashCurrentItem" in list) {
      await list.flashCurrentItem();
    }
    const saveRaiseChangeEvents = element[raiseChangeEvents];
    element[raiseChangeEvents] = originalRaiseChangeEvents;
    await element.close(closeResult);
    element[raiseChangeEvents] = saveRaiseChangeEvents;
  }
}
