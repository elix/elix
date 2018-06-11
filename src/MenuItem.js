import ReactiveElement from './ReactiveElement.js';
import * as symbols from './symbols.js';


/**
 * Base class for menu items that want to exhibit a standard system menu item
 * appearance.
 * 
 * @inherits ReactiveElement
 */
class MenuItem extends ReactiveElement {

  get [symbols.template]() {
    /* Variety of system fonts */
    return `
      <style>
        :host {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-size: 10pt;
          padding-left: 2em !important;
          padding-right: 2em !important;
          white-space: nowrap;
        }
      </style>
      <slot></slot>
    `;
  }
}


export default MenuItem;
customElements.define('elix-menu-item', MenuItem);
