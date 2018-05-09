import '../../src/Drawer.js';
import './QuietButton.js';
import { merge } from '../../src/updates.js';
import OpenCloseMixin from '../../src/OpenCloseMixin.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import * as symbols from '../../src/symbols.js';


const Base =
  OpenCloseMixin(
    ReactiveElement
  );


/**
 * A button that invokes a Drawer, typically used to provide navigation and
 * other UI on a mobile device.
 */
export default class HamburgerMenu extends Base {

  componentDidMount() {
    this.$.menuButton.addEventListener('click', () => {
      this[symbols.raiseChangeEvents] = true;
      this.open();
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.drawer.addEventListener('opened-changed', event => {
      /** @type {any} */
      const cast = event;
      this.setState({
        opened: cast.detail.opened
      });
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
        }

        #menuButton {
          display: block;
          height: 1.5em;
          width: 1.5em;
        }

        #hamburgerIcon {
          height: 100%;
          width: 100%;
        }
      </style>
      <quiet-button id="menuButton" aria-label="Open menu">
        <svg id="hamburgerIcon" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"></path>
        </svg>
      </quiet-button>
      <elix-drawer id="drawer">
        <slot></slot>
      </elix-drawer>
    `;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        drawer: {
          opened: this.opened
        }
      }
    });
  }

}


customElements.define('hamburger-menu', HamburgerMenu);
