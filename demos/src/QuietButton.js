import FocusRingMixin from '../../src/FocusRingMixin.js';
import symbols from '../../src/symbols.js';
import WrappedStandardElement from '../../src/WrappedStandardElement.js';


const Base =
  FocusRingMixin(
    WrappedStandardElement.wrap('button')
  );


class QuietButton extends Base {
  get [symbols.template]() {
    return `
      <style>
        button {
          background: none;
          border: none;
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


customElements.define('quiet-button', QuietButton);
export default QuietButton;
