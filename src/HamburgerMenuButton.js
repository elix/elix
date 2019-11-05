import * as internal from './internal.js';
import * as template from './template.js';
import Drawer from './Drawer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SeamlessButton from './SeamlessButton.js';

const Base = FocusVisibleMixin(KeyboardMixin(OpenCloseMixin(ReactiveElement)));

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
 * @part {SeamlessButton} menu-button - toggles display of the menu
 * @part menu-icon - the icon inside the menu button
 */
class HamburgerMenuButton extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      fromEdge: 'start',
      menuButtonPartType: SeamlessButton,
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
        case ' ':
        case 'Enter':
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
   * The class, tag, or template used to create the `menu` part – the container
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
   * The class, tag, or template used to create the `menu-button` part – the
   * button the user can tap/click to invoke the menu.
   *
   * @type {PartDescriptor}
   * @default SeamlessButton
   */
  get menuButtonPartType() {
    return this[internal.state].menuButtonPartType;
  }
  set menuButtonPartType(menuButtonPartType) {
    this[internal.setState]({ menuButtonPartType });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.menuButtonPartType) {
      template.transmute(
        this[internal.ids].menuButton,
        this[internal.state].menuButtonPartType
      );
      this[internal.ids].menuButton.addEventListener('click', () => {
        this[internal.raiseChangeEvents] = true;
        this.open();
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.menuPartType) {
      template.transmute(
        this[internal.ids].menu,
        this[internal.state].menuPartType
      );
      this[internal.ids].menu.addEventListener('closed', event => {
        /** @type {any} */
        const cast = event;
        this[internal.setState]({
          closeResult: cast.detail.closeResult,
          opened: false
        });
      });
      this[internal.ids].menu.addEventListener('opened', () => {
        this[internal.setState]({
          opened: true
        });
      });
    }
    const menu = /** @type {any} */ (this[internal.ids].menu);
    if (changed.fromEdge) {
      if ('fromEdge' in menu) {
        menu.fromEdge = this[internal.state].fromEdge;
      }
    }
    if (changed.opened) {
      if ('opened' in menu) {
        menu.opened = this[internal.state].opened;
      }
    }
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          align-items: center;
          display: inline-flex;
          height: 1em;
          touch-action: manipulation;
          width: 1em;
        }

        #menuButton {
          align-items: center;
          display: inline-flex;
          flex: 1;
        }

        #menuIcon {
          display: block;
          height: 24px;
          width: 24px;
        }
      </style>
      <div id="menuButton" part="menu-button" aria-label="Open menu" tabindex="-1">
        <slot name="menuIcon">
          <svg id="menuIcon" part="menu-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"></path>
          </svg>
        </slot>
      </div>
      <div id="menu" part="menu" exportparts="backdrop, frame">
        <slot></slot>
      </div>
    `;
  }
}

export default HamburgerMenuButton;
