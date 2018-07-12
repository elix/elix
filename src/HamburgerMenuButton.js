import './Drawer.js';
import './SeamlessButton.js';
import { merge } from './updates.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import * as symbols from './symbols.js';


const menuTagKey = Symbol('menuTag');
const menuButtonTagKey = Symbol('menuButtonTag');


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
 * @elementtag {Drawer} menu
 * @elementtag {SeamlessButton} menuButton
 */
export default class HamburgerMenuButton extends Base {

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

  get defaults() {
    return {
      tags: {
        menu: 'elix-drawer',
        menuButton: 'elix-seamless-button'
      }
    };
  }

  // Pressing Enter or Space is the same as clicking the menu button.
  [symbols.keydown](event) {
    /** @type {any} */
    const menuButton = this.$.menuButton;
    
    let handled;
    switch (event.key) {
      case 'Enter':
      case ' ':
        menuButton.click();
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  /**
   * The tag used to create the menu (drawer).
   * 
   * @type {string}
   * @default 'elix-drawer'
   */
  get menuTag() {
    return this[menuTagKey];
  }
  set menuTag(menuTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[menuTagKey] = menuTag;
  }

  /**
   * The tag used to create the menu button element.
   * 
   * @type {string}
   * @default 'elix-seamless-button'
   */
  get menuButtonTag() {
    return this[menuButtonTagKey];
  }
  set menuButtonTag(menuButtonTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[menuButtonTagKey] = menuButtonTag;
  }

  get [symbols.template]() {
    const menuTag = this.menuTag || this.defaults.tags.menu;
    const menuButtonTag = this.menuButtonTag || this.defaults.tags.menuButton;
    return `
      <style>
        :host {
          align-items: center;
          display: inline-flex;
          height: 1em;
          width: 1em;
        }

        #menuButton {
          align-items: center;
          display: inline-flex;
          flex: 1;
        }

        #hamburgerIcon {
          /* For Edge */
          height: 100%;
          width: 100%;
        }
      </style>
      <${menuButtonTag} id="menuButton" aria-label="Open menu" tabindex="-1">
        <slot name="hamburgerIcon">
          <svg id="hamburgerIcon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"></path>
          </svg>
        </slot>
      </${menuButtonTag}>
      <${menuTag} id="menu">
        <slot></slot>
      </${menuTag}>
    `;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        menu: {
          opened: this.opened
        }
      }
    });
  }

}


customElements.define('elix-hamburger-menu-button', HamburgerMenuButton);
