import * as symbols from './symbols.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * Inactive item that helps group related menu items
 * 
 * See [Menu](Menu) for sample usage.
 * 
 * @inherits ReactiveElement
 */
class MenuSeparator extends ReactiveElement {

  componentDidMount() {
    super.componentDidMount();
    this.setAttribute('aria-hidden', 'true');
  }

  get disabled() {
    return true;
  }

  get [symbols.template]() {
    return template.html`
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
