import * as symbols from '../../src/symbols.js';
import ElementBase from '../../src/ElementBase.js';


class CustomBackdrop extends ElementBase {

  get [symbols.template]() {
    return `
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
