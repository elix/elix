import * as internal from "./internal.js";
import * as template from "../core/template.js";
import Button from "./Button.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import Drawer from "./Drawer.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";

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
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @part {Drawer} menu - contains the navigation or other menu items
 * @part {Button} menu-button - toggles display of the menu
 */
class HamburgerMenuButton extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      fromEdge: "start",
      menuButtonPartType: Button,
      menuPartType: Drawer
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
    return this[internal.state].fromEdge;
  }
  set fromEdge(fromEdge) {
    this[internal.setState]({ fromEdge });
  }

  // When the menu is closed, pressing Enter or Space is the same as clicking
  // the menu button.
  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    /** @type {any} */
    const menuButton = this[internal.ids].menuButton;

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
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  /**
   * The class or tag used to create the `menu` part – the container
   * for the navigation and other commands available through the button.
   *
   * @type {PartDescriptor}
   * @default Drawer
   */
  get menuPartType() {
    return this[internal.state].menuPartType;
  }
  set menuPartType(menuPartType) {
    this[internal.setState]({ menuPartType });
  }

  /**
   * The class or tag used to create the `menu-button` part – the
   * button the user can tap/click to invoke the menu.
   *
   * @type {PartDescriptor}
   * @default Button
   */
  get menuButtonPartType() {
    return this[internal.state].menuButtonPartType;
  }
  set menuButtonPartType(menuButtonPartType) {
    this[internal.setState]({ menuButtonPartType });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    renderParts(this[internal.shadowRoot], this[internal.state], changed);

    if (changed.menuButtonPartType) {
      this[internal.ids].menuButton.addEventListener("click", () => {
        this[internal.raiseChangeEvents] = true;
        this.open();
        this[internal.raiseChangeEvents] = false;
      });
    }

    if (changed.menuPartType) {
      this[internal.ids].menu.addEventListener("closed", event => {
        /** @type {any} */
        const cast = event;
        this[internal.setState]({
          closeResult: cast.detail.closeResult,
          opened: false
        });
      });
      this[internal.ids].menu.addEventListener("opened", () => {
        this[internal.setState]({
          opened: true
        });
      });
    }

    const menu = /** @type {any} */ (this[internal.ids].menu);

    if (changed.fromEdge) {
      if ("fromEdge" in menu) {
        menu.fromEdge = this[internal.state].fromEdge;
      }
    }

    if (changed.opened) {
      if ("opened" in menu) {
        menu.opened = this[internal.state].opened;
      }
    }
  }

  get [internal.template]() {
    const result = template.html`
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
    `;

    renderParts(result.content, this[internal.state]);

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
      template.transmute(menuButton, menuButtonPartType);
    }
  }
  if (!changed || changed.menuPartType) {
    const { menuPartType } = state;
    const menu = root.getElementById("menu");
    if (menu) {
      template.transmute(menu, menuPartType);
    }
  }
}

export default HamburgerMenuButton;
