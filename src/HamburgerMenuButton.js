import * as internal from './internal.js';
import * as template from './template.js';
import Drawer from './Drawer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  FocusVisibleMixin(
  KeyboardMixin(
  OpenCloseMixin(
    ReactiveElement
  )));


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
 * @elementrole {Drawer} menu
 * @elementrole {SeamlessButton} menuButton
 */
class HamburgerMenuButton extends Base {

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      fromEdge: 'start',
      menuButtonRole: SeamlessButton,
      menuRole: Drawer
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
    const menuButton = this[internal.$].menuButton;
    
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
    return handled || (super[internal.keydown] && super[internal.keydown](event));
  }

  /**
   * The class, tag, or template used to create the menu (drawer).
   * 
   * @type {Role}
   * @default Drawer
   */
  get menuRole() {
    return this[internal.state].menuRole;
  }
  set menuRole(menuRole) {
    this[internal.setState]({ menuRole });
  }

  /**
   * The class, tag, or template used to create the menu button element.
   * 
   * @type {Role}
   * @default SeamlessButton
   */
  get menuButtonRole() {
    return this[internal.state].menuButtonRole;
  }
  set menuButtonRole(menuButtonRole) {
    this[internal.setState]({ menuButtonRole });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.menuButtonRole) {
      template.transmute(this[internal.$].menuButton, this[internal.state].menuButtonRole);
      this[internal.$].menuButton.addEventListener('click', () => {
        this[internal.raiseChangeEvents] = true;
        this.open();
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.menuRole) {
      template.transmute(this[internal.$].menu, this[internal.state].menuRole);
      this[internal.$].menu.addEventListener('closed', event => {
        /** @type {any} */
        const cast = event;
        this[internal.setState]({
          closeResult: cast.detail.closeResult,
          opened: false
        });
      });
      this[internal.$].menu.addEventListener('opened', () => {
        this[internal.setState]({
          opened: true
        });
      });
    }
    const menu = /** @type {any} */ (this[internal.$].menu);
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

        #hamburgerIcon {
          display: block;
          height: 24px;
          width: 24px;
        }
      </style>
      <elix-seamless-button id="menuButton" aria-label="Open menu" tabindex="-1">
        <slot name="hamburgerIcon">
          <svg id="hamburgerIcon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"></path>
          </svg>
        </slot>
      </elix-seamless-button>
      <elix-drawer id="menu">
        <slot></slot>
      </elix-drawer>
    `;
  }

}


customElements.define('elix-hamburger-menu-button', HamburgerMenuButton);
export default HamburgerMenuButton;
