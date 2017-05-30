import FocusRingMixin from '../../mixins/FocusRingMixin.js';
import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin.js';
import symbols from '../../mixins/symbols.js';


class FocusRingTest extends FocusRingMixin(ShadowTemplateMixin(HTMLElement)) {

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
          background: gray;
          color: white;
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
          outline: none;
        }
      </style>
      <button tabindex="-1">
        <slot></slot>
      </button>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
  }

}


customElements.define('focus-ring-test', FocusRingTest);
export default FocusRingTest;
