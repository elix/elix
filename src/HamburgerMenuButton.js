import { merge } from './updates.js';
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
 * A button that invokes a menu (by default, a Drawer), usually to provide
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
export default class HamburgerMenuButton extends Base {

  constructor() {
    super();
    this[symbols.roles] = Object.assign({}, this[symbols.roles], {
      menu: Drawer,
      menuButton: SeamlessButton
    });
  }

  componentDidMount() {
    this.$.menuButton.addEventListener('click', () => {
      this[symbols.raiseChangeEvents] = true;
      this.open();
      this[symbols.raiseChangeEvents] = false;
    });
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

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      fromEdge: 'start'
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

  // Pressing Enter or Space is the same as clicking the menu button.
  [symbols.keydown](event) {
    /** @type {any} */
    const menuButton = this.$.menuButton;
    
    let handled;
    switch (event.key) {
      case ' ':
      case 'Enter':
        menuButton.click();
        handled = true;
        break;
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
    return this[symbols.roles].menu;
  }
  set menuRole(menuRole) {
    this[symbols.hasDynamicTemplate] = true;
    this[symbols.roles].menu = menuRole;
  }

  /**
   * The class, tag, or template used to create the menu button element.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default SeamlessButton
   */
  get menuButtonRole() {
    return this[symbols.roles].menuButton;
  }
  set menuButtonRole(menuButtonRole) {
    this[symbols.hasDynamicTemplate] = true;
    this[symbols.roles].menuButton = menuButtonRole;
  }

  get [symbols.template]() {
    const result = template.html`
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
          /* For Edge */
          height: 100%;
          width: 100%;
        }
      </style>
      <div id="menuButton" aria-label="Open menu" tabindex="-1">
        <slot name="hamburgerIcon">
          <svg id="hamburgerIcon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"></path>
          </svg>
        </slot>
      </div>
      <div id="menu">
        <slot></slot>
      </div>
    `;
    template.findAndReplace(result, '#menuButton', this.menuButtonRole);
    template.findAndReplace(result, '#menu', this.menuRole);
    return result;
  }

  get updates() {
    const fromEdge = this.fromEdge;
    return merge(super.updates, {
      $: {
        menu: {
          fromEdge,
          opened: this.opened
        }
      }
    });
  }

}


customElements.define('elix-hamburger-menu-button', HamburgerMenuButton);
