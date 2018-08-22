import { html } from './template.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * A standard menu separator: an inactive item that helps group
 * logically-related menu items together.
 * 
 * See [Menu](Menu) for sample usage.
 * 
 * @inherits ReactiveElement
 */
class MenuSeparator extends ReactiveElement {

  get disabled() {
    return true;
  }

  get [symbols.template]() {
    return html`
      <style>
        :host {
          padding: 0 !important;
        }

        hr {
          border-bottom-width: 0px;
          border-color: #fff; /* Ends up as light gray */
          border-top-width: 1px;
          margin: 0.25em 0;
        }
      </style>
      <hr>
    `;
  }

  get updates() {
    return merge(super.updates, {
      attributes: {
        'aria-hidden': true
      }
    });
  }

}


export default MenuSeparator;
customElements.define('elix-menu-separator', MenuSeparator);
