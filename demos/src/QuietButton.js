import FocusRingMixin from '../../mixins/FocusRingMixin.js';
import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin.js';
import symbols from '../../mixins/symbols.js';


class QuietButton extends FocusRingMixin(ShadowTemplateMixin(HTMLElement)) {
  [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
        }

        :host(:focus:not(.focus-ring)) {
          outline: none;
        }

        button {
          background: none;
          border: none;
          padding: 0;
        }
      </style>

      <button tabindex="0">
        <slot></slot>
      </button>
    `;
  }
}


customElements.define('quiet-button', QuietButton);
export default QuietButton;
