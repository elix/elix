import * as symbols from '../../src/symbols.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import { html } from '../../src/templates.js';


class CustomBackdrop extends ReactiveElement {

  get [symbols.template]() {
    return html`
      <style>
        :host {
          background: white;
          height: 100%;
          left: 0;
          opacity: 0.5;
          position: absolute;
          top: 0;
          width: 100%;
        }
      </style>
      <slot></slot>
    `;
  }

}


customElements.define('custom-backdrop', CustomBackdrop);
export default CustomBackdrop;
