import './QuietButton.js';
import { merge } from '../../src/updates.js';
import Drawer from '../../src/Drawer.js';
import OpenCloseMixin from '../../src/OpenCloseMixin.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import * as symbols from '../../src/symbols.js';


const Base =
  OpenCloseMixin(
    ReactiveElement
  );


export default class HamburgerMenu extends Base {

  componentDidMount() {
    this.$.menuButton.addEventListener('click', () => {
      this[symbols.raiseChangeEvents] = true;
      this.$.drawer.open();
      this[symbols.raiseChangeEvents] = false;
    });
  }

  get [symbols.template]() {
    // Hamburger icon from Google's Material Icons collection
    return `
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <quiet-button id="menuButton" aria-label="Open menu">
        <svg fill="#000000" height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
      </quiet-button>
      <elix-drawer id="drawer">
        <slot></slot>
      </elix-drawer>
    `;
  }

  get updates() {
    const opened = this.opened;
    return merge(super.updates, {
      $: {
        drawer: {
          opened
        }
      }
    });
  }

}


customElements.define('hamburger-menu', HamburgerMenu);
