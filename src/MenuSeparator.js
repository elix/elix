import ReactiveElement from './ReactiveElement.js';
import * as symbols from './symbols.js';


class MenuSeparator extends ReactiveElement {

  get disabled() {
    return true;
  }

  get [symbols.template]() {
    return `
      <style>
        hr {
          border-bottom-width: 0px;
          border-color: inherit;
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
