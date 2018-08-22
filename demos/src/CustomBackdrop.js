import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';


class CustomBackdrop extends ReactiveElement {

  get [symbols.template]() {
    return template.html`
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
