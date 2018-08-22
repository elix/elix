import { html } from './template.js';
import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * Base class for menu items that want to exhibit a standard system menu item
 * appearance.
 * 
 * This class is a convenient way to popuplate a [Menu](Menu) with items that
 * exhibit an appearance roughly consistent with operating system menu items.
 * Use of this class is not required, however -- a `Menu` can contain any type
 * of item you want.
 * 
 * @inherits ReactiveElement
 */
class MenuItem extends ReactiveElement {

  get [symbols.template]() {
    /* Variety of system fonts */
    return html`
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
