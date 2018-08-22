import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import WrappedStandardElement from '../../src/WrappedStandardElement.js';


class CustomArrowButton extends WrappedStandardElement.wrap('button') {

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          align-items: center;
          display: flex;
          font-size: 28px;
          font-weight: bold;
          margin: 0.5em;
          -webkit-tap-highlight-color: transparent;
        }
        
        #inner {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.7);
          border: 2px solid transparent;
          box-sizing: border-box;
          color: inherit;
          color: rgba(255, 255, 255, 0.7);
          fill: currentColor;
          flex: 1;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          height: 48px;
          margin: 0;
          outline: none;
          padding: 0;
          position: relative;
          transform: scale(1.0);
          transition: background 0.3s, border-color 0.3s, color 0.3s, transform 0.3s;
          width: 48px;
        }

        :host(:hover) #inner:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.8);
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transform: scale(1.1);
        }

        #inner:disabled {
          color: rgba(255, 255, 255, 0.2);
          transform: scale(1.0);
        }
      </style>
      <button id="inner">
        <slot></slot>
      </button>
    `;
  }

}


customElements.define('custom-arrow-button', CustomArrowButton);
export default CustomArrowButton;
