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
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import Menu from "./Menu.js";
import PopupButton from "./PopupButton.js";

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
  // The index that will be selected by default when the menu opens.
  get defaultMenuItemIndex() {
    return -1;
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      popupCurrentIndex: -1,
      menuPartType: Menu,
    });
  }

  get items() {
    /** @type {any} */
    const menu = this[ids] && this[ids].menu;
    return menu ? menu.items : null;
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    switch (event.key) {
      // Enter closes popup.
      case "Enter":
        if (this.opened) {
          this.selectCurrentItemAndClose();
          return true;
        }
    }

    // Give superclass a chance to handle.
    const base = super[keydown] && super[keydown](event);
    if (base) {
      return true;
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
        const popupCurrentIndex = this[state].popupCurrentIndex;
        if (this[state].dragSelect || popupCurrentIndex >= 0) {
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
          popupCurrentIndex: cast.detail.currentIndex,
        });
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.popupCurrentIndex) {
      const menu = /** @type {any} */ (this[ids].menu);
      if ("currentIndex" in menu) {
        menu.currentIndex = this[state].popupCurrentIndex;
      }
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

    // Set things when opening, or reset things when closing.
    if (changed.opened) {
      if (state.opened) {
        // Opening
        Object.assign(effects, {
          // Select the default item in the menu.
          popupCurrentIndex: this.defaultMenuItemIndex,
        });
      } else {
        // Closing
        Object.assign(effects, {
          // Clear menu selection.
          popupCurrentIndex: -1,
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

    renderParts(result.content, this[state]);

    result.content.append(fragmentFrom.html`
      <style>
        [part~="menu"] {
          max-height: 100%;
        }
      </style>
    `);

    return result;
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
}

export default MenuButton;
