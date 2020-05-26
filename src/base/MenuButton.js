import { deepContains, indexOfItemContainingTarget } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import {
  defaultState,
  firstRender,
  ids,
  keydown,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import Menu from "./Menu.js";
import PopupButton from "./PopupButton.js";
import UpDownToggle from "./UpDownToggle.js";

const documentMouseupListenerKey = Symbol("documentMouseupListener");

/**
 * A button that invokes a menu.
 *
 * @inherits PopupButton
 * @part {Menu} menu - the menu shown in the popup
 * @part {UpDownToggle} popup-toggle - the element that lets the user know they can open the popup
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 */
class MenuButton extends PopupButton {
  connectedCallback() {
    super.connectedCallback();
    // Handle edge case where component is opened, removed, then added back.
    listenIfOpenAndConnected(this);
  }

  // The index that will be selected by default when the menu opens.
  get defaultMenuItemIndex() {
    return -1;
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      dragSelect: true,
      menuCurrentIndex: -1,
      menuPartType: Menu,
      popupTogglePartType: UpDownToggle,
      selectedItem: null,
      touchstartX: null,
      touchstartY: null,
    });
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    listenIfOpenAndConnected(this);
  }

  get items() {
    /** @type {any} */
    const menu = this[ids] && this[ids].menu;
    return menu ? menu.items : null;
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    switch (event.key) {
      // Enter toggles popup.
      case "Enter":
        if (this.opened) {
          this.selectCurrentItemAndClose();
          return true;
        } else {
          this.open();
          return true;
        }
    }

    // Give superclass a chance to handle.
    const base = super[keydown] && super[keydown](event);
    if (base) {
      return true;
    }

    if (this.opened && !event.metaKey && !event.altKey) {
      // If they haven't already been handled, absorb keys that might cause the
      // page to scroll in the background, which would in turn cause the popup to
      // inadvertently close.
      switch (event.key) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "End":
        case "Home":
        case "PageDown":
        case "PageUp":
        case " ":
          return true;
      }
    }

    return false;
  }

  /**
   * The class or tag used to define the `menu` part – the element
   * presenting the menu items and handling navigation between them.
   *
   * @type {PartDescriptor}
   * @default Menu
   */
  get menuPartType() {
    return this[state].menuPartType;
  }
  set menuPartType(menuPartType) {
    this[setState]({ menuPartType });
  }

  /**
   * The class or tag used to create the `popup-toggle` part – the
   * element that lets the user know they can open the popup.
   *
   * @type {PartDescriptor}
   * @default UpDownToggle
   */
  get popupTogglePartType() {
    return this[state].popupTogglePartType;
  }
  set popupTogglePartType(popupTogglePartType) {
    this[setState]({ popupTogglePartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (this[firstRender]) {
      // If the user hovers over an enabled item, select it.
      this.addEventListener("mousemove", (event) => {
        // Treat the deepest element in the composed event path as the target.
        const target = event.composedPath
          ? event.composedPath()[0]
          : event.target;

        if (target && target instanceof Node) {
          const items = this.items;
          const hoverIndex = indexOfItemContainingTarget(items, target);
          const item = items[hoverIndex];
          const enabled = item && !item.disabled;
          const menuCurrentIndex = enabled ? hoverIndex : -1;
          if (menuCurrentIndex !== this[state].menuCurrentIndex) {
            this[raiseChangeEvents] = true;
            this[setState]({ menuCurrentIndex });
            this[raiseChangeEvents] = false;
          }
        }
      });
    }

    if (changed.popupPartType) {
      this[ids].popup.tabIndex = -1;
    }

    if (changed.menuPartType) {
      // Close the popup if menu loses focus.
      this[ids].menu.addEventListener("blur", async (event) => {
        /** @type {any} */
        const cast = event;
        const newFocusedElement = cast.relatedTarget || document.activeElement;
        if (this.opened && !deepContains(this[ids].menu, newFocusedElement)) {
          this[raiseChangeEvents] = true;
          await this.close();
          this[raiseChangeEvents] = false;
        }
      });

      // mousedown events on the menu will propagate up to the top-level element,
      // which will then steal the focus. We want to keep the focus on the menu,
      // both to permit keyboard use, and to avoid closing the menu on blur (see
      // separate blur handler). To keep the focus on the menu, we prevent the
      // default event behavior.
      this[ids].menu.addEventListener("mousedown", (event) => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        if (this.opened) {
          event.stopPropagation();
          event.preventDefault();
        }
      });

      // If the user mouses up on a menu item, close the menu with that item as
      // the close result.
      this[ids].menu.addEventListener("mouseup", async (event) => {
        // If we're doing a drag-select (user moused down on button, dragged
        // mouse into menu, and released), we close. If we're not doing a
        // drag-select (the user opened the menu with a complete click), and
        // there's a selection, they clicked on an item, so also close.
        // Otherwise, the user clicked the menu open, then clicked on a menu
        // separator or menu padding; stay open.
        const menuCurrentIndex = this[state].menuCurrentIndex;
        if (this[state].dragSelect || menuCurrentIndex >= 0) {
          // We don't want the document mouseup handler to close
          // before we've asked the menu to highlight the selection.
          // We need to stop event propagation here, before we enter
          // any async code, to actually stop propagation.
          event.stopPropagation();
          this[raiseChangeEvents] = true;
          await this.selectCurrentItemAndClose();
          this[raiseChangeEvents] = false;
        } else {
          event.stopPropagation();
        }
      });

      // Track changes in the menu's selection state.
      this[ids].menu.addEventListener("currentindexchange", (event) => {
        this[raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        this[setState]({
          menuCurrentIndex: cast.detail.currentIndex,
        });
        this[raiseChangeEvents] = false;
      });
    }

    // Tell the toggle which direction it should point to depending on which
    // direction the popup will open.
    if (changed.popupPosition || changed.popupTogglePartType) {
      const { popupPosition } = this[state];
      const direction = popupPosition === "below" ? "down" : "up";
      /** @type {any} */ const popupToggle = this[ids].popupToggle;
      if ("direction" in popupToggle) {
        popupToggle.direction = direction;
      }
    }

    if (changed.disabled) {
      const { disabled } = this[state];
      /** @type {any} */ (this[ids].popupToggle).disabled = disabled;
    }

    if (changed.menuCurrentIndex) {
      const menu = /** @type {any} */ (this[ids].menu);
      if ("currentIndex" in menu) {
        menu.currentIndex = this[state].menuCurrentIndex;
      }
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    if (changed.opened) {
      listenIfOpenAndConnected(this);
    }
  }

  /**
   * Highlight the selected item (if one exists), then close the menu.
   */
  async selectCurrentItemAndClose() {
    const originalRaiseChangeEvents = this[raiseChangeEvents];
    const selectionDefined = this[state].menuCurrentIndex >= 0;
    const closeResult = selectionDefined
      ? this.items[this[state].menuCurrentIndex]
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

    // Set things when opening, or reset things when closing.
    if (changed.opened) {
      if (state.opened) {
        // Opening
        Object.assign(effects, {
          // Until we get a mouseup, we're doing a drag-select.
          dragSelect: true,

          // Select the default item in the menu.
          menuCurrentIndex: this.defaultMenuItemIndex,

          // Clear any previously selected item.
          selectedItem: null,

          // Clear previous touchstart point.
          touchStartX: null,
          touchStartY: null,
        });
      } else {
        // Closing
        Object.assign(effects, {
          // Clear menu selection.
          menuCurrentIndex: -1,
        });
      }
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    // Wrap default slot with a menu.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <div id="menu" part="menu">
          <slot></slot>
        </div>
      `);
    }

    // Inject a toggle button into the source slot.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      sourceSlot.append(fragmentFrom.html`
        <div
          id="popupToggle"
          part="popup-toggle"
          exportparts="down-icon up-icon"
          tabindex="-1"
        >
          <slot name="toggle-icon"></slot>
        </div>
      `);
    }

    renderParts(result.content, this[state]);

    result.content.append(fragmentFrom.html`
      <style>
        [part~="menu"] {
          max-height: 100%;
        }

        [part~="popup-toggle"] {
          outline: none;
        }

        [part~="source"] {
          align-items: center;
          display: flex;
        }
      </style>
    `);

    return result;
  }
}

async function handleMouseup(/** @type {MouseEvent} */ event) {
  // @ts-ignore
  const element = this;
  const hitTargets = element[shadowRoot].elementsFromPoint(
    event.clientX,
    event.clientY
  );
  const overSource = hitTargets.indexOf(element[ids].source) >= 0;
  if (element.opened) {
    if (overSource) {
      // User released the mouse over the source button (behind the
      // backdrop), so we're no longer doing a drag-select.
      if (element[state].dragSelect) {
        element[raiseChangeEvents] = true;
        element[setState]({
          dragSelect: false,
        });
        element[raiseChangeEvents] = false;
      }
    } else {
      // If we get to this point, the user released over the backdrop with
      // the popup open, so close.
      element[raiseChangeEvents] = true;
      await element.close();
      element[raiseChangeEvents] = false;
    }
  }
}

function listenIfOpenAndConnected(element) {
  if (element[state].opened && element.isConnected) {
    // If the popup is open and user releases the mouse over the backdrop, close
    // the popup. We need to listen to mouseup on the document, not this
    // element. If the user mouses down on the source, then moves the mouse off
    // the document before releasing the mouse, the element itself won't get the
    // mouseup. The document will, however, so it's a more reliable source of
    // mouse state.
    //
    // Coincidentally, we *also* need to listen to mouseup on the document to
    // tell whether the user released the mouse over the source button. When the
    // user mouses down, the backdrop will appear and cover the source, so from
    // that point on the source won't receive a mouseup event. Again, we can
    // listen to mouseup on the document and do our own hit-testing to see if
    // the user released the mouse over the source.
    if (!element[documentMouseupListenerKey]) {
      // Not listening yet; start.
      element[documentMouseupListenerKey] = handleMouseup.bind(element);
      document.addEventListener("mouseup", element[documentMouseupListenerKey]);
    }
  } else if (element[documentMouseupListenerKey]) {
    // Currently listening; stop.
    document.removeEventListener(
      "mouseup",
      element[documentMouseupListenerKey]
    );
    element[documentMouseupListenerKey] = null;
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.menuPartType) {
    const { menuPartType } = state;
    const menu = root.getElementById("menu");
    if (menu) {
      transmute(menu, menuPartType);
    }
  }
  if (!changed || changed.popupTogglePartType) {
    const { popupTogglePartType } = state;
    const popupToggle = root.getElementById("popupToggle");
    if (popupToggle) {
      transmute(popupToggle, popupTogglePartType);
    }
  }
}

export default MenuButton;
