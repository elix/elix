/* Used by ArrowSelectionMixin  */


import ElementBase from './ElementBase.js';
import symbols from '../mixins/symbols.js';


class ArrowSelectionButton extends ElementBase {

  // Delegate disabled attribute to inner button.
  get disabled() {
    return this.$.button.disabled;
  }
  set disabled(disabled) {
    if (disabled === null) {
      this.$.button.removeAttribute('disabled');
    } else {
      this.$.button.setAttribute('disabled', disabled);
    }
  }

  get [symbols.template]() {
    return `
      <style>
        :host(:not([hidden])) {
          display: flex;
        }
        
        button {
          background: transparent;
          border: 1px solid transparent;
          box-sizing: border-box;
          color: rgba(255, 255, 255, 0.7);
          fill: currentColor;
          flex: 1;
          margin: 0;
          outline: none;
          padding: 0;
          position: relative;
          transition: opacity 1s;
        }

        button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
        }

        button:disabled {
          color: rgba(255, 255, 255, 0.3);
        }
      </style>
      <button id="button">
        <slot></slot>
      </button>
    `;
  }

}


// Simplistic detection of touch support.
function supportsTouch() {
  return 'ontouchstart' in window;
}


customElements.define('elix-arrow-selection-button', ArrowSelectionButton);
export default ArrowSelectionButton;
