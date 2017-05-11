//
// NOTE: This is a prototype, and not yet ready for real use.
//

import symbols from '../mixins/symbols.js';


export default function BackdropWrapper(base) {

  // The class prototype added by the mixin.
  class Backdrop extends base {

    get [symbols.template]() {
      let baseTemplate = super[symbols.template] || '';
      if (baseTemplate instanceof HTMLTemplateElement) {
        baseTemplate = baseTemplate.innerHTML; // Downgrade to string.
      }
      return `
        <style>
          :host {
            height: 100%;
            left: 0;
            outline: none;
            position: fixed;
            top: 0;
            width: 100%;
          }

          :host(:not(.visible)) {
            display: none;
          }

          #backdrop {
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            width: 100%;
          }

          #overlayContent {
            position: relative;
          }
        </style>
        <div id="backdrop" role="none"></div>
        <div id="overlayContent" role="none">
          ${baseTemplate}
        </div>
      `;
    }
  }

  return Backdrop;
}
