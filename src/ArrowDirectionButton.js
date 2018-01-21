import WrappedStandardElement from './WrappedStandardElement.js';
import symbols from './symbols.js';


class ArrowDirectionButton extends WrappedStandardElement.wrap('button') {

  get [symbols.template]() {
    return `
      <style>
        :host(:not([hidden])) {
          display: flex;
        }
        
        #inner {
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

        #inner:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
        }

        #inner:disabled {
          color: rgba(255, 255, 255, 0.3);
        }
      </style>
      <button id="inner">
        <slot></slot>
      </button>
    `;
  }

}


customElements.define('elix-arrow-direction-button', ArrowDirectionButton);
export default ArrowDirectionButton;
