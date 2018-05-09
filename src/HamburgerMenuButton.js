import './Drawer.js';
import './QuietButton.js';
import { merge } from './updates.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import * as symbols from './symbols.js';


const menuTagKey = Symbol('menuTag');
const menuButtonTagKey = Symbol('menuButtonTag');


const Base =
  OpenCloseMixin(
    ReactiveElement
  );


/**
 * A button that invokes a menu (by default, a Drawer), typically used to
 * provide navigation and other UI on a mobile device.
 * 
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 * @elementtag {Drawer} menu
 * @elementtag {QuietButton} menuButton
 */
export default class HamburgerMenuButton extends Base {

  componentDidMount() {
    this.$.menuButton.addEventListener('click', () => {
      this[symbols.raiseChangeEvents] = true;
      this.open();
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.menu.addEventListener('opened-changed', event => {
      /** @type {any} */
      const cast = event;
      this.setState({
        opened: cast.detail.opened
      });
    });
  }

  get defaults() {
    return {
      tags: {
        menu: 'elix-drawer',
        menuButton: 'elix-quiet-button'
      }
    };
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
   * @default 'elix-quiet-button'
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
          display: inline-flex;
          height: 1em;
          width: 1em;
        }

        #menuButton {
          display: block;
          flex: 1;
        }
      </style>
      <${menuButtonTag} id="menuButton" aria-label="Open menu">
        <svg id="hamburgerIcon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 3 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"></path>
        </svg>
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
