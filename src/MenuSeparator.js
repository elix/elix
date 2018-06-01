import ReactiveElement from './ReactiveElement.js';
import * as symbols from './symbols.js';


class MenuSeparator extends ReactiveElement {

  get disabled() {
    return true;
  }

  get [symbols.template]() {
    return `
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

}


export default MenuSeparator;
customElements.define('elix-menu-separator', MenuSeparator);
