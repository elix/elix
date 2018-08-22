import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';


class CustomPageDot extends ReactiveElement {

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          background: rgb(255, 255, 255);
          box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
          cursor: pointer;
          height: 12px;
          margin: 7px 5px;
          padding: 0;
          transition: opacity 0.2s;
          width: 12px;
        }
      </style>
    `;
  }

}


customElements.define('custom-page-dot', CustomPageDot);
export default CustomPageDot;
