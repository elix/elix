//
// NOTE: This is a prototype, and not yet ready for real use.
//

import symbols from '../mixins/symbols.js';


export default function BackdropWrapper(base) {

  // The class prototype added by the mixin.
  class Backdrop extends base {

    // TODO: Make `backdrop` a symbol.
    get backdrop() {
      return this.shadowRoot.querySelector('#backdrop');
    }

    [symbols.template](filler) {
      const template = `
        <style>
          :host {
            height: 100%;
            left: 0;
            outline: none;
            position: fixed;
            top: 0;
            -webkit-tap-highlight-color: transparent;
            width: 100%;
          }

          #backdrop {
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            user-select: none;
            width: 100%;
          }

          #overlayContent {
            position: relative;
          }
        </style>
        <div id="backdrop" role="none"></div>
        <div id="overlayContent" role="none">
          ${filler || `<slot></slot>`}
        </div>
      `;
      return super[symbols.template] ?
        super[symbols.template](template) :
        template;
    }
  }

  return Backdrop;
}
