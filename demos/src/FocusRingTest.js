import FocusRingMixin from '../../mixins/FocusRingMixin';
import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin';
import symbols from '../../mixins/symbols';


class FocusRingTest extends FocusRingMixin(ShadowTemplateMixin(HTMLElement)) {

  get [symbols.template]() {
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
    this.setAttribute('tabindex', '0');
  }

}
customElements.define('focus-ring-test', FocusRingTest);
