import FocusRingMixin from '../../mixins/FocusRingMixin.js';
import symbols from '../../mixins/symbols.js';
import WrappedStandardElement from '../../elements/WrappedStandardElement.js';


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
          padding: 0;
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
