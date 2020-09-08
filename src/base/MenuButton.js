import { deepContains } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import {
  defaultState,
  ids,
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
import PopupListMixin from "./PopupListMixin.js";

const Base = PopupListMixin(PopupButton);

/**
 * A button that invokes a menu.
 *
 * @inherits PopupButton
 * @mixes PopupListMixin
 * @part {Menu} menu - the menu shown in the popup
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
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    if (changed.menuPartType) {
      this[setState]({
        popupList: this[ids].menu,
      });
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When closing, clear menu selection.
    if (changed.opened && !state.opened) {
      Object.assign(effects, {
        currentIndex: -1,
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
        [part~=menu] {
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
