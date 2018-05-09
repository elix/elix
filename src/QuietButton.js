import * as symbols from './symbols.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base =
  FocusVisibleMixin(
    WrappedStandardElement.wrap('button')
  );


class QuietButton extends Base {
  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
        }
        
        button {
          background: none;
          border: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          height: 100%;
          padding: 0;
          width: 100%;
        }
      </style>

      <button id="inner" tabindex="0">
        <slot></slot>
      </button>
    `;
  }
}


customElements.define('elix-quiet-button', QuietButton);
export default QuietButton;
