import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { transmute } from "../core/template.js";
import Button from "./Button.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import Drawer from "./Drawer.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import {
  defaultState,
  ids,
  keydown,
  raiseChangeEvents,
  render,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import OpenCloseMixin from "./OpenCloseMixin.js";

const Base = DelegateFocusMixin(
  FocusVisibleMixin(KeyboardMixin(OpenCloseMixin(ReactiveElement)))
);

/**
 * Button that invokes a command menu, usually in a mobile context
 *
 * The button invokes a menu (by default, a Drawer), usually to provide
 * navigation and other UI on a mobile device.
 *
 * [A hamburger menu used to present navigation commands](/demos/hamburgerMenuButton.html)
 *
 * @inherits ReactiveElement
 * @mixes DelegateFocusMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @part {Drawer} menu - contains the navigation or other menu items
 * @part {Button} menu-button - toggles display of the menu
 */
class HamburgerMenuButton extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      fromEdge: "start",
      menuButtonPartType: Button,
      menuPartType: Drawer,
    });
  }

  /**
   * The edge from which the menu will appear, in terms of the menu's container.
   *
   * The `start` and `end` values refer to text direction: in left-to-right
   * languages such as English, these are equivalent to `left` and `right`,
   * respectively.
   *
   * @type {('end'|'left'|'right'|'start')}
   * @default 'start'
   */
  get fromEdge() {
    return this[state].fromEdge;
  }
  set fromEdge(fromEdge) {
    this[setState]({ fromEdge });
  }

  // When the menu is closed, pressing Enter or Space is the same as clicking
  // the menu button.
  [keydown](/** @type {KeyboardEvent} */ event) {
    /** @type {any} */
    const menuButton = this[ids].menuButton;

    let handled;

    if (this.closed) {
      switch (event.key) {
        case " ":
        case "Enter":
          menuButton.click();
          handled = true;
          break;
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  /**
   * The class or tag used to create the `menu` part – the container
   * for the navigation and other commands available through the button.
   *
   * @type {PartDescriptor}
   * @default Drawer
   */
  get menuPartType() {
    return this[state].menuPartType;
  }
  set menuPartType(menuPartType) {
    this[setState]({ menuPartType });
  }

  /**
   * The class or tag used to create the `menu-button` part – the
   * button the user can tap/click to invoke the menu.
   *
   * @type {PartDescriptor}
   * @default Button
   */
  get menuButtonPartType() {
    return this[state].menuButtonPartType;
  }
  set menuButtonPartType(menuButtonPartType) {
    this[setState]({ menuButtonPartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.menuButtonPartType) {
      this[ids].menuButton.addEventListener("click", () => {
        this[raiseChangeEvents] = true;
        this.open();
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.menuPartType) {
      this[ids].menu.addEventListener("closed", (event) => {
        /** @type {any} */
        const cast = event;
        this[setState]({
          closeResult: cast.detail.closeResult,
          opened: false,
        });
      });
      this[ids].menu.addEventListener("opened", () => {
        this[setState]({
          opened: true,
        });
      });
    }

    const menu = /** @type {any} */ (this[ids].menu);

    if (changed.fromEdge) {
      if ("fromEdge" in menu) {
        menu.fromEdge = this[state].fromEdge;
      }
    }

    if (changed.opened) {
      if ("opened" in menu) {
        menu.opened = this[state].opened;
      }
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          align-items: center;
          display: inline-flex;
          touch-action: manipulation;
        }
      </style>
      <div id="menuButton" part="menu-button" aria-label="Open menu">
        <slot name="menuButton"></slot>
      </div>
      <div id="menu" part="menu" exportparts="backdrop, frame">
        <slot></slot>
      </div>
    `);

    renderParts(result.content, this[state]);

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
  if (!changed || changed.menuButtonPartType) {
    const { menuButtonPartType } = state;
    const menuButton = root.getElementById("menuButton");
    if (menuButton) {
      transmute(menuButton, menuButtonPartType);
    }
  }
  if (!changed || changed.menuPartType) {
    const { menuPartType } = state;
    const menu = root.getElementById("menu");
    if (menu) {
      transmute(menu, menuPartType);
    }
  }
}

export default HamburgerMenuButton;
