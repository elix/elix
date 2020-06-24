import { deepContains } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import {
  defaultState,
  ids,
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
import PopupSelectMixin from "./PopupSelectMixin.js";

const Base = PopupSelectMixin(PopupButton);

/**
 * A button that invokes a menu.
 *
 * @inherits PopupButton
 * @mixes PopupSelectMixin
 * @part {Menu} menu - the menu shown in the popup
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 */
class MenuButton extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      menuPartType: Menu,
    });
  }

  get items() {
    /** @type {any} */
    const menu = this[ids] && this[ids].menu;
    return menu ? menu.items : null;
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

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

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

    // The current item in the popup is represented in the menu.
    if (changed.popupCurrentIndex) {
      const menu = /** @type {any} */ (this[ids].menu);
      if ("currentIndex" in menu) {
        menu.currentIndex = this[state].popupCurrentIndex;
      }
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When opening, clear any menu selection.
    if (changed.opened && state.opened) {
      Object.assign(effects, {
        popupCurrentIndex: -1,
      });
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
