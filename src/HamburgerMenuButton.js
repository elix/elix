import * as symbols from './symbols.js';
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

  get defaultState() {
    return Object.assign(super.defaultState, {
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
    return this.state.fromEdge;
  }
  set fromEdge(fromEdge) {
    this.setState({ fromEdge });
  }

  // When the menu is closed, pressing Enter or Space is the same as clicking
  // the menu button.
  [symbols.keydown](event) {
    /** @type {any} */
    const menuButton = this.$.menuButton;
    
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
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  /**
   * The class, tag, or template used to create the menu (drawer).
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default Drawer
   */
  get menuRole() {
    return this.state.menuRole;
  }
  set menuRole(menuRole) {
    this.setState({ menuRole });
  }

  /**
   * The class, tag, or template used to create the menu button element.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default SeamlessButton
   */
  get menuButtonRole() {
    return this.state.menuButtonRole;
  }
  set menuButtonRole(menuButtonRole) {
    this.setState({ menuButtonRole });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.menuButtonRole) {
      template.transmute(this.$.menuButton, this.state.menuButtonRole);
      this.$.menuButton.addEventListener('click', () => {
        this[symbols.raiseChangeEvents] = true;
        this.open();
        this[symbols.raiseChangeEvents] = false;
      });
    }
    if (changed.menuRole) {
      template.transmute(this.$.menu, this.state.menuRole);
      this.$.menu.addEventListener('closed', event => {
        /** @type {any} */
        const cast = event;
        this.setState({
          closeResult: cast.detail.closeResult,
          opened: false
        });
      });
      this.$.menu.addEventListener('opened', () => {
        this.setState({
          opened: true
        });
      });
    }
    const menu = /** @type {any} */ (this.$.menu);
    if (changed.fromEdge) {
      if ('fromEdge' in menu) {
        menu.fromEdge = this.state.fromEdge;
      }
    }
    if (changed.opened) {
      if ('opened' in menu) {
        menu.opened = this.state.opened;
      }
    }
  }

  get [symbols.template]() {
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
